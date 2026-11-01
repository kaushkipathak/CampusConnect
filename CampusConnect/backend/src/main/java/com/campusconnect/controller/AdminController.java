package com.campusconnect.controller;

import com.campusconnect.dto.ApiResponse;
import com.campusconnect.dto.AttendanceDto;
import com.campusconnect.dto.DashboardStatsDto;
import com.campusconnect.dto.EventDto;
import com.campusconnect.entity.Role;
import com.campusconnect.entity.User;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.security.UserPrincipal;
import com.campusconnect.service.DashboardService;
import com.campusconnect.service.EventService;
import com.campusconnect.service.PassportService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('COLLEGE_ADMIN')")
public class AdminController {

    private final DashboardService dashboardService;
    private final EventService eventService;
    private final PassportService passportService;
    private final UserRepository userRepository;

    public AdminController(DashboardService dashboardService,
                           EventService eventService,
                           PassportService passportService,
                           UserRepository userRepository) {
        this.dashboardService = dashboardService;
        this.eventService = eventService;
        this.passportService = passportService;
        this.userRepository = userRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDto.AdminDashboardStatsDto>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getAdminStats()));
    }

    @GetMapping("/events/pending")
    public ResponseEntity<ApiResponse<List<EventDto.EventResponseDto>>> getPendingEvents() {
        return ResponseEntity.ok(ApiResponse.ok(eventService.getPendingEvents()));
    }

    @GetMapping("/events")
    public ResponseEntity<ApiResponse<List<EventDto.EventResponseDto>>> getAllEvents() {
        return ResponseEntity.ok(ApiResponse.ok(eventService.getAllEventsForAdmin()));
    }

    @PutMapping("/events/{id}/approve")
    public ResponseEntity<ApiResponse<EventDto.EventResponseDto>> approveEvent(
            @PathVariable Long id,
            @RequestBody(required = false) EventDto.EventApprovalRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        User admin = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        String comments = request != null ? request.getComments() : "Approved by College Administration";
        EventDto.EventResponseDto approved = eventService.approveEvent(id, admin, comments);
        return ResponseEntity.ok(ApiResponse.ok("Event approved successfully and published to students", approved));
    }

    @PutMapping("/events/{id}/reject")
    public ResponseEntity<ApiResponse<EventDto.EventResponseDto>> rejectEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventDto.EventApprovalRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        User admin = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        EventDto.EventResponseDto rejected = eventService.rejectEvent(id, admin, request.getComments());
        return ResponseEntity.ok(ApiResponse.ok("Event rejected. Organizer has been notified with the reason.", rejected));
    }

    @GetMapping("/attendance/pending")
    public ResponseEntity<ApiResponse<List<AttendanceDto.AttendanceRecordDto>>> getPendingAttendance() {
        return ResponseEntity.ok(ApiResponse.ok(passportService.getPendingAttendanceVerifications()));
    }

    @PutMapping("/attendance/{id}/verify")
    public ResponseEntity<ApiResponse<String>> verifyAttendance(
            @PathVariable Long id,
            @RequestBody AttendanceDto.VerifyAttendanceRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        User admin = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        passportService.verifyAttendanceByAdmin(id, request.getVerified(), request.getPoints(), admin);
        return ResponseEntity.ok(ApiResponse.ok("Attendance verified and Campus Passport points/badges awarded", null));
    }

    @GetMapping("/organizers")
    public ResponseEntity<ApiResponse<List<User>>> getOrganizers() {
        return ResponseEntity.ok(ApiResponse.ok(userRepository.findByRole(Role.ORGANIZER)));
    }
}
