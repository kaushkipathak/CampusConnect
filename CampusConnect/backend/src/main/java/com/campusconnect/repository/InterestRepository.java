package com.campusconnect.repository;

import com.campusconnect.entity.Interest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface InterestRepository extends JpaRepository<Interest, Long> {
    Optional<Interest> findByName(String name);
    Optional<Interest> findBySlug(String slug);
    List<Interest> findByNameIn(Collection<String> names);
    List<Interest> findByIdIn(Collection<Long> ids);
}
