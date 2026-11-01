-- ========================================================
-- CampusConnect Database Schema
-- Platform: MySQL 8.0+
-- Database: campusconnect
-- ========================================================

CREATE DATABASE IF NOT EXISTS campusconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campusconnect;

-- Disable foreign key checks for clean teardown/setup
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS student_badges;
DROP TABLE IF EXISTS badges;
DROP TABLE IF EXISTS passport_points;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS event_approvals;
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS event_categories;
DROP TABLE IF EXISTS student_interests;
DROP TABLE IF EXISTS interests;
DROP TABLE IF EXISTS student_profiles;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS TABLE
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'ORGANIZER', 'COLLEGE_ADMIN') NOT NULL DEFAULT 'STUDENT',
    avatar_url VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. STUDENT PROFILES TABLE
CREATE TABLE student_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    year_of_study INT NOT NULL CHECK (year_of_study BETWEEN 1 AND 5),
    bio TEXT NULL,
    total_xp INT NOT NULL DEFAULT 0,
    current_level VARCHAR(50) NOT NULL DEFAULT 'Novice',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_student_reg_no (registration_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. INTERESTS TABLE
CREATE TABLE interests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. STUDENT INTERESTS (M:N Join Table)
CREATE TABLE student_interests (
    student_profile_id BIGINT NOT NULL,
    interest_id BIGINT NOT NULL,
    PRIMARY KEY (student_profile_id, interest_id),
    FOREIGN KEY (student_profile_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (interest_id) REFERENCES interests(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. EVENT CATEGORIES TABLE
CREATE TABLE event_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50) NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. EVENTS TABLE
CREATE TABLE events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description LONGTEXT NOT NULL,
    category_id BIGINT NOT NULL,
    organizer_id BIGINT NOT NULL,
    poster_url VARCHAR(500) NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    venue VARCHAR(255) NOT NULL,
    eligibility VARCHAR(255) NOT NULL DEFAULT 'All Students',
    registration_deadline DATETIME NOT NULL,
    max_capacity INT NOT NULL,
    current_registrations INT NOT NULL DEFAULT 0,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    rejection_reason TEXT NULL,
    tags VARCHAR(500) NULL, -- comma-separated tags e.g. "AI, Machine Learning, Coding"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES event_categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_event_status (status),
    INDEX idx_event_date (event_date),
    INDEX idx_event_organizer (organizer_id),
    INDEX idx_event_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. REGISTRATIONS TABLE
CREATE TABLE registrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL, -- references users(id)
    status ENUM('CONFIRMED', 'CANCELLED', 'ATTENDED') NOT NULL DEFAULT 'CONFIRMED',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP NULL,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_event_student (event_id, student_id),
    INDEX idx_reg_student (student_id),
    INDEX idx_reg_event (event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. EVENT APPROVALS HISTORY TABLE
CREATE TABLE event_approvals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    admin_id BIGINT NOT NULL, -- references users(id)
    action ENUM('APPROVED', 'REJECTED') NOT NULL,
    comments TEXT NULL,
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_approval_event (event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. NOTIFICATIONS TABLE
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'SYSTEM', -- REGISTRATION, EVENT_UPDATE, APPROVAL, PASSPORT
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    related_entity_type VARCHAR(50) NULL,
    related_entity_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notif_user (user_id),
    INDEX idx_notif_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. ATTENDANCE TABLE
CREATE TABLE attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    marked_by_organizer BOOLEAN NOT NULL DEFAULT FALSE,
    organizer_marked_at TIMESTAMP NULL,
    verified_by_admin BOOLEAN NOT NULL DEFAULT FALSE,
    admin_verified_at TIMESTAMP NULL,
    status ENUM('PENDING_VERIFICATION', 'VERIFIED', 'ABSENT') NOT NULL DEFAULT 'PENDING_VERIFICATION',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_attendance_event_student (event_id, student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. PASSPORT POINTS TABLE
CREATE TABLE passport_points (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    event_id BIGINT NULL,
    points INT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
    INDEX idx_points_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. BADGES TABLE
CREATE TABLE badges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    icon VARCHAR(100) NOT NULL,
    required_events INT NOT NULL DEFAULT 1,
    required_xp INT NOT NULL DEFAULT 50,
    badge_type VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. STUDENT BADGES (M:N Earned Badges)
CREATE TABLE student_badges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    badge_id BIGINT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
    UNIQUE KEY uk_student_badge (student_id, badge_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
