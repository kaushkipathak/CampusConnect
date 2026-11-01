package com.campusconnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "registration_number", nullable = false, unique = true, length = 50)
    private String registrationNumber;

    @Column(nullable = false, length = 100)
    private String department;

    @Column(name = "year_of_study", nullable = false)
    private Integer yearOfStudy;

    @Column(length = 2000)
    private String bio;

    @Column(name = "total_xp", nullable = false)
    private Integer totalXp = 0;

    @Column(name = "current_level", nullable = false, length = 50)
    private String currentLevel = "Novice";

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "student_interests",
        joinColumns = @JoinColumn(name = "student_profile_id"),
        inverseJoinColumns = @JoinColumn(name = "interest_id")
    )
    private Set<Interest> interests = new HashSet<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public StudentProfile() {}

    public StudentProfile(User user, String registrationNumber, String department, Integer yearOfStudy) {
        this.user = user;
        this.registrationNumber = registrationNumber;
        this.department = department;
        this.yearOfStudy = yearOfStudy;
        this.totalXp = 0;
        this.currentLevel = "Novice";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(Integer yearOfStudy) { this.yearOfStudy = yearOfStudy; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public Integer getTotalXp() { return totalXp; }
    public void setTotalXp(Integer totalXp) { this.totalXp = totalXp; }

    public String getCurrentLevel() { return currentLevel; }
    public void setCurrentLevel(String currentLevel) { this.currentLevel = currentLevel; }

    public Set<Interest> getInterests() { return interests; }
    public void setInterests(Set<Interest> interests) { this.interests = interests; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
