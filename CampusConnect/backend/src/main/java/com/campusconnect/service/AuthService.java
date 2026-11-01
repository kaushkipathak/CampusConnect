package com.campusconnect.service;

import com.campusconnect.dto.AuthDto;
import com.campusconnect.entity.Interest;
import com.campusconnect.entity.Role;
import com.campusconnect.entity.StudentProfile;
import com.campusconnect.entity.User;
import com.campusconnect.exception.BadRequestException;
import com.campusconnect.repository.InterestRepository;
import com.campusconnect.repository.StudentProfileRepository;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final InterestRepository interestRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final NotificationService notificationService;

    public AuthService(UserRepository userRepository,
                       StudentProfileRepository studentProfileRepository,
                       InterestRepository interestRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       NotificationService notificationService) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.interestRepository = interestRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.notificationService = notificationService;
    }

    @Transactional
    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        return new AuthDto.AuthResponse(
                jwt,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getAvatarUrl()
        );
    }

    @Transactional
    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        // Only allow student or organizer self-registration; Admin accounts cannot be self-registered
        Role targetRole = request.getRole() != null ? request.getRole() : Role.STUDENT;
        if (targetRole == Role.COLLEGE_ADMIN) {
            throw new BadRequestException("Administrative accounts cannot be self-registered");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(targetRole);
        user.setAvatarUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150");
        user = userRepository.save(user);

        if (targetRole == Role.STUDENT) {
            if (request.getRegistrationNumber() == null || request.getRegistrationNumber().isBlank()) {
                throw new BadRequestException("Registration number is mandatory for students");
            }
            if (studentProfileRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
                throw new BadRequestException("Registration number is already registered: " + request.getRegistrationNumber());
            }

            StudentProfile profile = new StudentProfile();
            profile.setUser(user);
            profile.setRegistrationNumber(request.getRegistrationNumber().trim().toUpperCase());
            profile.setDepartment(request.getDepartment() != null ? request.getDepartment().trim() : "General Engineering");
            profile.setYearOfStudy(request.getYearOfStudy() != null ? request.getYearOfStudy() : 1);
            profile.setBio("Student at CampusConnect");
            profile.setTotalXp(0);
            profile.setCurrentLevel("Novice");

            if (request.getInterestIds() != null && !request.getInterestIds().isEmpty()) {
                List<Interest> selectedInterests = interestRepository.findByIdIn(request.getInterestIds());
                profile.setInterests(new HashSet<>(selectedInterests));
            }

            studentProfileRepository.save(profile);

            // Welcome notification
            notificationService.createNotification(
                    user,
                    "Welcome to CampusConnect!",
                    "Your student profile and Campus Passport are ready. Discover events tailored to your interests!",
                    "SYSTEM",
                    "USER",
                    user.getId()
            );
        }

        // Auto authenticate on registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );
        String jwt = tokenProvider.generateToken(authentication);

        return new AuthDto.AuthResponse(
                jwt,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getAvatarUrl()
        );
    }
}
