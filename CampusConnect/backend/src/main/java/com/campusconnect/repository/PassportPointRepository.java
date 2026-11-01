package com.campusconnect.repository;

import com.campusconnect.entity.PassportPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PassportPointRepository extends JpaRepository<PassportPoint, Long> {
    List<PassportPoint> findByStudentIdOrderByAwardedAtDesc(Long studentId);
    Boolean existsByStudentIdAndEventId(Long studentId, Long eventId);

    @Query("SELECT COALESCE(SUM(p.points), 0) FROM PassportPoint p WHERE p.student.id = :studentId")
    int sumPointsByStudentId(@Param("studentId") Long studentId);
}
