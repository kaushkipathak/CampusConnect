package com.campusconnect.repository;

import com.campusconnect.entity.Attendance;
import com.campusconnect.entity.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByEventId(Long eventId);
    Optional<Attendance> findByEventIdAndStudentId(Long eventId, Long studentId);
    List<Attendance> findByStatus(AttendanceStatus status);
    long countByStudentIdAndStatus(Long studentId, AttendanceStatus status);
}
