package com.campusconnect.service;

import com.campusconnect.dto.AttendanceDto;
import com.campusconnect.entity.*;
import com.campusconnect.exception.BadRequestException;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.exception.UnauthorizedException;
import com.campusconnect.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final AttendanceRepository attendanceRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final NotificationService notificationService;

    public RegistrationService(RegistrationRepository registrationRepository,
                               EventRepository eventRepository,
                               AttendanceRepository attendanceRepository,
                               StudentProfileRepository studentProfileRepository,
                               NotificationService notificationService) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.attendanceRepository = attendanceRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public synchronized Registration registerStudentForEvent(Long eventId, User student) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (event.getStatus() != EventStatus.APPROVED) {
            throw new BadRequestException("Registration is not permitted. Event is not approved.");
        }

        if (LocalDateTime.now().isAfter(event.getRegistrationDeadline())) {
            throw new BadRequestException("Registration deadline has passed for this event.");
        }

        if (event.getCurrentRegistrations() >= event.getMaxCapacity()) {
            throw new BadRequestException("This event has reached maximum participant capacity (" + event.getMaxCapacity() + ").");
        }

        // Check if student already registered
        Optional<Registration> existingReg = registrationRepository.findByEventIdAndStudentId(eventId, student.getId());
        if (existingReg.isPresent()) {
            if (existingReg.get().getStatus() == RegistrationStatus.CONFIRMED) {
                throw new BadRequestException("You have already registered for this event.");
            } else if (existingReg.get().getStatus() == RegistrationStatus.CANCELLED) {
                // Reactivate registration
                Registration reg = existingReg.get();
                reg.setStatus(RegistrationStatus.CONFIRMED);
                reg.setRegistrationDate(LocalDateTime.now());
                reg.setCancelledAt(null);

                event.setCurrentRegistrations(event.getCurrentRegistrations() + 1);
                eventRepository.save(event);
                Registration saved = registrationRepository.save(reg);

                sendRegistrationNotifications(event, student);
                return saved;
            }
        }

        // New registration
        Registration registration = new Registration(event, student);
        event.setCurrentRegistrations(event.getCurrentRegistrations() + 1);
        eventRepository.save(event);
        Registration saved = registrationRepository.save(registration);

        // Create or ensure attendance record is prepared for tracking
        if (attendanceRepository.findByEventIdAndStudentId(eventId, student.getId()).isEmpty()) {
            Attendance attendance = new Attendance(event, student);
            attendanceRepository.save(attendance);
        }

        sendRegistrationNotifications(event, student);
        return saved;
    }

    @Transactional
    public void cancelRegistration(Long registrationId, User student) {
        Registration reg = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration record not found with id: " + registrationId));

        if (!reg.getStudent().getId().equals(student.getId())) {
            throw new UnauthorizedException("You cannot cancel another student's registration.");
        }

        if (reg.getStatus() == RegistrationStatus.CANCELLED) {
            throw new BadRequestException("Registration is already cancelled.");
        }

        Event event = reg.getEvent();
        if (LocalDateTime.now().isAfter(event.getRegistrationDeadline())) {
            throw new BadRequestException("Registration cancellation period has closed for this event.");
        }

        reg.setStatus(RegistrationStatus.CANCELLED);
        reg.setCancelledAt(LocalDateTime.now());
        registrationRepository.save(reg);

        // Decrement event currentRegistrations count safely
        if (event.getCurrentRegistrations() > 0) {
            event.setCurrentRegistrations(event.getCurrentRegistrations() - 1);
            eventRepository.save(event);
        }

        // Notify student & organizer
        notificationService.createNotification(
                student,
                "Registration Cancelled",
                "Your registration for \"" + event.getTitle() + "\" has been cancelled.",
                "REGISTRATION",
                "EVENT",
                event.getId()
        );

        notificationService.createNotification(
                event.getOrganizer(),
                "Registration Cancellation Notice",
                "Student " + student.getFullName() + " cancelled their registration for \"" + event.getTitle() + "\".",
                "REGISTRATION",
                "EVENT",
                event.getId()
        );
    }

    @Transactional(readOnly = true)
    public List<Registration> getStudentRegistrations(Long studentId) {
        return registrationRepository.findByStudentIdOrderByRegistrationDateDesc(studentId);
    }

    /**
     * Strict backend ownership check: Organizer can ONLY access registrations for events they created.
     */
    @Transactional(readOnly = true)
    public List<AttendanceDto.AttendanceRecordDto> getEventParticipantsForOrganizer(Long eventId, User organizer) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        // BACKEND OWNERSHIP VALIDATION
        if (!event.getOrganizer().getId().equals(organizer.getId())) {
            throw new UnauthorizedException("Security Violation: You are not authorized to view or manage registrations for events created by another organizer.");
        }

        List<Registration> registrations = registrationRepository.findByEventIdOrderByRegistrationDateDesc(eventId);

        return registrations.stream().map(reg -> {
            AttendanceDto.AttendanceRecordDto dto = new AttendanceDto.AttendanceRecordDto();
            dto.setId(reg.getId());
            dto.setEventId(event.getId());
            dto.setEventTitle(event.getTitle());
            dto.setStudentId(reg.getStudent().getId());
            dto.setStudentName(reg.getStudent().getFullName());
            dto.setStudentEmail(reg.getStudent().getEmail());

            Optional<StudentProfile> profile = studentProfileRepository.findByUserId(reg.getStudent().getId());
            if (profile.isPresent()) {
                dto.setRegistrationNumber(profile.get().getRegistrationNumber());
                dto.setDepartment(profile.get().getDepartment());
            }

            Optional<Attendance> attendance = attendanceRepository.findByEventIdAndStudentId(event.getId(), reg.getStudent().getId());
            if (attendance.isPresent()) {
                dto.setMarkedByOrganizer(attendance.get().getMarkedByOrganizer());
                dto.setOrganizerMarkedAt(attendance.get().getOrganizerMarkedAt());
                dto.setVerifiedByAdmin(attendance.get().getVerifiedByAdmin());
                dto.setAdminVerifiedAt(attendance.get().getAdminVerifiedAt());
                dto.setStatus(attendance.get().getStatus());
            }

            return dto;
        }).collect(Collectors.toList());
    }

    private void sendRegistrationNotifications(Event event, User student) {
        notificationService.createNotification(
                student,
                "Registration Confirmed! 🎉",
                "You have successfully registered for \"" + event.getTitle() + "\". See you at " + event.getVenue() + " on " + event.getEventDate() + "!",
                "REGISTRATION",
                "EVENT",
                event.getId()
        );

        notificationService.createNotification(
                event.getOrganizer(),
                "New Participant Registered!",
                "Student " + student.getFullName() + " registered for \"" + event.getTitle() + "\". Total: " + event.getCurrentRegistrations() + "/" + event.getMaxCapacity(),
                "REGISTRATION",
                "EVENT",
                event.getId()
        );
    }
}
