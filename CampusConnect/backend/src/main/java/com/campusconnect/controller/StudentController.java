package com.campusconnect.controller;

import com.campusconnect.dto.ApiResponse;
import com.campusconnect.dto.EventDto;
import com.campusconnect.dto.StudentDto;
import com.campusconnect.entity.Interest;
import com.campusconnect.entity.Registration;
import com.campusconnect.entity.StudentProfile;
import com.campusconnect.entity.User;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.InterestRepository;
import com.campusconnect.repository.StudentProfileRepository;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.security.UserPrincipal;
import com.campusconnect.service.EventService;
import com.campusconnect.service.RecommendationService;
import com.campusconnect.service.RegistrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final InterestRepository interestRepository;
    private final RecommendationService recommendationService;
    private final RegistrationService registrationService;
    private final EventService eventService;

    public StudentController(UserRepository userRepository,
                             StudentProfileRepository profileRepository,
                             InterestRepository interestRepository,
                             RecommendationService recommendationService,
                             RegistrationService registrationService,
                             EventService eventService) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.interestRepository = interestRepository;
        this.recommendationService = recommendationService;
        this.registrationService = registrationService;
        this.eventService = eventService;
    }

    @GetMapping("/interests/all")
    public ResponseEntity<ApiResponse<List<StudentDto.InterestDto>>> getAllInterests() {
        List<StudentDto.InterestDto> dtos = interestRepository.findAll().stream()
                .map(i -> new StudentDto.InterestDto(i.getId(), i.getName(), i.getSlug(), i.getDescription()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(dtos));
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<StudentDto.StudentProfileResponse>> getProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudentProfile profile = profileRepository.findByUserIdWithInterests(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        StudentDto.StudentProfileResponse response = convertProfileToDto(user, profile);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    @Transactional
    public ResponseEntity<ApiResponse<StudentDto.StudentProfileResponse>> updateProfile(
            @RequestBody StudentDto.UpdateProfileRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudentProfile profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        if (request.getBio() != null) profile.setBio(request.getBio().trim());
        if (request.getDepartment() != null) profile.setDepartment(request.getDepartment().trim());
        if (request.getYearOfStudy() != null) profile.setYearOfStudy(request.getYearOfStudy());

        if (request.getInterestIds() != null) {
            List<Interest> interests = interestRepository.findByIdIn(request.getInterestIds());
            profile.setInterests(new HashSet<>(interests));
        }

        StudentProfile updated = profileRepository.save(profile);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", convertProfileToDto(user, updated)));
    }

    @GetMapping("/recommendations")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<EventDto.EventResponseDto>>> getRecommendations(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<EventDto.EventResponseDto> recommended = recommendationService.getRecommendedEvents(user);
        return ResponseEntity.ok(ApiResponse.ok(recommended));
    }

    @GetMapping("/registrations")
    @PreAuthorize("hasRole('STUDENT')")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<EventDto.EventResponseDto>>> getRegistrations(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Registration> regs = registrationService.getStudentRegistrations(user.getId());
        List<EventDto.EventResponseDto> dtoList = regs.stream().map(r -> {
            EventDto.EventResponseDto dto = eventService.convertToDto(r.getEvent(), user);
            dto.setRegistered(r.getStatus().name().equals("CONFIRMED"));
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.ok(dtoList));
    }

    private StudentDto.StudentProfileResponse convertProfileToDto(User user, StudentProfile profile) {
        StudentDto.StudentProfileResponse response = new StudentDto.StudentProfileResponse();
        response.setId(profile.getId());
        response.setUserId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setAvatarUrl(user.getAvatarUrl());
        response.setRegistrationNumber(profile.getRegistrationNumber());
        response.setDepartment(profile.getDepartment());
        response.setYearOfStudy(profile.getYearOfStudy());
        response.setBio(profile.getBio());
        response.setTotalXp(profile.getTotalXp());
        response.setCurrentLevel(profile.getCurrentLevel());

        List<StudentDto.InterestDto> interests = profile.getInterests().stream()
                .map(i -> new StudentDto.InterestDto(i.getId(), i.getName(), i.getSlug(), i.getDescription()))
                .collect(Collectors.toList());
        response.setInterests(interests);

        return response;
    }
}
