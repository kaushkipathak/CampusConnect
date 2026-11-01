package com.campusconnect.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 4000)
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private EventCategory category;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;

    @Column(name = "poster_url", length = 500)
    private String posterUrl;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private String venue;

    @Column(nullable = false)
    private String eligibility = "All Students";

    @Column(name = "registration_deadline", nullable = false)
    private LocalDateTime registrationDeadline;

    @Column(name = "max_capacity", nullable = false)
    private Integer maxCapacity;

    @Column(name = "current_registrations", nullable = false)
    private Integer currentRegistrations = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EventStatus status = EventStatus.PENDING;

    @Column(name = "rejection_reason", length = 2000)
    private String rejectionReason;

    @Column(length = 500)
    private String tags;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Event() {}

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public int getRemainingSeats() {
        return Math.max(0, maxCapacity - currentRegistrations);
    }

    public boolean isFull() {
        return currentRegistrations >= maxCapacity;
    }

    public boolean isRegistrationOpen() {
        return status == EventStatus.APPROVED &&
               LocalDateTime.now().isBefore(registrationDeadline) &&
               !isFull();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public EventCategory getCategory() { return category; }
    public void setCategory(EventCategory category) { this.category = category; }

    public User getOrganizer() { return organizer; }
    public void setOrganizer(User organizer) { this.organizer = organizer; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public String getEligibility() { return eligibility; }
    public void setEligibility(String eligibility) { this.eligibility = eligibility; }

    public LocalDateTime getRegistrationDeadline() { return registrationDeadline; }
    public void setRegistrationDeadline(LocalDateTime registrationDeadline) { this.registrationDeadline = registrationDeadline; }

    public Integer getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(Integer maxCapacity) { this.maxCapacity = maxCapacity; }

    public Integer getCurrentRegistrations() { return currentRegistrations; }
    public void setCurrentRegistrations(Integer currentRegistrations) { this.currentRegistrations = currentRegistrations; }

    public EventStatus getStatus() { return status; }
    public void setStatus(EventStatus status) { this.status = status; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
