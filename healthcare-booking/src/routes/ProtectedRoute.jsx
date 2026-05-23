import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectAuthLoading } from '../redux';

// Route access configuration per page
const ROUTE_ACCESS = {
  dashboard: { requiresAuth: true },
  appointment: { requiresAuth: true },
  checkin: { requiresAuth: true },
  prescription: { requiresAuth: true },
  billing: { requiresAuth: true },
  'booking-history': { requiresAuth: true },
  notifications: { requiresAuth: true },
  reports: { requiresAuth: true },
  'chat-assistant': { requiresAuth: true },
};

export default function ProtectedRoute({ children, page }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const location = useLocation();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="route-loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Page-specific access check
  if (page && ROUTE_ACCESS[page]) {
    const access = ROUTE_ACCESS[page];
    if (access.requiresAuth && !isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  // Authenticated - render children or outlet
  return children ? children : <Outlet />;
}
