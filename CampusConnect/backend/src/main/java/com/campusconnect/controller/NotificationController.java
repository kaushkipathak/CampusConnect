package com.campusconnect.controller;

import com.campusconnect.dto.ApiResponse;
import com.campusconnect.entity.Notification;
import com.campusconnect.security.UserPrincipal;
import com.campusconnect.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyNotifications(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        List<Notification> notifications = notificationService.getUserNotifications(userPrincipal.getId());
        long unreadCount = notificationService.getUnreadCount(userPrincipal.getId());

        Map<String, Object> data = new HashMap<>();
        data.put("notifications", notifications);
        data.put("unreadCount", unreadCount);

        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<String>> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        notificationService.markAsRead(id, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Notification marked as read", null));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<String>> markAllAsRead(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        notificationService.markAllAsRead(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("All notifications marked as read", null));
    }
}
