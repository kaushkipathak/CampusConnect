package com.campusconnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_approvals")
public class EventApproval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private User admin;

    @Column(nullable = false, length = 30)
    private String action; // APPROVED or REJECTED

    @Column(length = 2000)
    private String comments;

    @Column(name = "action_date", updatable = false)
    private LocalDateTime actionDate = LocalDateTime.now();

    public EventApproval() {}

    public EventApproval(Event event, User admin, String action, String comments) {
        this.event = event;
        this.admin = admin;
        this.action = action;
        this.comments = comments;
        this.actionDate = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public User getAdmin() { return admin; }
    public void setAdmin(User admin) { this.admin = admin; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public LocalDateTime getActionDate() { return actionDate; }
    public void setActionDate(LocalDateTime actionDate) { this.actionDate = actionDate; }
}
