package com.campusconnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "badges")
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, length = 255)
    private String description;

    @Column(nullable = false, length = 100)
    private String icon;

    @Column(name = "required_events", nullable = false)
    private Integer requiredEvents = 1;

    @Column(name = "required_xp", nullable = false)
    private Integer requiredXp = 50;

    @Column(name = "badge_type", nullable = false, length = 50)
    private String badgeType = "GENERAL";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Badge() {}

    public Badge(String name, String description, String icon, Integer requiredEvents, Integer requiredXp, String badgeType) {
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.requiredEvents = requiredEvents;
        this.requiredXp = requiredXp;
        this.badgeType = badgeType;
        this.createdAt = LocalDateTime.now();
    }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
