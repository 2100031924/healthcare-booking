// Route configuration for the application
export const ROUTE_CONFIG = {
  // Public routes (accessible without auth)
  public: [
    { path: '/login', name: 'Login' },
    { path: '/register', name: 'Register' },
    { path: '/forgot-password', name: 'Forgot Password' },
  ],

  // Protected routes (require auth)
  protected: [
    { path: '/dashboard', name: 'Dashboard', page: 'dashboard', icon: 'dashboard' },
    { path: '/appointment', name: 'Doctor Booking', page: 'appointment', icon: 'event' },
    { path: '/checkin', name: 'Patient Check-In', page: 'checkin', icon: 'person_add' },
    { path: '/prescription', name: 'Prescription', page: 'prescription', icon: 'description' },
    { path: '/billing', name: 'Billing & Payment', page: 'billing', icon: 'receipt' },
    { path: '/booking-history', name: 'Booking History', page: 'booking-history', icon: 'history' },
    { path: '/notifications', name: 'Notifications', page: 'notifications', icon: 'notifications' },
    { path: '/reports', name: 'Reports', page: 'reports', icon: 'bar_chart' },
    { path: '/chat-assistant', name: 'AI Assistant', page: 'chat-assistant', icon: 'chat' },
  ],
};

// Get route config by path
export const getRouteByPath = (path) => {
  return (
    ROUTE_CONFIG.public.find((r) => r.path === path) ||
    ROUTE_CONFIG.protected.find((r) => r.path === path) ||
    null
  );
};

// Check if route is public
export const isPublicRoute = (path) => {
  return ROUTE_CONFIG.public.some((r) => r.path === path);
};

// Check if route is protected
export const isProtectedRoute = (path) => {
  return ROUTE_CONFIG.protected.some((r) => r.path === path);
};
