package com.campusconnect.dto;

import com.campusconnect.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class AuthDto {

    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        @NotBlank(message = "Full name is required")
        private String fullName;

        @NotBlank(message = "College email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        private Role role = Role.STUDENT;

        // Student-specific fields
        private String registrationNumber;
        private String department;
        private Integer yearOfStudy;
        private List<Long> interestIds;

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }

        public String getRegistrationNumber() { return registrationNumber; }
        public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }

        public Integer getYearOfStudy() { return yearOfStudy; }
        public void setYearOfStudy(Integer yearOfStudy) { this.yearOfStudy = yearOfStudy; }

        public List<Long> getInterestIds() { return interestIds; }
        public void setInterestIds(List<Long> interestIds) { this.interestIds = interestIds; }
    }

    public static class AuthResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String fullName;
        private String email;
        private Role role;
        private String avatarUrl;

        public AuthResponse(String token, Long id, String fullName, String email, Role role, String avatarUrl) {
            this.token = token;
            this.id = id;
            this.fullName = fullName;
            this.email = email;
            this.role = role;
            this.avatarUrl = avatarUrl;
        }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }

        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    }
}
