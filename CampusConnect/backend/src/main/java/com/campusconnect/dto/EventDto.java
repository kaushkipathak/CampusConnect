package com.campusconnect.dto;

import com.campusconnect.entity.EventStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class EventDto {

    public static class EventCreateDto {
        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Description is required")
        private String description;

        @NotNull(message = "Category is required")
        private Long categoryId;

        private String posterUrl;

        @NotNull(message = "Event date is required")
        private LocalDate eventDate;

        @NotNull(message = "Start time is required")
        private LocalTime startTime;

        @NotNull(message = "End time is required")
        private LocalTime endTime;

        @NotBlank(message = "Venue is required")
        private String venue;

        private String eligibility = "All Students";

        @NotNull(message = "Registration deadline is required")
        private LocalDateTime registrationDeadline;

        @NotNull(message = "Capacity is required")
        @Min(value = 1, message = "Capacity must be at least 1")
        private Integer maxCapacity;

        private String tags;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

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

        public String getTags() { return tags; }
        public void setTags(String tags) { this.tags = tags; }
    }

    public static class EventResponseDto {
        private Long id;
        private String title;
        private String description;
        private Long categoryId;
        private String categoryName;
        private Long organizerId;
        private String organizerName;
        private String organizerEmail;
        private String posterUrl;
        private LocalDate eventDate;
        private LocalTime startTime;
        private LocalTime endTime;
        private String venue;
        private String eligibility;
        private LocalDateTime registrationDeadline;
        private Integer maxCapacity;
        private Integer currentRegistrations;
        private Integer remainingSeats;
        private EventStatus status;
        private String rejectionReason;
        private String tags;
        private LocalDateTime createdAt;
        private boolean registered;
        private double recommendationScore;
        private String recommendationReason;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

        public Long getOrganizerId() { return organizerId; }
        public void setOrganizerId(Long organizerId) { this.organizerId = organizerId; }

        public String getOrganizerName() { return organizerName; }
        public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }

        public String getOrganizerEmail() { return organizerEmail; }
        public void setOrganizerEmail(String organizerEmail) { this.organizerEmail = organizerEmail; }

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

        public Integer getRemainingSeats() { return remainingSeats; }
        public void setRemainingSeats(Integer remainingSeats) { this.remainingSeats = remainingSeats; }

        public EventStatus getStatus() { return status; }
        public void setStatus(EventStatus status) { this.status = status; }

        public String getRejectionReason() { return rejectionReason; }
        public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

        public String getTags() { return tags; }
        public void setTags(String tags) { this.tags = tags; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public boolean isRegistered() { return registered; }
        public void setRegistered(boolean registered) { this.registered = registered; }

        public double getRecommendationScore() { return recommendationScore; }
        public void setRecommendationScore(double recommendationScore) { this.recommendationScore = recommendationScore; }

        public String getRecommendationReason() { return recommendationReason; }
        public void setRecommendationReason(String recommendationReason) { this.recommendationReason = recommendationReason; }
    }

    public static class EventApprovalRequest {
        @NotBlank(message = "Comments/reason is required")
        private String comments;

        public String getComments() { return comments; }
        public void setComments(String comments) { this.comments = comments; }
    }
}
