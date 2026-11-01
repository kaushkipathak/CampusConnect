package com.campusconnect.repository;

import com.campusconnect.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByUserId(Long userId);
    Optional<StudentProfile> findByUserEmail(String email);
    Boolean existsByRegistrationNumber(String registrationNumber);

    @Query("SELECT sp FROM StudentProfile sp LEFT JOIN FETCH sp.interests WHERE sp.user.id = :userId")
    Optional<StudentProfile> findByUserIdWithInterests(@Param("userId") Long userId);
}
