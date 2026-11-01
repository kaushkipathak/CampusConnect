package com.campusconnect.repository;

import com.campusconnect.entity.Registration;
import com.campusconnect.entity.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    List<Registration> findByStudentIdOrderByRegistrationDateDesc(Long studentId);

    List<Registration> findByEventIdOrderByRegistrationDateDesc(Long eventId);

    Optional<Registration> findByEventIdAndStudentId(Long eventId, Long studentId);

    Boolean existsByEventIdAndStudentIdAndStatus(Long eventId, Long studentId, RegistrationStatus status);

    long countByEventOrganizerId(Long organizerId);

    long countByEventIdAndStatus(Long eventId, RegistrationStatus status);

    @Query("SELECT COUNT(r) FROM Registration r WHERE r.event.organizer.id = :organizerId AND r.status = 'CONFIRMED'")
    long countConfirmedRegistrationsByOrganizer(@Param("organizerId") Long organizerId);

    @Query("SELECT COUNT(r) FROM Registration r WHERE r.status = 'CONFIRMED'")
    long countTotalConfirmedRegistrations();
}
