import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectAppointments } from '../../redux';
import HistoryIcon from '@mui/icons-material/History';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import './BookingHistoryPage.scss';

export default function BookingHistoryPage() {
  const navigate = useNavigate();
  const appointments = useSelector(selectAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedApt, setSelectedApt] = useState(null);

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
                      <button className="action-btn view" title="View" onClick={() => setSelectedApt(apt)}>
                        <VisibilityIcon />
                      </button>
                      <button className="action-btn edit" title="Reschedule" onClick={() => navigate('/appointment', { state: { rescheduleAppointment: apt } })}>
                        <EditIcon />
                      </button>
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

      {/* Patient Details Modal */}
      {selectedApt && (
        <div className="modal-overlay" onClick={() => setSelectedApt(null)}>
          <div className="patient-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <div className="modal-icon">
                  <PersonIcon />
                </div>
                <div>
                  <h2>Patient Details</h2>
                  <span className="booking-id-badge">APT-{selectedApt.id}</span>
                </div>
              </div>
              <button className="modal-close" onClick={() => setSelectedApt(null)}>
                <CloseIcon />
              </button>
            </div>

            <div className="modal-body">
              <div className="patient-profile-section">
                <div className="patient-avatar-lg">
                  {selectedApt.patientName?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'PT'}
                </div>
                <div className="patient-name-block">
                  <h3>{selectedApt.patientName || 'N/A'}</h3>
                  <span className={`status-badge ${selectedApt.status?.toLowerCase() || 'pending'}`}>
                    {selectedApt.status?.charAt(0).toUpperCase() + selectedApt.status?.slice(1) || 'Pending'}
                  </span>
                </div>
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <div className="detail-icon"><LocalHospitalIcon /></div>
                  <div className="detail-content">
                    <span className="detail-label">Doctor</span>
                    <span className="detail-value">{selectedApt.doctorName || 'N/A'}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon"><MedicalServicesIcon /></div>
                  <div className="detail-content">
                    <span className="detail-label">Department</span>
                    <span className="detail-value">{selectedApt.department || 'General'}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon"><CalendarTodayIcon /></div>
                  <div className="detail-content">
                    <span className="detail-label">Appointment Date</span>
                    <span className="detail-value">{selectedApt.appointmentDate || 'N/A'}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon"><AccessTimeIcon /></div>
                  <div className="detail-content">
                    <span className="detail-label">Time Slot</span>
                    <span className="detail-value">{selectedApt.timeSlot || 'N/A'}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">
                    {selectedApt.consultationMode === 'Online' ? <VideoCallIcon /> : <LocationOnIcon />}
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Consultation Mode</span>
                    <span className="detail-value">{selectedApt.consultationMode || 'N/A'}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon"><BadgeIcon /></div>
                  <div className="detail-content">
                    <span className="detail-label">Appointment Type</span>
                    <span className="detail-value">{selectedApt.type === 'video' ? 'Video Consultation' : 'Clinic Visit'}</span>
                  </div>
                </div>
              </div>

              {(selectedApt.contactNumber || selectedApt.email) && (
                <div className="contact-section">
                  <h4>Contact Information</h4>
                  <div className="contact-grid">
                    {selectedApt.contactNumber && (
                      <div className="contact-item">
                        <PhoneIcon />
                        <span>{selectedApt.contactNumber}</span>
                      </div>
                    )}
                    {selectedApt.email && (
                      <div className="contact-item">
                        <EmailIcon />
                        <span>{selectedApt.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedApt.symptoms && (
                <div className="symptoms-section">
                  <h4>Symptoms / Notes</h4>
                  <p>{selectedApt.symptoms}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-outline" onClick={() => setSelectedApt(null)}>Close</button>
              <button className="btn-primary" onClick={() => { setSelectedApt(null); navigate('/appointment'); }}>
                <EditIcon /> Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
