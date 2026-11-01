import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Authenticating session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If authenticated but unauthorized, redirect to relevant home
    if (user.role === 'COLLEGE_ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'ORGANIZER') return <Navigate to="/organizer/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }

  return <Outlet />;
}
