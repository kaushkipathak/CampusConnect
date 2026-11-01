package com.campusconnect.dto;

import com.campusconnect.entity.AttendanceStatus;
import java.time.LocalDateTime;

public class AttendanceDto {

    public static class AttendanceRecordDto {
        private Long id;
        private Long eventId;
        private String eventTitle;
        private Long studentId;
        private String studentName;
        private String studentEmail;
        private String registrationNumber;
        private String department;
        private Boolean markedByOrganizer;
        private LocalDateTime organizerMarkedAt;
        private Boolean verifiedByAdmin;
        private LocalDateTime adminVerifiedAt;
        private AttendanceStatus status;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getEventId() { return eventId; }
        public void setEventId(Long eventId) { this.eventId = eventId; }

        public String getEventTitle() { return eventTitle; }
        public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }

        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }

        public String getStudentName() { return studentName; }
        public void setStudentName(String studentName) { this.studentName = studentName; }

        public String getStudentEmail() { return studentEmail; }
        public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

        public String getRegistrationNumber() { return registrationNumber; }
        public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }

        public Boolean getMarkedByOrganizer() { return markedByOrganizer; }
        public void setMarkedByOrganizer(Boolean markedByOrganizer) { this.markedByOrganizer = markedByOrganizer; }

        public LocalDateTime getOrganizerMarkedAt() { return organizerMarkedAt; }
        public void setOrganizerMarkedAt(LocalDateTime organizerMarkedAt) { this.organizerMarkedAt = organizerMarkedAt; }

        public Boolean getVerifiedByAdmin() { return verifiedByAdmin; }
        public void setVerifiedByAdmin(Boolean verifiedByAdmin) { this.verifiedByAdmin = verifiedByAdmin; }

        public LocalDateTime getAdminVerifiedAt() { return adminVerifiedAt; }
        public void setAdminVerifiedAt(LocalDateTime adminVerifiedAt) { this.adminVerifiedAt = adminVerifiedAt; }

        public AttendanceStatus getStatus() { return status; }
        public void setStatus(AttendanceStatus status) { this.status = status; }
    }

    public static class MarkAttendanceRequest {
        private Long studentId;
        private Boolean present;

        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }

        public Boolean getPresent() { return present; }
        public void setPresent(Boolean present) { this.present = present; }
    }

    public static class VerifyAttendanceRequest {
        private Boolean verified;
        private Integer points = 50;

        public Boolean getVerified() { return verified; }
        public void setVerified(Boolean verified) { this.verified = verified; }

        public Integer getPoints() { return points; }
        public void setPoints(Integer points) { this.points = points; }
    }
}
