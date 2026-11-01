package com.campusconnect.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PassportDto {

    public static class PassportSummaryDto {
        private Integer totalXp;
        private String currentLevel;
        private Integer nextLevelXp;
        private Integer progressPercentage;
        private long eventsAttended;
        private long badgesEarned;
        private List<BadgeStatusDto> badges;
        private List<PointRecordDto> history;

        public Integer getTotalXp() { return totalXp; }
        public void setTotalXp(Integer totalXp) { this.totalXp = totalXp; }

        public String getCurrentLevel() { return currentLevel; }
        public void setCurrentLevel(String currentLevel) { this.currentLevel = currentLevel; }

        public Integer getNextLevelXp() { return nextLevelXp; }
        public void setNextLevelXp(Integer nextLevelXp) { this.nextLevelXp = nextLevelXp; }

        public Integer getProgressPercentage() { return progressPercentage; }
        public void setProgressPercentage(Integer progressPercentage) { this.progressPercentage = progressPercentage; }

        public long getEventsAttended() { return eventsAttended; }
        public void setEventsAttended(long eventsAttended) { this.eventsAttended = eventsAttended; }

        public long getBadgesEarned() { return badgesEarned; }
        public void setBadgesEarned(long badgesEarned) { this.badgesEarned = badgesEarned; }

        public List<BadgeStatusDto> getBadges() { return badges; }
        public void setBadges(List<BadgeStatusDto> badges) { this.badges = badges; }

        public List<PointRecordDto> getHistory() { return history; }
        public void setHistory(List<PointRecordDto> history) { this.history = history; }
    }

    public static class BadgeStatusDto {
        private Long id;
        private String name;
        private String description;
        private String icon;
        private Integer requiredEvents;
        private Integer requiredXp;
        private String badgeType;
        private boolean earned;
        private LocalDateTime earnedAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getIcon() { return icon; }
        public void setIcon(String icon) { this.icon = icon; }

        public Integer getRequiredEvents() { return requiredEvents; }
        public void setRequiredEvents(Integer requiredEvents) { this.requiredEvents = requiredEvents; }

        public Integer getRequiredXp() { return requiredXp; }
        public void setRequiredXp(Integer requiredXp) { this.requiredXp = requiredXp; }

        public String getBadgeType() { return badgeType; }
        public void setBadgeType(String badgeType) { this.badgeType = badgeType; }

        public boolean isEarned() { return earned; }
        public void setEarned(boolean earned) { this.earned = earned; }

        public LocalDateTime getEarnedAt() { return earnedAt; }
        public void setEarnedAt(LocalDateTime earnedAt) { this.earnedAt = earnedAt; }
    }

    public static class PointRecordDto {
        private Long id;
        private Integer points;
        private String reason;
        private String eventTitle;
        private LocalDateTime awardedAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Integer getPoints() { return points; }
        public void setPoints(Integer points) { this.points = points; }

        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }

        public String getEventTitle() { return eventTitle; }
        public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }

        public LocalDateTime getAwardedAt() { return awardedAt; }
        public void setAwardedAt(LocalDateTime awardedAt) { this.awardedAt = awardedAt; }
    }
}
