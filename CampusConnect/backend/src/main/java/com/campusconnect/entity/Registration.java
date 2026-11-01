package com.campusconnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "registrations",
    uniqueConstraints = @UniqueConstraint(name = "uk_event_student", columnNames = {"event_id", "student_id"})
)
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private RegistrationStatus status = RegistrationStatus.CONFIRMED;

    @Column(name = "registration_date", updatable = false)
    private LocalDateTime registrationDate = LocalDateTime.now();

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    public Registration() {}

    public Registration(Event event, User student) {
        this.event = event;
        this.student = student;
        this.status = RegistrationStatus.CONFIRMED;
        this.registrationDate = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public RegistrationStatus getStatus() { return status; }
    public void setStatus(RegistrationStatus status) { this.status = status; }

    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }

    public LocalDateTime getCancelledAt() { return cancelledAt; }
    public void setCancelledAt(LocalDateTime cancelledAt) { this.cancelledAt = cancelledAt; }
}
