package com.campusconnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "attendance",
    uniqueConstraints = @UniqueConstraint(name = "uk_attendance_event_student", columnNames = {"event_id", "student_id"})
)
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(name = "marked_by_organizer", nullable = false)
    private Boolean markedByOrganizer = false;

    @Column(name = "organizer_marked_at")
    private LocalDateTime organizerMarkedAt;

    @Column(name = "verified_by_admin", nullable = false)
    private Boolean verifiedByAdmin = false;

    @Column(name = "admin_verified_at")
    private LocalDateTime adminVerifiedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AttendanceStatus status = AttendanceStatus.PENDING_VERIFICATION;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Attendance() {}

    public Attendance(Event event, User student) {
        this.event = event;
        this.student = student;
        this.status = AttendanceStatus.PENDING_VERIFICATION;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
