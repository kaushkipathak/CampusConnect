package com.campusconnect.repository;

import com.campusconnect.entity.Event;
import com.campusconnect.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStatus(EventStatus status);

    List<Event> findByStatusOrderByEventDateAsc(EventStatus status);

    List<Event> findByOrganizerIdOrderByCreatedAtDesc(Long organizerId);

    List<Event> findByOrganizerIdAndStatus(Long organizerId, EventStatus status);

    long countByStatus(EventStatus status);

    long countByOrganizerId(Long organizerId);

    long countByOrganizerIdAndStatus(Long organizerId, EventStatus status);

    @Query("SELECT e FROM Event e WHERE e.status = :status AND " +
           "(:categoryId IS NULL OR e.category.id = :categoryId) AND " +
           "(:search IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.description) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.tags) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:fromDate IS NULL OR e.eventDate >= :fromDate) AND " +
           "(:toDate IS NULL OR e.eventDate <= :toDate) " +
           "ORDER BY e.eventDate ASC")
    List<Event> searchApprovedEvents(
            @Param("status") EventStatus status,
            @Param("categoryId") Long categoryId,
            @Param("search") String search,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
    );
}
