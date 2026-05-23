import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux';
import { ProtectedRoute, PublicRoute } from './routes';

import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import DoctorBookingPage from './pages/DoctorBookingPage/DoctorBookingPage';
import PatientCheckInPage from './pages/PatientCheckInPage/PatientCheckInPage';
import GeneratePrescriptionPage from './pages/GeneratePrescriptionPage/GeneratePrescriptionPage';
import BillingPaymentPage from './pages/BillingPaymentPage/BillingPaymentPage';
import BookingHistoryPage from './pages/BookingHistoryPage/BookingHistoryPage';
import NotificationsPage from './pages/NotificationsPage/NotificationsPage';
import ReportsPage from './pages/ReportsPage/ReportsPage';
import ChatAssistantPage from './pages/ChatAssistantPage/ChatAssistantPage';
import Layout from './components/layout/Layout/Layout';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes - redirect to dashboard if already logged in */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

          {/* Protected Routes - each page individually protected */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<ProtectedRoute page="dashboard"><DashboardPage /></ProtectedRoute>} />
            <Route path="appointment" element={<ProtectedRoute page="appointment"><DoctorBookingPage /></ProtectedRoute>} />
            <Route path="checkin" element={<ProtectedRoute page="checkin"><PatientCheckInPage /></ProtectedRoute>} />
            <Route path="prescription" element={<ProtectedRoute page="prescription"><GeneratePrescriptionPage /></ProtectedRoute>} />
            <Route path="billing" element={<ProtectedRoute page="billing"><BillingPaymentPage /></ProtectedRoute>} />
            <Route path="booking-history" element={<ProtectedRoute page="booking-history"><BookingHistoryPage /></ProtectedRoute>} />
            <Route path="notifications" element={<ProtectedRoute page="notifications"><NotificationsPage /></ProtectedRoute>} />
            <Route path="reports" element={<ProtectedRoute page="reports"><ReportsPage /></ProtectedRoute>} />
            <Route path="chat-assistant" element={<ProtectedRoute page="chat-assistant"><ChatAssistantPage /></ProtectedRoute>} />
          </Route>

          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
