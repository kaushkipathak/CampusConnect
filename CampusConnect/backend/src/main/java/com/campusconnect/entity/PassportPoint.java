package com.campusconnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "passport_points")
public class PassportPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @Column(nullable = false)
    private Integer points;

    @Column(nullable = false, length = 255)
    private String reason;

    @Column(name = "awarded_at", updatable = false)
    private LocalDateTime awardedAt = LocalDateTime.now();

    public PassportPoint() {}

    public PassportPoint(User student, Event event, Integer points, String reason) {
        this.student = student;
        this.event = event;
        this.points = points;
        this.reason = reason;
        this.awardedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public LocalDateTime getAwardedAt() { return awardedAt; }
    public void setAwardedAt(LocalDateTime awardedAt) { this.awardedAt = awardedAt; }
}
