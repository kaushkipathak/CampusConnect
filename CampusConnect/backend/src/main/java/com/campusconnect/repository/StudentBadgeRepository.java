package com.campusconnect.repository;

import com.campusconnect.entity.StudentBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentBadgeRepository extends JpaRepository<StudentBadge, Long> {
    List<StudentBadge> findByStudentId(Long studentId);
    List<StudentBadge> findByStudentIdOrderByEarnedAtDesc(Long studentId);
    Boolean existsByStudentIdAndBadgeId(Long studentId, Long badgeId);
}
