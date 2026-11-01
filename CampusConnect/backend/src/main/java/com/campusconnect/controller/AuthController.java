package com.campusconnect.controller;

import com.campusconnect.dto.ApiResponse;
import com.campusconnect.dto.AuthDto;
import com.campusconnect.entity.User;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.security.UserPrincipal;
import com.campusconnect.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthDto.AuthResponse>> login(@Valid @RequestBody AuthDto.LoginRequest request) {
        AuthDto.AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthDto.AuthResponse>> register(@Valid @RequestBody AuthDto.RegisterRequest request) {
        AuthDto.AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok("Registration successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.ok(ApiResponse.error("Unauthenticated"));
        }
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(ApiResponse.ok(user));
    }
}
