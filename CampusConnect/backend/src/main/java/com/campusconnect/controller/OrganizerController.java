package com.campusconnect.controller;

import com.campusconnect.dto.ApiResponse;
import com.campusconnect.dto.AttendanceDto;
import com.campusconnect.dto.DashboardStatsDto;
import com.campusconnect.dto.EventDto;
import com.campusconnect.entity.User;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.security.UserPrincipal;
import com.campusconnect.service.DashboardService;
import com.campusconnect.service.EventService;
import com.campusconnect.service.PassportService;
import com.campusconnect.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizer")
@PreAuthorize("hasRole('ORGANIZER')")
public class OrganizerController {

    private final EventService eventService;
    private final RegistrationService registrationService;
    private final PassportService passportService;
    private final DashboardService dashboardService;
    private final UserRepository userRepository;

    public OrganizerController(EventService eventService,
                               RegistrationService registrationService,
                               PassportService passportService,
                               DashboardService dashboardService,
                               UserRepository userRepository) {
        this.eventService = eventService;
        this.registrationService = registrationService;
        this.passportService = passportService;
        this.dashboardService = dashboardService;
        this.userRepository = userRepository;
    }

    @PostMapping("/events")
    public ResponseEntity<ApiResponse<EventDto.EventResponseDto>> createEvent(
            @Valid @RequestBody EventDto.EventCreateDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        User organizer = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Organizer not found"));

        EventDto.EventResponseDto created = eventService.createEvent(dto, organizer);
        return ResponseEntity.ok(ApiResponse.ok("Event submitted successfully and is pending college administration review.", created));
    }

    @GetMapping("/events")
    public ResponseEntity<ApiResponse<List<EventDto.EventResponseDto>>> getMyEvents(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        List<EventDto.EventResponseDto> events = eventService.getEventsByOrganizer(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(events));
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<ApiResponse<EventDto.EventResponseDto>> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventDto.EventCreateDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        User organizer = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Organizer not found"));

        EventDto.EventResponseDto updated = eventService.updateEvent(id, dto, organizer);
        return ResponseEntity.ok(ApiResponse.ok("Event updated and resubmitted for administration review.", updated));
    }

    /**
     * Strict Backend Ownership Check: Organizer A can never access Organizer B's participants!
     */
    @GetMapping("/events/{id}/registrations")
    public ResponseEntity<ApiResponse<List<AttendanceDto.AttendanceRecordDto>>> getEventRegistrations(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        User organizer = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Organizer not found"));

        List<AttendanceDto.AttendanceRecordDto> participants =
                registrationService.getEventParticipantsForOrganizer(id, organizer);

        return ResponseEntity.ok(ApiResponse.ok(participants));
    }

    @PostMapping("/events/{id}/attendance")
    public ResponseEntity<ApiResponse<String>> markAttendance(
            @PathVariable Long id,
            @RequestBody AttendanceDto.MarkAttendanceRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        User organizer = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Organizer not found"));

        passportService.markAttendanceByOrganizer(id, request.getStudentId(), request.getPresent(), organizer);
        return ResponseEntity.ok(ApiResponse.ok("Attendance marked. Administration will verify for Campus Passport points.", null));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDto.OrganizerDashboardStatsDto>> getDashboardStats(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        DashboardStatsDto.OrganizerDashboardStatsDto stats = dashboardService.getOrganizerStats(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
