package com.campusconnect.service;

import com.campusconnect.dto.EventDto;
import com.campusconnect.entity.*;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final StudentProfileRepository studentProfileRepository;
    private final EventRepository eventRepository;
    private final EventService eventService;

    public RecommendationService(StudentProfileRepository studentProfileRepository,
                                  EventRepository eventRepository,
                                  EventService eventService) {
        this.studentProfileRepository = studentProfileRepository;
        this.eventRepository = eventRepository;
        this.eventService = eventService;
    }

    /**
     * Interest-Based Recommendation Algorithm
     * Compares student's selected interests with event tags, category, and text keywords.
     * Generates a weighted score and an explainable reason.
     */
    @Transactional(readOnly = true)
    public List<EventDto.EventResponseDto> getRecommendedEvents(User student) {
        Optional<StudentProfile> profileOpt = studentProfileRepository.findByUserIdWithInterests(student.getId());

        List<Event> approvedEvents = eventRepository.findByStatusOrderByEventDateAsc(EventStatus.APPROVED);

        if (profileOpt.isEmpty() || profileOpt.get().getInterests().isEmpty()) {
            // If student hasn't selected interests yet, return latest approved events
            return approvedEvents.stream()
                    .map(e -> {
                        EventDto.EventResponseDto dto = eventService.convertToDto(e, student);
                        dto.setRecommendationScore(1.0);
                        dto.setRecommendationReason("Popular campus event");
                        return dto;
                    })
                    .collect(Collectors.toList());
        }

        Set<Interest> userInterests = profileOpt.get().getInterests();
        List<EventDto.EventResponseDto> scoredEvents = new ArrayList<>();

        for (Event event : approvedEvents) {
            double score = 0.0;
            List<String> matchedInterestNames = new ArrayList<>();

            String eventTags = event.getTags() != null ? event.getTags().toLowerCase() : "";
            String eventCategory = event.getCategory() != null ? event.getCategory().getName().toLowerCase() : "";
            String eventTitle = event.getTitle().toLowerCase();
            String eventDesc = event.getDescription().toLowerCase();

            for (Interest interest : userInterests) {
                String interestName = interest.getName().toLowerCase();
                boolean matched = false;

                // 1. Direct Tag Match (Highest weight: 3.0)
                if (eventTags.contains(interestName)) {
                    score += 3.0;
                    matched = true;
                }

                // 2. Category Match (Weight: 2.0)
                if (eventCategory.contains(interestName) || interestName.contains(eventCategory)) {
                    score += 2.0;
                    matched = true;
                }

                // 3. Title / Description Keyword Match (Weight: 1.0)
                if (eventTitle.contains(interestName) || eventDesc.contains(interestName)) {
                    score += 1.0;
                    matched = true;
                }

                if (matched && !matchedInterestNames.contains(interest.getName())) {
                    matchedInterestNames.add(interest.getName());
                }
            }

            EventDto.EventResponseDto dto = eventService.convertToDto(event, student);
            dto.setRecommendationScore(score);

            if (!matchedInterestNames.isEmpty()) {
                String reason = "Recommended because you are interested in " +
                        String.join(" & ", matchedInterestNames.subList(0, Math.min(2, matchedInterestNames.size())));
                dto.setRecommendationReason(reason);
            } else {
                dto.setRecommendationReason("Discover new events across campus");
            }

            scoredEvents.add(dto);
        }

        // Sort by recommendation score descending; if tied, by earliest event date
        scoredEvents.sort((a, b) -> {
            int scoreCompare = Double.compare(b.getRecommendationScore(), a.getRecommendationScore());
            if (scoreCompare != 0) return scoreCompare;
            return a.getEventDate().compareTo(b.getEventDate());
        });

        return scoredEvents;
    }
}
