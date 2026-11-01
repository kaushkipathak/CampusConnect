package com.campusconnect.controller;

import com.campusconnect.dto.ApiResponse;
import com.campusconnect.dto.EventDto;
import com.campusconnect.entity.EventCategory;
import com.campusconnect.entity.User;
import com.campusconnect.repository.EventCategoryRepository;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.security.UserPrincipal;
import com.campusconnect.service.EventService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final EventCategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public EventController(EventService eventService,
                           EventCategoryRepository categoryRepository,
                           UserRepository userRepository) {
        this.eventService = eventService;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventDto.EventResponseDto>>> getApprovedEvents(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        User currentUser = userPrincipal != null ? userRepository.findById(userPrincipal.getId()).orElse(null) : null;
        List<EventDto.EventResponseDto> events = eventService.getApprovedEvents(categoryId, search, fromDate, toDate, currentUser);
        return ResponseEntity.ok(ApiResponse.ok(events));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventDto.EventResponseDto>> getEventById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        User currentUser = userPrincipal != null ? userRepository.findById(userPrincipal.getId()).orElse(null) : null;
        EventDto.EventResponseDto event = eventService.getEventById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.ok(event));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<EventCategory>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.ok(categoryRepository.findAll()));
    }
}
