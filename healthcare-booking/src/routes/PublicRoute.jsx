import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../redux';

export default function PublicRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Already authenticated - redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
