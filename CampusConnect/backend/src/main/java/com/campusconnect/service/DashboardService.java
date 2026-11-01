package com.campusconnect.service;

import com.campusconnect.dto.DashboardStatsDto;
import com.campusconnect.entity.Event;
import com.campusconnect.entity.EventCategory;
import com.campusconnect.entity.EventStatus;
import com.campusconnect.entity.Role;
import com.campusconnect.repository.EventCategoryRepository;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.RegistrationRepository;
import com.campusconnect.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class DashboardService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final EventCategoryRepository categoryRepository;

    public DashboardService(EventRepository eventRepository,
                            RegistrationRepository registrationRepository,
                            UserRepository userRepository,
                            EventCategoryRepository categoryRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto.AdminDashboardStatsDto getAdminStats() {
        DashboardStatsDto.AdminDashboardStatsDto stats = new DashboardStatsDto.AdminDashboardStatsDto();

        stats.setTotalEvents(eventRepository.count());
        stats.setPendingEvents(eventRepository.countByStatus(EventStatus.PENDING));
        stats.setApprovedEvents(eventRepository.countByStatus(EventStatus.APPROVED));
        stats.setRejectedEvents(eventRepository.countByStatus(EventStatus.REJECTED));
        stats.setTotalRegistrations(registrationRepository.countTotalConfirmedRegistrations());
        stats.setTotalOrganizers(userRepository.countByRole(Role.ORGANIZER));
        stats.setTotalStudents(userRepository.countByRole(Role.STUDENT));

        // Category breakdown for charts
        List<EventCategory> categories = categoryRepository.findAll();
        List<Event> allEvents = eventRepository.findAll();
        List<Map<String, Object>> categoryBreakdown = new ArrayList<>();

        for (EventCategory cat : categories) {
            long count = allEvents.stream().filter(e -> e.getCategory().getId().equals(cat.getId())).count();
            Map<String, Object> item = new HashMap<>();
            item.put("name", cat.getName());
            item.put("count", count);
            categoryBreakdown.add(item);
        }
        stats.setCategoryBreakdown(categoryBreakdown);

        // Status breakdown
        List<Map<String, Object>> statusBreakdown = new ArrayList<>();
        Map<String, Object> pending = new HashMap<>();
        pending.put("name", "Pending");
        pending.put("value", stats.getPendingEvents());
        statusBreakdown.add(pending);

        Map<String, Object> approved = new HashMap<>();
        approved.put("name", "Approved");
        approved.put("value", stats.getApprovedEvents());
        statusBreakdown.add(approved);

        Map<String, Object> rejected = new HashMap<>();
        rejected.put("name", "Rejected");
        rejected.put("value", stats.getRejectedEvents());
        statusBreakdown.add(rejected);

        stats.setStatusBreakdown(statusBreakdown);

        return stats;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto.OrganizerDashboardStatsDto getOrganizerStats(Long organizerId) {
        DashboardStatsDto.OrganizerDashboardStatsDto stats = new DashboardStatsDto.OrganizerDashboardStatsDto();

        stats.setTotalEvents(eventRepository.countByOrganizerId(organizerId));
        stats.setPendingEvents(eventRepository.countByOrganizerIdAndStatus(organizerId, EventStatus.PENDING));
        stats.setApprovedEvents(eventRepository.countByOrganizerIdAndStatus(organizerId, EventStatus.APPROVED));
        stats.setRejectedEvents(eventRepository.countByOrganizerIdAndStatus(organizerId, EventStatus.REJECTED));
        stats.setTotalRegistrations(registrationRepository.countConfirmedRegistrationsByOrganizer(organizerId));

        // Event-wise registration counts for Recharts bar chart
        List<Event> organizerEvents = eventRepository.findByOrganizerIdOrderByCreatedAtDesc(organizerId);
        List<Map<String, Object>> chartList = new ArrayList<>();

        for (Event e : organizerEvents) {
            Map<String, Object> item = new HashMap<>();
            item.put("eventName", e.getTitle().length() > 20 ? e.getTitle().substring(0, 18) + "..." : e.getTitle());
            item.put("registrations", e.getCurrentRegistrations());
            item.put("capacity", e.getMaxCapacity());
            chartList.add(item);
        }
        stats.setEventRegistrationsList(chartList);

        return stats;
    }
}
