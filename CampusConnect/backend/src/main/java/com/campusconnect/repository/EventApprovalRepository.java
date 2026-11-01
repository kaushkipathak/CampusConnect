package com.campusconnect.repository;

import com.campusconnect.entity.EventApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventApprovalRepository extends JpaRepository<EventApproval, Long> {
    List<EventApproval> findByEventIdOrderByActionDateDesc(Long eventId);
}
