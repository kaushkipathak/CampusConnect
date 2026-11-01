package com.campusconnect.service;

import com.campusconnect.dto.EventDto;
import com.campusconnect.entity.*;
import com.campusconnect.exception.BadRequestException;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.exception.UnauthorizedException;
import com.campusconnect.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final EventCategoryRepository categoryRepository;
    private final EventApprovalRepository approvalRepository;
    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public EventService(EventRepository eventRepository,
                        EventCategoryRepository categoryRepository,
                        EventApprovalRepository approvalRepository,
                        RegistrationRepository registrationRepository,
                        UserRepository userRepository,
                        NotificationService notificationService) {
        this.eventRepository = eventRepository;
        this.categoryRepository = categoryRepository;
        this.approvalRepository = approvalRepository;
        this.registrationRepository = registrationRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public EventDto.EventResponseDto createEvent(EventDto.EventCreateDto dto, User organizer) {
        EventCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        Event event = new Event();
        mapDtoToEvent(dto, event, category);
        event.setOrganizer(organizer);
        event.setStatus(EventStatus.PENDING);
        event.setCurrentRegistrations(0);
        event.setRejectionReason(null);

        Event saved = eventRepository.save(event);

        // Notify Admins about new event submission
        List<User> admins = userRepository.findByRole(Role.COLLEGE_ADMIN);
        for (User admin : admins) {
            notificationService.createNotification(
                    admin,
                    "New Event Submitted for Approval",
                    "Organizer " + organizer.getFullName() + " submitted \"" + saved.getTitle() + "\" for review.",
                    "APPROVAL",
                    "EVENT",
                    saved.getId()
            );
        }

        return convertToDto(saved, null);
    }

    @Transactional
    public EventDto.EventResponseDto updateEvent(Long eventId, EventDto.EventCreateDto dto, User organizer) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        // Ownership enforcement
        if (!event.getOrganizer().getId().equals(organizer.getId())) {
            throw new UnauthorizedException("You do not have permission to modify this event.");
        }

        if (event.getStatus() == EventStatus.APPROVED) {
            throw new BadRequestException("Approved events cannot be directly edited. Please contact administration.");
        }

        EventCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        mapDtoToEvent(dto, event, category);

        // If it was rejected, editing it resets status to PENDING for re-approval
        event.setStatus(EventStatus.PENDING);
        event.setRejectionReason(null);

        Event updated = eventRepository.save(event);

        // Notify Admins about resubmission
        List<User> admins = userRepository.findByRole(Role.COLLEGE_ADMIN);
        for (User admin : admins) {
            notificationService.createNotification(
                    admin,
                    "Event Resubmitted for Review",
                    "Organizer " + organizer.getFullName() + " resubmitted updated details for \"" + updated.getTitle() + "\".",
                    "APPROVAL",
                    "EVENT",
                    updated.getId()
            );
        }

        return convertToDto(updated, null);
    }

    @Transactional(readOnly = true)
    public List<EventDto.EventResponseDto> getApprovedEvents(Long categoryId, String search, LocalDate fromDate, LocalDate toDate, User currentStudent) {
        List<Event> events = eventRepository.searchApprovedEvents(EventStatus.APPROVED, categoryId, search, fromDate, toDate);
        return events.stream().map(e -> convertToDto(e, currentStudent)).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventDto.EventResponseDto getEventById(Long id, User currentUser) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        // Students can only view approved events
        if (currentUser == null || currentUser.getRole() == Role.STUDENT) {
            if (event.getStatus() != EventStatus.APPROVED) {
                throw new UnauthorizedException("This event is currently pending administrative review or rejected.");
            }
        } else if (currentUser.getRole() == Role.ORGANIZER) {
            // Organizer can view their own event even if pending/rejected, or approved events
            if (event.getStatus() != EventStatus.APPROVED && !event.getOrganizer().getId().equals(currentUser.getId())) {
                throw new UnauthorizedException("You cannot view pending or rejected events from another organizer.");
            }
        }

        return convertToDto(event, currentUser);
    }

    @Transactional(readOnly = true)
    public List<EventDto.EventResponseDto> getEventsByOrganizer(Long organizerId) {
        return eventRepository.findByOrganizerIdOrderByCreatedAtDesc(organizerId)
                .stream()
                .map(e -> convertToDto(e, null))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventDto.EventResponseDto> getPendingEvents() {
        return eventRepository.findByStatusOrderByEventDateAsc(EventStatus.PENDING)
                .stream()
                .map(e -> convertToDto(e, null))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventDto.EventResponseDto> getAllEventsForAdmin() {
        return eventRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(e -> convertToDto(e, null))
                .collect(Collectors.toList());
    }

    @Transactional
    public EventDto.EventResponseDto approveEvent(Long eventId, User admin, String comments) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        event.setStatus(EventStatus.APPROVED);
        event.setRejectionReason(null);
        Event saved = eventRepository.save(event);

        // Record approval history
        approvalRepository.save(new EventApproval(saved, admin, "APPROVED", comments != null ? comments : "Approved by Administration"));

        // Notify organizer
        notificationService.createNotification(
                event.getOrganizer(),
                "Event Approved!",
                "Your event \"" + event.getTitle() + "\" has been approved and is now live for student registrations.",
                "APPROVAL",
                "EVENT",
                event.getId()
        );

        return convertToDto(saved, null);
    }

    @Transactional
    public EventDto.EventResponseDto rejectEvent(Long eventId, User admin, String reason) {
        if (reason == null || reason.trim().isBlank()) {
            throw new BadRequestException("A mandatory rejection reason must be provided.");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        event.setStatus(EventStatus.REJECTED);
        event.setRejectionReason(reason.trim());
        Event saved = eventRepository.save(event);

        // Record approval history
        approvalRepository.save(new EventApproval(saved, admin, "REJECTED", reason.trim()));

        // Notify organizer
        notificationService.createNotification(
                event.getOrganizer(),
                "Event Requires Changes / Rejected",
                "Your event \"" + event.getTitle() + "\" was rejected. Reason: " + reason.trim() + ". You can edit and resubmit.",
                "APPROVAL",
                "EVENT",
                event.getId()
        );

        return convertToDto(saved, null);
    }

    public EventDto.EventResponseDto convertToDto(Event event, User currentUser) {
        EventDto.EventResponseDto dto = new EventDto.EventResponseDto();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setCategoryId(event.getCategory().getId());
        dto.setCategoryName(event.getCategory().getName());
        dto.setOrganizerId(event.getOrganizer().getId());
        dto.setOrganizerName(event.getOrganizer().getFullName());
        dto.setOrganizerEmail(event.getOrganizer().getEmail());
        dto.setPosterUrl(event.getPosterUrl());
        dto.setEventDate(event.getEventDate());
        dto.setStartTime(event.getStartTime());
        dto.setEndTime(event.getEndTime());
        dto.setVenue(event.getVenue());
        dto.setEligibility(event.getEligibility());
        dto.setRegistrationDeadline(event.getRegistrationDeadline());
        dto.setMaxCapacity(event.getMaxCapacity());
        dto.setCurrentRegistrations(event.getCurrentRegistrations());
        dto.setRemainingSeats(event.getRemainingSeats());
        dto.setStatus(event.getStatus());
        dto.setRejectionReason(event.getRejectionReason());
        dto.setTags(event.getTags());
        dto.setCreatedAt(event.getCreatedAt());

        if (currentUser != null && currentUser.getRole() == Role.STUDENT) {
            boolean isReg = registrationRepository.existsByEventIdAndStudentIdAndStatus(
                    event.getId(), currentUser.getId(), RegistrationStatus.CONFIRMED);
            dto.setRegistered(isReg);
        }

        return dto;
    }

    private void mapDtoToEvent(EventDto.EventCreateDto dto, Event event, EventCategory category) {
        event.setTitle(dto.getTitle().trim());
        event.setDescription(dto.getDescription().trim());
        event.setCategory(category);
        event.setPosterUrl(dto.getPosterUrl());
        event.setEventDate(dto.getEventDate());
        event.setStartTime(dto.getStartTime());
        event.setEndTime(dto.getEndTime());
        event.setVenue(dto.getVenue().trim());
        event.setEligibility(dto.getEligibility() != null ? dto.getEligibility().trim() : "All Students");
        event.setRegistrationDeadline(dto.getRegistrationDeadline());
        event.setMaxCapacity(dto.getMaxCapacity());
        event.setTags(dto.getTags());
    }
}
