package com.campusconnect.service;

import com.campusconnect.dto.AttendanceDto;
import com.campusconnect.dto.PassportDto;
import com.campusconnect.entity.*;
import com.campusconnect.exception.BadRequestException;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.exception.UnauthorizedException;
import com.campusconnect.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PassportService {

    private final AttendanceRepository attendanceRepository;
    private final PassportPointRepository passportPointRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final BadgeRepository badgeRepository;
    private final StudentBadgeRepository studentBadgeRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public PassportService(AttendanceRepository attendanceRepository,
                           PassportPointRepository passportPointRepository,
                           StudentProfileRepository studentProfileRepository,
                           BadgeRepository badgeRepository,
                           StudentBadgeRepository studentBadgeRepository,
                           EventRepository eventRepository,
                           UserRepository userRepository,
                           NotificationService notificationService) {
        this.attendanceRepository = attendanceRepository;
        this.passportPointRepository = passportPointRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.badgeRepository = badgeRepository;
        this.studentBadgeRepository = studentBadgeRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    /**
     * Event Organizer marks attendance for participants in their own event.
     */
    @Transactional
    public void markAttendanceByOrganizer(Long eventId, Long studentId, boolean present, User organizer) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        // BACKEND OWNERSHIP CHECK: Only organizer of event can mark attendance
        if (!event.getOrganizer().getId().equals(organizer.getId())) {
            throw new UnauthorizedException("You are not authorized to mark attendance for this event.");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        Attendance attendance = attendanceRepository.findByEventIdAndStudentId(eventId, studentId)
                .orElseGet(() -> new Attendance(event, student));

        attendance.setMarkedByOrganizer(present);
        attendance.setOrganizerMarkedAt(LocalDateTime.now());
        attendance.setStatus(present ? AttendanceStatus.PENDING_VERIFICATION : AttendanceStatus.ABSENT);

        attendanceRepository.save(attendance);
    }

    /**
     * College Administration verifies attendance and awards Campus Passport XP points.
     */
    @Transactional
    public void verifyAttendanceByAdmin(Long attendanceId, boolean verified, int pointsToAward, User admin) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found with id: " + attendanceId));

        if (attendance.getVerifiedByAdmin()) {
            throw new BadRequestException("This attendance record has already been verified.");
        }

        attendance.setVerifiedByAdmin(verified);
        attendance.setAdminVerifiedAt(LocalDateTime.now());
        attendance.setStatus(verified ? AttendanceStatus.VERIFIED : AttendanceStatus.ABSENT);
        attendanceRepository.save(attendance);

        if (verified) {
            User student = attendance.getStudent();
            Event event = attendance.getEvent();

            // Prevent duplicate points for same event
            if (!passportPointRepository.existsByStudentIdAndEventId(student.getId(), event.getId())) {
                int points = pointsToAward > 0 ? pointsToAward : 50;

                // 1. Record point transaction
                PassportPoint pointRecord = new PassportPoint(
                        student,
                        event,
                        points,
                        "Verified participation in: " + event.getTitle()
                );
                passportPointRepository.save(pointRecord);

                // 2. Update student profile total XP and Level
                StudentProfile profile = studentProfileRepository.findByUserId(student.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

                int newTotalXp = profile.getTotalXp() + points;
                profile.setTotalXp(newTotalXp);
                profile.setCurrentLevel(calculateLevel(newTotalXp));
                studentProfileRepository.save(profile);

                // 3. Evaluate and award badges
                evaluateBadges(student, profile);

                // 4. Send notification
                notificationService.createNotification(
                        student,
                        "Campus Passport Points Awarded! ⭐",
                        "Your attendance at \"" + event.getTitle() + "\" was verified by Administration! You earned +" + points + " XP.",
                        "PASSPORT",
                        "EVENT",
                        event.getId()
                );
            }
        }
    }

    @Transactional(readOnly = true)
    public List<AttendanceDto.AttendanceRecordDto> getPendingAttendanceVerifications() {
        return attendanceRepository.findAll().stream()
                .filter(a -> a.getMarkedByOrganizer() && !a.getVerifiedByAdmin())
                .map(a -> {
                    AttendanceDto.AttendanceRecordDto dto = new AttendanceDto.AttendanceRecordDto();
                    dto.setId(a.getId());
                    dto.setEventId(a.getEvent().getId());
                    dto.setEventTitle(a.getEvent().getTitle());
                    dto.setStudentId(a.getStudent().getId());
                    dto.setStudentName(a.getStudent().getFullName());
                    dto.setStudentEmail(a.getStudent().getEmail());
                    dto.setMarkedByOrganizer(a.getMarkedByOrganizer());
                    dto.setOrganizerMarkedAt(a.getOrganizerMarkedAt());
                    dto.setVerifiedByAdmin(a.getVerifiedByAdmin());
                    dto.setStatus(a.getStatus());

                    Optional<StudentProfile> sp = studentProfileRepository.findByUserId(a.getStudent().getId());
                    if (sp.isPresent()) {
                        dto.setRegistrationNumber(sp.get().getRegistrationNumber());
                        dto.setDepartment(sp.get().getDepartment());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PassportDto.PassportSummaryDto getStudentPassportSummary(Long studentId) {
        StudentProfile profile = studentProfileRepository.findByUserId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        int totalXp = profile.getTotalXp();
        String currentLevel = calculateLevel(totalXp);
        int nextLevelThreshold = getNextLevelThreshold(totalXp);
        int currentLevelFloor = getCurrentLevelFloor(totalXp);

        int progressPercentage = nextLevelThreshold > currentLevelFloor
                ? Math.min(100, Math.max(0, (totalXp - currentLevelFloor) * 100 / (nextLevelThreshold - currentLevelFloor)))
                : 100;

        long verifiedEventsCount = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.VERIFIED);
        List<StudentBadge> studentBadges = studentBadgeRepository.findByStudentId(studentId);
        Set<Long> earnedBadgeIds = studentBadges.stream().map(sb -> sb.getBadge().getId()).collect(Collectors.toSet());
        Map<Long, LocalDateTime> earnedDateMap = studentBadges.stream()
                .collect(Collectors.toMap(sb -> sb.getBadge().getId(), StudentBadge::getEarnedAt, (k1, k2) -> k1));

        List<Badge> allBadges = badgeRepository.findAll();
        List<PassportDto.BadgeStatusDto> badgeDtos = allBadges.stream().map(b -> {
            PassportDto.BadgeStatusDto dto = new PassportDto.BadgeStatusDto();
            dto.setId(b.getId());
            dto.setName(b.getName());
            dto.setDescription(b.getDescription());
            dto.setIcon(b.getIcon());
            dto.setRequiredEvents(b.getRequiredEvents());
            dto.setRequiredXp(b.getRequiredXp());
            dto.setBadgeType(b.getBadgeType());
            dto.setEarned(earnedBadgeIds.contains(b.getId()));
            dto.setEarnedAt(earnedDateMap.get(b.getId()));
            return dto;
        }).collect(Collectors.toList());

        List<PassportDto.PointRecordDto> history = passportPointRepository.findByStudentIdOrderByAwardedAtDesc(studentId)
                .stream().map(p -> {
                    PassportDto.PointRecordDto dto = new PassportDto.PointRecordDto();
                    dto.setId(p.getId());
                    dto.setPoints(p.getPoints());
                    dto.setReason(p.getReason());
                    dto.setEventTitle(p.getEvent() != null ? p.getEvent().getTitle() : "Campus Activity");
                    dto.setAwardedAt(p.getAwardedAt());
                    return dto;
                }).collect(Collectors.toList());

        PassportDto.PassportSummaryDto summary = new PassportDto.PassportSummaryDto();
        summary.setTotalXp(totalXp);
        summary.setCurrentLevel(currentLevel);
        summary.setNextLevelXp(nextLevelThreshold);
        summary.setProgressPercentage(progressPercentage);
        summary.setEventsAttended(verifiedEventsCount);
        summary.setBadgesEarned(studentBadges.size());
        summary.setBadges(badgeDtos);
        summary.setHistory(history);

        return summary;
    }

    private void evaluateBadges(User student, StudentProfile profile) {
        long verifiedEvents = attendanceRepository.countByStudentIdAndStatus(student.getId(), AttendanceStatus.VERIFIED);
        int totalXp = profile.getTotalXp();

        List<Badge> allBadges = badgeRepository.findAll();
        for (Badge badge : allBadges) {
            if (!studentBadgeRepository.existsByStudentIdAndBadgeId(student.getId(), badge.getId())) {
                boolean qualifies = (verifiedEvents >= badge.getRequiredEvents()) || (totalXp >= badge.getRequiredXp());
                if (qualifies) {
                    studentBadgeRepository.save(new StudentBadge(student, badge));

                    notificationService.createNotification(
                            student,
                            "New Badge Unlocked! 🏆",
                            "Congratulations! You unlocked the \"" + badge.getName() + "\" badge on your Campus Passport.",
                            "PASSPORT",
                            "BADGE",
                            badge.getId()
                    );
                }
            }
        }
    }

    public static String calculateLevel(int xp) {
        if (xp >= 1000) return "Campus Legend";
        if (xp >= 500) return "Master";
        if (xp >= 250) return "Achiever";
        if (xp >= 100) return "Explorer";
        return "Novice";
    }

    public static int getNextLevelThreshold(int xp) {
        if (xp >= 1000) return 2000;
        if (xp >= 500) return 1000;
        if (xp >= 250) return 500;
        if (xp >= 100) return 250;
        return 100;
    }

    public static int getCurrentLevelFloor(int xp) {
        if (xp >= 1000) return 1000;
        if (xp >= 500) return 500;
        if (xp >= 250) return 250;
        if (xp >= 100) return 100;
        return 0;
    }
}
