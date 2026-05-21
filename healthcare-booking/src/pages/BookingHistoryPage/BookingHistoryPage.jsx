import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventNoteIcon from '@mui/icons-material/EventNote';
import './BookingHistoryPage.scss';

export default function BookingHistoryPage() {
  const navigate = useNavigate();
  const { appointments } = useSelector((state) => state.booking);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  useEffect(() => {
    let filtered = [...appointments];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(apt =>
        apt.patientName?.toLowerCase().includes(q) ||
        apt.doctorName?.toLowerCase().includes(q) ||
        apt.department?.toLowerCase().includes(q)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status?.toLowerCase() === filterStatus);
    }

    setFilteredAppointments(filtered.reverse());
  }, [appointments, searchQuery, filterStatus]);

  const handleCancelAppointment = (id) => {
    const updated = appointments.map(apt =>
      apt.id === id ? { ...apt, status: 'cancelled' } : apt
    );
    localStorage.setItem('appointments', JSON.stringify(updated));
    setFilteredAppointments(prev =>
      prev.map(apt => apt.id === id ? { ...apt, status: 'cancelled' } : apt)
    );
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'pending';
    return `status-badge ${s}`;
  };

  return (
    <div className="booking-history-page">
      <div className="page-header">
        <div>
          <div className="page-title-row">
            <HistoryIcon className="page-icon" />
            <div>
              <h1>Booking History</h1>
              <p>View and manage all your appointment bookings</p>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => navigate('/appointment')}>
            <EventNoteIcon /> New Booking
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by patient, doctor, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-dropdown">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="history-table-wrapper">
        {filteredAppointments.length === 0 ? (
          <div className="empty-state">
            <HistoryIcon className="empty-icon" />
            <h3>No Bookings Found</h3>
            <p>{searchQuery || filterStatus !== 'all' ? 'Try adjusting your filters' : 'Book your first appointment to get started'}</p>
            {!searchQuery && filterStatus === 'all' && (
              <button className="btn-primary" onClick={() => navigate('/appointment')}>Book Appointment</button>
            )}
          </div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date & Time</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
                <tr key={apt.id}>
                  <td className="booking-id">APT-{apt.id}</td>
                  <td>
                    <div className="patient-cell">
                      <div className="patient-avatar">
                        {apt.patientName?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'PT'}
                      </div>
                      <span>{apt.patientName || 'N/A'}</span>
                    </div>
                  </td>
                  <td>{apt.doctorName || 'N/A'}</td>
                  <td>{apt.department || 'N/A'}</td>
                  <td>
                    <div className="datetime-cell">
                      <span className="date">{apt.appointmentDate || 'N/A'}</span>
                      <span className="time">{apt.timeSlot || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`mode-badge ${apt.consultationMode?.toLowerCase() || ''}`}>
                      {apt.consultationMode || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className={getStatusBadge(apt.status)}>
                      {apt.status?.charAt(0).toUpperCase() + apt.status?.slice(1) || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view" title="View" onClick={() => navigate('/appointment')}>
                        <VisibilityIcon />
                      </button>
                      <button className="action-btn edit" title="Reschedule" onClick={() => navigate('/appointment')}>
                        <EditIcon />
                      </button>
                      {apt.status?.toLowerCase() !== 'cancelled' && apt.status?.toLowerCase() !== 'completed' && (
                        <button className="action-btn cancel" title="Cancel" onClick={() => handleCancelAppointment(apt.id)}>
                          <DeleteIcon />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="history-stats">
        <div className="stat-card">
          <span className="stat-value">{appointments.length}</span>
          <span className="stat-label">Total Bookings</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{appointments.filter(a => a.status === 'confirmed').length}</span>
          <span className="stat-label">Confirmed</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{appointments.filter(a => a.status === 'pending').length}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{appointments.filter(a => a.status === 'cancelled').length}</span>
          <span className="stat-label">Cancelled</span>
        </div>
      </div>
    </div>
  );
}
