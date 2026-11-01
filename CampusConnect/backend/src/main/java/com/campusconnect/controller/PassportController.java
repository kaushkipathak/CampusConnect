package com.campusconnect.controller;

import com.campusconnect.dto.ApiResponse;
import com.campusconnect.dto.PassportDto;
import com.campusconnect.security.UserPrincipal;
import com.campusconnect.service.PassportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student/passport")
@PreAuthorize("hasRole('STUDENT')")
public class PassportController {

    private final PassportService passportService;

    public PassportController(PassportService passportService) {
        this.passportService = passportService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PassportDto.PassportSummaryDto>> getPassport(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        PassportDto.PassportSummaryDto summary = passportService.getStudentPassportSummary(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }
}
