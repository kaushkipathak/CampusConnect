package com.campusconnect.dto;

import java.util.List;

public class StudentDto {

    public static class StudentProfileResponse {
        private Long id;
        private Long userId;
        private String fullName;
        private String email;
        private String avatarUrl;
        private String registrationNumber;
        private String department;
        private Integer yearOfStudy;
        private String bio;
        private Integer totalXp;
        private String currentLevel;
        private List<InterestDto> interests;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

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

        public List<InterestDto> getInterests() { return interests; }
        public void setInterests(List<InterestDto> interests) { this.interests = interests; }
    }

    public static class InterestDto {
        private Long id;
        private String name;
        private String slug;
        private String description;

        public InterestDto() {}
        public InterestDto(Long id, String name, String slug, String description) {
            this.id = id;
            this.name = name;
            this.slug = slug;
            this.description = description;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getSlug() { return slug; }
        public void setSlug(String slug) { this.slug = slug; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class UpdateProfileRequest {
        private String bio;
        private String department;
        private Integer yearOfStudy;
        private List<Long> interestIds;

        public String getBio() { return bio; }
        public void setBio(String bio) { this.bio = bio; }

        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }

        public Integer getYearOfStudy() { return yearOfStudy; }
        public void setYearOfStudy(Integer yearOfStudy) { this.yearOfStudy = yearOfStudy; }

        public List<Long> getInterestIds() { return interestIds; }
        public void setInterestIds(List<Long> interestIds) { this.interestIds = interestIds; }
    }
}
