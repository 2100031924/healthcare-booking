import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CancelIcon from '@mui/icons-material/Cancel';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import './ReportsPage.scss';

export default function ReportsPage() {
  const { appointments } = useSelector((state) => state.booking);

  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === 'confirmed' || a.status === 'completed').length;
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;
  const onlineCount = appointments.filter(a => a.consultationMode === 'Online').length;
  const offlineCount = appointments.filter(a => a.consultationMode === 'Offline').length;
  const hybridCount = appointments.filter(a => a.consultationMode === 'Hybrid').length;

  const completionRate = totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0;
  const cancellationRate = totalAppointments > 0 ? Math.round((cancelledAppointments / totalAppointments) * 100) : 0;

  const departmentStats = appointments.reduce((acc, apt) => {
    const dept = apt.department || 'Unknown';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const doctorStats = appointments.reduce((acc, apt) => {
    const doc = apt.doctorName || 'Unknown';
    acc[doc] = (acc[doc] || 0) + 1;
    return acc;
  }, {});

  const weeklyData = [
    { day: 'Mon', bookings: 12 },
    { day: 'Tue', bookings: 19 },
    { day: 'Wed', bookings: 8 },
    { day: 'Thu', bookings: 15 },
    { day: 'Fri', bookings: 22 },
    { day: 'Sat', bookings: 6 },
    { day: 'Sun', bookings: 3 },
  ];

  const maxBookings = Math.max(...weeklyData.map(d => d.bookings));

  const barChartRef = useRef(null);
  const modeDistRef = useRef(null);
  const deptListRef = useRef(null);

  useEffect(() => {
    if (barChartRef.current) {
      const bars = barChartRef.current.querySelectorAll('.bar');
      bars.forEach((bar, i) => {
        if (weeklyData[i]) {
          bar.style.setProperty('--bar-h', `${(weeklyData[i].bookings / maxBookings) * 100}%`);
        }
      });
    }
  }, [weeklyData, maxBookings]);

  useEffect(() => {
    if (modeDistRef.current) {
      const bars = modeDistRef.current.querySelectorAll('.mode-bar');
      const modeValues = [onlineCount, offlineCount, hybridCount];
      bars.forEach((bar, i) => {
        bar.style.setProperty('--mode-w', `${totalAppointments > 0 ? (modeValues[i] / totalAppointments) * 100 : 0}%`);
      });
    }
  }, [onlineCount, offlineCount, hybridCount, totalAppointments]);

  useEffect(() => {
    if (deptListRef.current) {
      const bars = deptListRef.current.querySelectorAll('.dept-bar');
      const entries = Object.entries(departmentStats);
      bars.forEach((bar, i) => {
        if (entries[i]) {
          bar.style.setProperty('--dept-w', `${(entries[i][1] / totalAppointments) * 100}%`);
        }
      });
    }
  }, [departmentStats, totalAppointments]);

  return (
    <div className="reports-page">
      <div className="page-header">
        <div className="page-title-row">
          <BarChartIcon className="page-icon" />
          <div>
            <h1>Reports & Analytics</h1>
            <p>Insights into your healthcare operations</p>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="report-card">
          <div className="card-icon blue"><EventAvailableIcon /></div>
          <div className="card-content">
            <span className="card-label">Total Appointments</span>
            <span className="card-value">{totalAppointments}</span>
          </div>
        </div>
        <div className="report-card">
          <div className="card-icon green"><TrendingUpIcon /></div>
          <div className="card-content">
            <span className="card-label">Completion Rate</span>
            <span className="card-value">{completionRate}%</span>
          </div>
        </div>
        <div className="report-card">
          <div className="card-icon red"><CancelIcon /></div>
          <div className="card-content">
            <span className="card-label">Cancellation Rate</span>
            <span className="card-value">{cancellationRate}%</span>
          </div>
        </div>
        <div className="report-card">
          <div className="card-icon purple"><PeopleIcon /></div>
          <div className="card-content">
            <span className="card-label">Unique Patients</span>
            <span className="card-value">{new Set(appointments.map(a => a.patientName)).size}</span>
          </div>
        </div>
      </div>

      <div className="reports-grid">
        <div className="report-section">
          <h2>Weekly Bookings</h2>
          <div className="bar-chart" ref={barChartRef}>
            {weeklyData.map((day, i) => (
              <div key={i} className="bar-item">
                <div className="bar">
                  <span className="bar-value">{day.bookings}</span>
                </div>
                <span className="bar-label">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="report-section">
          <h2>Consultation Mode Distribution</h2>
          <div className="mode-distribution" ref={modeDistRef}>
            <div className="mode-item">
              <div className="mode-bar online"></div>
              <span>Online: {onlineCount}</span>
            </div>
            <div className="mode-item">
              <div className="mode-bar offline"></div>
              <span>Offline: {offlineCount}</span>
            </div>
            <div className="mode-item">
              <div className="mode-bar hybrid"></div>
              <span>Hybrid: {hybridCount}</span>
            </div>
          </div>
        </div>

        <div className="report-section">
          <h2>Department-wise Bookings</h2>
          <div className="department-list" ref={deptListRef}>
            {Object.entries(departmentStats).map(([dept, count]) => (
              <div key={dept} className="dept-item">
                <span className="dept-name">{dept}</span>
                <div className="dept-bar-wrapper">
                  <div className="dept-bar"></div>
                </div>
                <span className="dept-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="report-section">
          <h2>Doctor-wise Bookings</h2>
          <div className="doctor-list">
            {Object.entries(doctorStats).map(([doc, count]) => (
              <div key={doc} className="doctor-item">
                <span className="doctor-name">{doc}</span>
                <span className="doctor-count">{count} appointments</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
