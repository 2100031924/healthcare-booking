import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { doctors } from '../../data/doctors';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import TodayIcon from '@mui/icons-material/Today';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PeopleIcon from '@mui/icons-material/People';
import './DashboardPage.scss';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [animatedCards, setAnimatedCards] = useState(false);
  
  const { appointments } = useSelector((state) => state.booking);

  useEffect(() => {
    setTimeout(() => setAnimatedCards(true), 100);
  }, []);

  const totalAppointments = appointments.length;
  
  const today = new Date().toISOString().split('T')[0];
  const todaysBookings = appointments.filter(apt => apt.appointmentDate === today).length;
  
  const cancelledBookings = appointments.filter(apt => apt.status?.toLowerCase() === 'cancelled').length;
  
  const onlineConsultations = appointments.filter(apt => apt.consultationMode === 'Online' || apt.type === 'video').length;
  
  const uniquePatients = new Set(appointments.map(apt => apt.patientName)).size;
  
  const totalSlots = doctors.reduce((acc, doc) => acc + doc.availableSlots.length, 0);
  const bookedSlots = appointments.filter(apt => apt.status?.toLowerCase() !== 'cancelled').length;
  const availableSlots = Math.max(0, totalSlots - bookedSlots);

  const upcomingConsultations = appointments.filter(apt =>
    apt.appointmentDate >= today && apt.status?.toLowerCase() !== 'cancelled'
  ).length;

  const summaryCards = [
    { 
      title: 'Total Appointments', 
      value: totalAppointments.toString(), 
      icon: <EventAvailableIcon />, 
      trend: '+12%',
      trendUp: true
    },
    { 
      title: "Today's Bookings", 
      value: todaysBookings.toString(), 
      icon: <TodayIcon />, 
      trend: '+8%',
      trendUp: true
    },
    { 
      title: 'Available Slots', 
      value: availableSlots.toString(), 
      icon: <AccessTimeIcon />, 
      trend: '-5%',
      trendUp: false
    },
    { 
      title: 'Cancelled', 
      value: cancelledBookings.toString(), 
      icon: <CancelIcon />, 
      trend: '-2%',
      trendUp: true
    },
    { 
      title: 'Online Consultations', 
      value: onlineConsultations.toString(), 
      icon: <VideoCallIcon />, 
      trend: '+15%',
      trendUp: true
    },
    { 
      title: 'Upcoming Consultations', 
      value: upcomingConsultations.toString(), 
      icon: <PendingActionsIcon />, 
      trend: '+10%',
      trendUp: true
    },
  ];

  const quickActions = [
    { label: 'Book Appointment', icon: <AddIcon /> },
    { label: 'Search Doctor', icon: <SearchIcon /> },
    { label: 'View Available Slots', icon: <VisibilityIcon /> },
    { label: 'Reschedule Appointment', icon: <EditIcon /> },
    { label: 'Cancel Appointment', icon: <DeleteIcon /> },
  ];

  const upcomingAppointments = appointments.slice().reverse().slice(0, 5).map(apt => ({
    id: apt.id,
    patient: apt.patientName,
    doctor: apt.doctorName,
    time: apt.timeSlot,
    date: apt.appointmentDate,
    status: apt.status ? apt.status.charAt(0).toUpperCase() + apt.status.slice(1) : 'Pending',
    avatar: apt.patientName ? apt.patientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'PT',
    type: apt.consultationMode === 'Online' ? 'video' : 'clinic'
  }));

  const recentActivity = [
    { id: 1, action: 'New appointment booked', patient: 'Kiran Kumar', time: '5 mins ago', type: 'booking' },
    { id: 2, action: 'Prescription generated', patient: 'Anusha Chowdhary', time: '15 mins ago', type: 'prescription' },
    { id: 3, action: 'Payment received', patient: 'Vishnu Vardhan', time: '30 mins ago', type: 'payment' },
    { id: 4, action: 'Patient checked in', patient: 'Swathi Naidu', time: '1 hour ago', type: 'checkin' },
  ];

  return (
    <div className={`dashboard-page ${animatedCards ? 'animated' : ''}`}>
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's your healthcare overview.</p>
          </div>
          <div className="header-actions">
            <button className="btn-outline" onClick={() => navigate('/appointment')}>
              <CalendarTodayIcon />
              <span>Schedule</span>
            </button>
            <button className="btn-primary" onClick={() => navigate('/appointment')}>
              <AddIcon />
              <span>New Booking</span>
            </button>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {summaryCards.map((card, index) => (
          <div 
            className="summary-card" 
            key={index}
          >
            <div className="card-icon">
              {card.icon}
            </div>
            <div className="card-content">
              <span className="card-title">{card.title}</span>
              <div className="card-value-row">
                <span className="card-value">{card.value}</span>
                <div className={`trend-badge ${card.trendUp ? 'up' : 'down'}`}>
                  {card.trendUp ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  <span>{card.trend}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="main-column">
          <div className="appointments-section">
            <div className="section-header">
              <h2>Upcoming Appointments</h2>
              <button className="view-all-btn" onClick={() => navigate('/appointment')}>
                View All
              </button>
            </div>
            <div className="appointments-table">
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingAppointments.map((apt) => (
                    <tr key={apt.id}>
                      <td>
                        <div className="patient-cell">
                          <div className={`patient-avatar ${apt.status === 'Cancelled' ? 'avatar-cancelled' : ''}`}>
                            {apt.avatar}
                          </div>
                          <div className="patient-info">
                            <span className="patient-name">{apt.patient}</span>
                            <span className="appointment-type">{apt.type === 'video' ? 'Video Consult' : 'Clinic Visit'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="doctor-name">{apt.doctor}</span>
                      </td>
                      <td>
                        <div className="datetime-cell">
                          <span className="date">{apt.date}</span>
                          <span className="time">{apt.time}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${apt.status.toLowerCase()}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn view" title="View">
                            <VisibilityIcon />
                          </button>
                          <button className="action-btn edit" title="Edit">
                            <EditIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="side-column">
          <div className="quick-actions-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              {quickActions.map((action, index) => (
                <button 
                  className="quick-action-btn" 
                  key={index}
                  onClick={() => {
                    if (action.label === 'Book Appointment') navigate('/appointment');
                    else if (action.label === 'View Available Slots') navigate('/appointment');
                    else if (action.label === 'Search Doctor') navigate('/appointment', { state: { focusSearch: true } });
                  }}
                >
                  <span className="action-icon">
                    {action.icon}
                  </span>
                  <span className="action-label">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="activity-section">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <p className="activity-action">{activity.action}</p>
                    <span className="activity-patient">{activity.patient}</span>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}