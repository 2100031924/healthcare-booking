import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ProtectedRoute } from './components/ProtectedRoute';

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
import Layout from './components/Layout/Layout';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="appointment" element={<DoctorBookingPage />} />
            <Route path="checkin" element={<PatientCheckInPage />} />
            <Route path="prescription" element={<GeneratePrescriptionPage />} />
            <Route path="billing" element={<BillingPaymentPage />} />
            <Route path="booking-history" element={<BookingHistoryPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
