package com.campusconnect.controller;

import com.campusconnect.dto.ApiResponse;
import com.campusconnect.entity.Registration;
import com.campusconnect.entity.User;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.security.UserPrincipal;
import com.campusconnect.service.RegistrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
public class RegistrationController {

    private final RegistrationService registrationService;
    private final UserRepository userRepository;

    public RegistrationController(RegistrationService registrationService, UserRepository userRepository) {
        this.registrationService = registrationService;
        this.userRepository = userRepository;
    }

    @PostMapping("/api/events/{id}/register")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Registration>> registerForEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        User student = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Registration registration = registrationService.registerStudentForEvent(id, student);
        return ResponseEntity.ok(ApiResponse.ok("Registration successful! Check your email and dashboard.", registration));
    }

    @DeleteMapping("/api/registrations/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<String>> cancelRegistration(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        User student = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        registrationService.cancelRegistration(id, student);
        return ResponseEntity.ok(ApiResponse.ok("Registration cancelled successfully", null));
    }
}
