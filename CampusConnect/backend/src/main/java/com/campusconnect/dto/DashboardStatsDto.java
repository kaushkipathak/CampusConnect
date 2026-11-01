package com.campusconnect.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDto {

    public static class AdminDashboardStatsDto {
        private long totalEvents;
        private long pendingEvents;
        private long approvedEvents;
        private long rejectedEvents;
        private long totalRegistrations;
        private long totalOrganizers;
        private long totalStudents;
        private List<Map<String, Object>> categoryBreakdown;
        private List<Map<String, Object>> statusBreakdown;

        public long getTotalEvents() { return totalEvents; }
        public void setTotalEvents(long totalEvents) { this.totalEvents = totalEvents; }

        public long getPendingEvents() { return pendingEvents; }
        public void setPendingEvents(long pendingEvents) { this.pendingEvents = pendingEvents; }

        public long getApprovedEvents() { return approvedEvents; }
        public void setApprovedEvents(long approvedEvents) { this.approvedEvents = approvedEvents; }

        public long getRejectedEvents() { return rejectedEvents; }
        public void setRejectedEvents(long rejectedEvents) { this.rejectedEvents = rejectedEvents; }

        public long getTotalRegistrations() { return totalRegistrations; }
        public void setTotalRegistrations(long totalRegistrations) { this.totalRegistrations = totalRegistrations; }

        public long getTotalOrganizers() { return totalOrganizers; }
        public void setTotalOrganizers(long totalOrganizers) { this.totalOrganizers = totalOrganizers; }

        public long getTotalStudents() { return totalStudents; }
        public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

        public List<Map<String, Object>> getCategoryBreakdown() { return categoryBreakdown; }
        public void setCategoryBreakdown(List<Map<String, Object>> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; }

        public List<Map<String, Object>> getStatusBreakdown() { return statusBreakdown; }
        public void setStatusBreakdown(List<Map<String, Object>> statusBreakdown) { this.statusBreakdown = statusBreakdown; }
    }

    public static class OrganizerDashboardStatsDto {
        private long totalEvents;
        private long pendingEvents;
        private long approvedEvents;
        private long rejectedEvents;
        private long totalRegistrations;
        private List<Map<String, Object>> eventRegistrationsList;

        public long getTotalEvents() { return totalEvents; }
        public void setTotalEvents(long totalEvents) { this.totalEvents = totalEvents; }

        public long getPendingEvents() { return pendingEvents; }
        public void setPendingEvents(long pendingEvents) { this.pendingEvents = pendingEvents; }

        public long getApprovedEvents() { return approvedEvents; }
        public void setApprovedEvents(long approvedEvents) { this.approvedEvents = approvedEvents; }

        public long getRejectedEvents() { return rejectedEvents; }
        public void setRejectedEvents(long rejectedEvents) { this.rejectedEvents = rejectedEvents; }

        public long getTotalRegistrations() { return totalRegistrations; }
        public void setTotalRegistrations(long totalRegistrations) { this.totalRegistrations = totalRegistrations; }

        public List<Map<String, Object>> getEventRegistrationsList() { return eventRegistrationsList; }
        public void setEventRegistrationsList(List<Map<String, Object>> eventRegistrationsList) { this.eventRegistrationsList = eventRegistrationsList; }
    }
}
