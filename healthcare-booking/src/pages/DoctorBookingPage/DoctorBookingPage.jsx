import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { bookAppointmentRequest, rescheduleAppointmentRequest, selectAppointments } from '../../redux';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import BadgeIcon from '@mui/icons-material/Badge';
import { doctors } from '../../data/doctors';
import './DoctorBookingPage.scss';

const timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

const slotStatuses = {
  available: 'Available',
  booked: 'Booked',
  reserved: 'Reserved',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

export default function DoctorBookingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { appointments } = useSelector((state) => ({
    appointments: selectAppointments(state),
  }));
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [viewMode, setViewMode] = useState('weekly');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);
  const searchInputRef = useRef(null);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [rescheduleMode, setRescheduleMode] = useState(false);
  const [originalAppointmentId, setOriginalAppointmentId] = useState(null);

  const storedBooking = JSON.parse(localStorage.getItem('lastBooking') || 'null');
  const bookingInfo = storedBooking ? {
    patientName: storedBooking.patientName,
    bookingId: `BK-${storedBooking.id}`,
    department: storedBooking.department,
    selectedDoctor: storedBooking.doctorName,
    appointmentStatus: storedBooking.status || 'confirmed',
  } : null;

  const bookedSlots = appointments
    .filter(apt => apt.status?.toLowerCase() !== 'cancelled')
    .map(apt => `${apt.doctorName}-${apt.appointmentDate}-${apt.timeSlot}`);

  useEffect(() => {
    if (location.state?.searchQuery !== undefined) {
      setSearchQuery(location.state.searchQuery);
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
      window.history.replaceState({}, document.title);
    } else if (location.state?.focusSearch && searchInputRef.current) {
      searchInputRef.current.focus();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (location.state?.rescheduleAppointment) {
      const apt = location.state.rescheduleAppointment;
      const doctor = doctors.find(d => d.name === apt.doctorName);
      if (doctor) {
        setSelectedDoctor(doctor);
      }
      setSelectedDate(apt.appointmentDate || '');
      setSelectedSlot(apt.timeSlot || '');
      setRescheduleMode(true);
      setOriginalAppointmentId(apt.id);
      formik.setValues({
        patientName: apt.patientName || '',
        contactNumber: apt.contactNumber || (apt.patientName ? apt.patientName.replace(/\D/g, '').substring(0, 10) : ''),
        email: apt.email || '',
        doctorId: doctor ? doctor.id.toString() : '',
        department: apt.department || '',
        appointmentDate: apt.appointmentDate || '',
        timeSlot: apt.timeSlot || '',
        consultationMode: apt.consultationMode || '',
        appointmentType: apt.appointmentType || 'Regular',
        symptoms: apt.symptoms || '',
      });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const filtered = doctors.filter(doc =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchQuery]);

  const formik = useFormik({
    initialValues: {
      patientName: '',
      contactNumber: '',
      email: '',
      doctorId: '',
      department: '',
      appointmentDate: '',
      timeSlot: '',
      consultationMode: '',
      appointmentType: 'Regular',
      symptoms: '',
    },
    validationSchema: Yup.object({
      patientName: Yup.string().required('Patient Name is required'),
      contactNumber: Yup.string().matches(/^[0-9]{10}$/, 'Invalid phone number').required('Contact Number is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      doctorId: Yup.string().required('Doctor selection is required'),
      appointmentDate: Yup.string().required('Appointment Date is required'),
      timeSlot: Yup.string().required('Time Slot is required'),
      consultationMode: Yup.string().required('Consultation Mode is required'),
    }),
    onSubmit: (values) => {
      const doctor = doctors.find(d => d.id === parseInt(values.doctorId));
      const bookingData = {
        patientName: values.patientName,
        contactNumber: values.contactNumber,
        email: values.email,
        doctorName: doctor ? doctor.name : '',
        department: values.department,
        appointmentDate: values.appointmentDate,
        timeSlot: values.timeSlot,
        consultationMode: values.consultationMode,
        appointmentType: values.appointmentType,
        symptoms: values.symptoms,
        status: 'confirmed',
      };

      if (rescheduleMode && originalAppointmentId) {
        dispatch(rescheduleAppointmentRequest({
          id: originalAppointmentId,
          newDate: values.appointmentDate,
          newTimeSlot: values.timeSlot,
          ...bookingData,
        }));
        setShowConfirmation(true);
        setTimeout(() => {
          setShowConfirmation(false);
          setRescheduleMode(false);
          setOriginalAppointmentId(null);
          navigate('/booking-history');
        }, 3000);
      } else {
        const newBookingData = { ...bookingData, id: Date.now() };
        dispatch(bookAppointmentRequest(newBookingData));
        localStorage.setItem('lastBooking', JSON.stringify(newBookingData));
        setShowConfirmation(true);
        setTimeout(() => {
          setShowConfirmation(false);
          navigate('/checkin');
        }, 3000);
      }
    },
  });

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    formik.setFieldValue('doctorId', doctor.id);
    formik.setFieldValue('department', doctor.department);
  };

  const getDaysInWeek = () => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const current = new Date(year, month, i);
      // Ensure the time doesn't cause timezone offset issues for local dates
      current.setHours(12, 0, 0, 0);
      days.push(current);
    }
    return days;
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getSlotStatus = (slot) => {
    if (!selectedDoctor || !selectedDate) {
      const random = Math.random();
      if (random < 0.3) return 'booked';
      if (random < 0.5) return 'reserved';
      if (random < 0.6) return 'cancelled';
      return 'available';
    }
    const slotKey = `${selectedDoctor.name}-${selectedDate}-${slot}`;
    if (bookedSlots.includes(slotKey)) return 'booked';
    if (selectedDoctor.availableSlots.includes(slot)) return 'available';
    const random = Math.random();
    if (random < 0.3) return 'booked';
    if (random < 0.5) return 'reserved';
    if (random < 0.6) return 'cancelled';
    return 'available';
  };

  const isSlotBooked = (slot) => {
    if (!selectedDoctor || !selectedDate) return false;
    const slotKey = `${selectedDoctor.name}-${selectedDate}-${slot}`;
    return bookedSlots.includes(slotKey);
  };

  return (
    <div className="doctor-booking-page">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>{rescheduleMode ? 'Reschedule Appointment' : 'Doctor Booking'}</h1>
            <p>{rescheduleMode ? 'Update your appointment date and time' : 'Find and book appointments with our expert doctors'}</p>
          </div>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-value">5</span>
              <span className="stat-label">Available Doctors</span>
            </div>
            <div className="stat">
              <span className="stat-value">156</span>
              <span className="stat-label">Open Slots</span>
            </div>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className="confirmation-popup">
          <div className="success-icon-wrapper">
            <CheckCircleIcon className="success-icon" />
          </div>
          <h3>{rescheduleMode ? 'Appointment Rescheduled Successfully!' : 'Appointment Booked Successfully!'}</h3>
          <p>{rescheduleMode ? 'Your appointment has been updated. Check your email for details.' : 'Your appointment has been confirmed. Check your email for details.'}</p>
          <div className="confirmation-details">
            <div className="detail-row">
              <span className="detail-label">Patient</span>
              <span className="detail-value">{formik.values.patientName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Doctor</span>
              <span className="detail-value">{selectedDoctor?.name || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date</span>
              <span className="detail-value">{formik.values.appointmentDate}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Time</span>
              <span className="detail-value">{formik.values.timeSlot}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Mode</span>
              <span className="detail-value">{formik.values.consultationMode}</span>
            </div>
          </div>
          <div className="redirect-text">
            <span className="redirect-spinner"></span>
            {rescheduleMode ? 'Redirecting to booking history...' : 'Redirecting to check-in...'}
          </div>
        </div>
      )}

      {bookingInfo && !rescheduleMode && (
        <div className="booking-info-header">
          <div className="booking-info-item">
            <PersonIcon className="info-icon" />
            <span className="info-label">Patient</span>
            <span className="info-value">{bookingInfo.patientName}</span>
          </div>
          <div className="booking-info-divider"></div>
          <div className="booking-info-item">
            <BadgeIcon className="info-icon" />
            <span className="info-label">Booking ID</span>
            <span className="info-value">{bookingInfo.bookingId}</span>
          </div>
          <div className="booking-info-divider"></div>
          <div className="booking-info-item">
            <MedicalServicesIcon className="info-icon" />
            <span className="info-label">Department</span>
            <span className="info-value">{bookingInfo.department}</span>
          </div>
          <div className="booking-info-divider"></div>
          <div className="booking-info-item">
            <PersonIcon className="info-icon" />
            <span className="info-label">Doctor</span>
            <span className="info-value">{bookingInfo.selectedDoctor}</span>
          </div>
          <div className="booking-info-divider"></div>
          <div className="booking-info-item">
            <span className={`status-dot ${bookingInfo.appointmentStatus === 'confirmed' ? 'active' : ''}`}></span>
            <span className="info-label">Status</span>
            <span className={`info-value status-${bookingInfo.appointmentStatus}`}>
              {bookingInfo.appointmentStatus.charAt(0).toUpperCase() + bookingInfo.appointmentStatus.slice(1)}
            </span>
          </div>
        </div>
      )}

      <div className="booking-layout">
        <div className="left-panel">
          <div className="doctor-list-section">
            <div className="section-header">
              <h2>Select Doctor</h2>
              <div className="search-filter">
                <div className="search-box">
                  <SearchIcon className="search-icon" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search doctors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="doctor-cards">
              {filteredDoctors.map((doctor) => {
                const doctorBookings = appointments.filter(apt => apt.doctorName === doctor.name && apt.status?.toLowerCase() !== 'cancelled');
                const bookingStatus = doctorBookings.length > 0 ? `${doctorBookings.length} bookings` : 'No bookings';
                return (
                  <div
                    key={doctor.id}
                    className={`doctor-card ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    <div className="doctor-avatar">{doctor.avatar}</div>
                    <div className="doctor-info">
                      <h3>{doctor.name}</h3>
                      <p className="department">{doctor.department}</p>
                      <p className="specialization">{doctor.specialization}</p>
                      <div className="doctor-rating">
                        <span className="rating-value">{doctor.rating}</span>
                        <span className="rating-count">({doctor.reviews} reviews)</span>
                      </div>
                    </div>
                    <div className="doctor-meta">
                      <span className={`mode-badge ${doctor.mode.toLowerCase()}`}>
                        {doctor.mode === 'Online' ? <VideoCallIcon /> : doctor.mode === 'Offline' ? <LocationOnIcon /> : <><VideoCallIcon /><LocationOnIcon /></>}
                        {doctor.mode}
                      </span>
                      <span className="slots-count">{doctor.availableSlots.length} slots</span>
                    </div>
                    <div className="booking-status">
                      <span className={`status-dot ${doctorBookings.length > 0 ? 'active' : ''}`}></span>
                      {bookingStatus}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="calendar-section">
            <div className="calendar-header">
              <h2>Appointment Calendar</h2>
              {viewMode === 'monthly' && (
                <div className="month-navigation">
                  <button onClick={prevMonth}>&lt;</button>
                  <span>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  <button onClick={nextMonth}>&gt;</button>
                </div>
              )}
              <div className="view-toggle">
                <button className={viewMode === 'weekly' ? 'active' : ''} onClick={() => setViewMode('weekly')}>
                  <CalendarTodayIcon /> Weekly
                </button>
                <button className={viewMode === 'monthly' ? 'active' : ''} onClick={() => setViewMode('monthly')}>
                  <CalendarTodayIcon /> Monthly
                </button>
              </div>
            </div>
            <div className="calendar-grid">
              {viewMode === 'weekly' ? (
                <div className="weekly-view">
                  {getDaysInWeek().map((date, index) => (
                    <div
                      key={index}
                      className={`day-column ${formatDate(date) === selectedDate ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedDate(formatDate(date));
                        formik.setFieldValue('appointmentDate', formatDate(date));
                      }}
                    >
                      <div className="day-header">
                        <span className="day-name">{date.toLocaleDateString('en', { weekday: 'short' })}</span>
                        <span className="day-number">{date.getDate()}</span>
                        <span className="day-month">{date.toLocaleDateString('en', { month: 'short' })}</span>
                      </div>
                      <div className="slots-list">
                        {timeSlots.slice(0, 6).map((slot, slotIndex) => {
                          const status = getSlotStatus(slot);
                          return (
                            <div
                              key={slotIndex}
                              className={`slot-item ${status} ${selectedSlot === slot && formatDate(date) === selectedDate ? 'selected-slot' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (status === 'available') {
                                  setSelectedSlot(slot);
                                  formik.setFieldValue('timeSlot', slot);
                                }
                              }}
                            >
                              <span>{slot}</span>
                              <span className="status-dot"></span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="monthly-view">
                  <div className="week-days-header">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="week-day">{day}</div>
                    ))}
                  </div>
                  <div className="days-grid">
                    {getDaysInMonth(currentMonth).map((date, i) => {
                      if (!date) return <div key={`empty-${i}`} className="month-day empty"></div>;
                      const dateStr = formatDate(date);
                      const isPast = date < new Date(new Date().setHours(0,0,0,0));
                      return (
                        <div
                          key={i}
                          className={`month-day ${dateStr === selectedDate ? 'selected' : ''} ${isPast ? 'past' : ''}`}
                          onClick={() => {
                            if (!isPast) {
                              setSelectedDate(dateStr);
                              formik.setFieldValue('appointmentDate', dateStr);
                            }
                          }}
                        >
                          <span className="day-number">{date.getDate()}</span>
                          {!isPast && <span className="day-status-indicator"></span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="slot-legend">
              {Object.entries(slotStatuses).map(([key, value]) => (
                <div key={key} className="legend-item">
                  <span className={`legend-dot ${key}`}></span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="booking-form-section">
            <h2>Booking Form</h2>
            <form onSubmit={formik.handleSubmit} className="booking-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Patient Name</label>
                  <input
                    type="text"
                    name="patientName"
                    value={formik.values.patientName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.patientName && formik.errors.patientName ? 'error' : ''}
                    placeholder="Enter patient name"
                  />
                  {formik.touched.patientName && formik.errors.patientName && (
                    <span className="error-text">{formik.errors.patientName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Contact Number</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formik.values.contactNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.contactNumber && formik.errors.contactNumber ? 'error' : ''}
                    placeholder="10-digit number"
                  />
                  {formik.touched.contactNumber && formik.errors.contactNumber && (
                    <span className="error-text">{formik.errors.contactNumber}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.email && formik.errors.email ? 'error' : ''}
                    placeholder="patient@email.com"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <span className="error-text">{formik.errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formik.values.department}
                    readOnly
                    className="readonly"
                    placeholder="Select a doctor"
                  />
                </div>

                <div className="form-group">
                  <label>Appointment Date</label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formik.values.appointmentDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.appointmentDate && formik.errors.appointmentDate ? 'error' : ''}
                  />
                  {formik.touched.appointmentDate && formik.errors.appointmentDate && (
                    <span className="error-text">{formik.errors.appointmentDate}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Time Slot</label>
                  <input
                    type="text"
                    name="timeSlot"
                    value={formik.values.timeSlot}
                    readOnly
                    className="readonly"
                    placeholder="Select from calendar"
                  />
                </div>

                <div className="form-group">
                  <label>Consultation Mode</label>
                  <select
                    name="consultationMode"
                    value={formik.values.consultationMode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.consultationMode && formik.errors.consultationMode ? 'error' : ''}
                  >
                    <option value="">Select Mode</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                  {formik.touched.consultationMode && formik.errors.consultationMode && (
                    <span className="error-text">{formik.errors.consultationMode}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Appointment Type</label>
                  <select
                    name="appointmentType"
                    value={formik.values.appointmentType}
                    onChange={formik.handleChange}
                  >
                    <option value="Regular">Regular</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Symptoms / Notes</label>
                <textarea
                  name="symptoms"
                  value={formik.values.symptoms}
                  onChange={formik.handleChange}
                  rows={3}
                  placeholder="Describe any symptoms or special requirements..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-confirm-booking">
                  <CheckCircleIcon />
                  <span>Confirm Booking</span>
                  <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
                <button type="button" className="btn-secondary">Save Draft</button>
                <button type="button" className="btn-outline">Reschedule</button>
                <button type="button" className="btn-danger">Cancel Booking</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
