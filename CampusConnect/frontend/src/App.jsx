import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './layouts/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventDiscoveryPage from './pages/EventDiscoveryPage';
import EventDetailPage from './pages/EventDetailPage';
import StudentDashboard from './pages/StudentDashboard';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import CampusPassportPage from './pages/CampusPassportPage';
import OrganizerDashboard from './pages/OrganizerDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/events" element={<EventDiscoveryPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />

            {/* Student Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/registrations" element={<MyRegistrationsPage />} />
              <Route path="/student/passport" element={<CampusPassportPage />} />
            </Route>

            {/* Organizer Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ORGANIZER']} />}>
              <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['COLLEGE_ADMIN']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
