package com.campusconnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "student_badges",
    uniqueConstraints = @UniqueConstraint(name = "uk_student_badge", columnNames = {"student_id", "badge_id"})
)
public class StudentBadge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "badge_id", nullable = false)
    private Badge badge;

    @Column(name = "earned_at", updatable = false)
    private LocalDateTime earnedAt = LocalDateTime.now();

    public StudentBadge() {}

    public StudentBadge(User student, Badge badge) {
        this.student = student;
        this.badge = badge;
        this.earnedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public Badge getBadge() { return badge; }
    public void setBadge(Badge badge) { this.badge = badge; }

    public LocalDateTime getEarnedAt() { return earnedAt; }
    public void setEarnedAt(LocalDateTime earnedAt) { this.earnedAt = earnedAt; }
}
