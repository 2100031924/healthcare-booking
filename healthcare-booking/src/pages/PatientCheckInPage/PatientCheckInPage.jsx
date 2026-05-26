import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import QrCodeIcon from '@mui/icons-material/QrCode';
import VerifiedIcon from '@mui/icons-material/Verified';
import PeopleIcon from '@mui/icons-material/People';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { selectAppointments } from '../../redux';
import './PatientCheckInPage.scss';

const STATUS_ORDER = ['waiting', 'checked-in', 'in-consultation', 'completed'];

const getMergedAppointments = (reduxAppointments) => {
  const byId = new Map();
  for (const apt of reduxAppointments) {
    byId.set(apt.id, apt);
  }
  try {
    const stored = JSON.parse(localStorage.getItem('appointments') || '[]');
    for (const apt of stored) {
      if (!byId.has(apt.id)) {
        byId.set(apt.id, apt);
      }
    }
    const last = JSON.parse(localStorage.getItem('lastBooking') || 'null');
    if (last && last.id && !byId.has(last.id)) {
      byId.set(last.id, { ...last, status: last.status || 'confirmed' });
    }
  } catch (e) {}
  return Array.from(byId.values());
};

const loadCheckInStates = () => {
  try {
    return JSON.parse(localStorage.getItem('checkInStates') || '{}');
  } catch (e) {
    return {};
  }
};

const persistCheckInStates = (states) => {
  try {
    localStorage.setItem('checkInStates', JSON.stringify(states));
  } catch (e) {}
};

export default function PatientCheckInPage() {
  const navigate = useNavigate();
  const reduxAppointments = useSelector(selectAppointments);
  const appointments = getMergedAppointments(reduxAppointments);

  const [checkInStates, setCheckInStates] = useState(loadCheckInStates);
  const [selectedId, setSelectedId] = useState(null);
  const [otpError, setOtpError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const selectedApt = useMemo(() => {
    if (!selectedId) return null;
    return appointments.find(a => a.id === selectedId) || null;
  }, [appointments, selectedId]);

  const selectedState = useMemo(() => {
    if (!selectedId) return null;
    return checkInStates[selectedId] || { status: 'waiting', otpSent: false, otpVerified: false, showDigitalToken: false };
  }, [checkInStates, selectedId]);

  const getPatientState = useCallback((id) => {
    return checkInStates[id] || { status: 'waiting', otpSent: false, otpVerified: false, showDigitalToken: false };
  }, [checkInStates]);

  const sortedPatients = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const aStatus = getPatientState(a.id).status || 'waiting';
      const bStatus = getPatientState(b.id).status || 'waiting';
      return STATUS_ORDER.indexOf(aStatus) - STATUS_ORDER.indexOf(bStatus);
    });
  }, [appointments, getPatientState]);

  const summaryCounts = useMemo(() => {
    let total = appointments.length;
    let checkedIn = 0;
    let waiting = 0;
    for (const apt of appointments) {
      const st = getPatientState(apt.id).status || 'waiting';
      if (st === 'checked-in' || st === 'in-consultation' || st === 'completed') checkedIn++;
      if (st === 'waiting') waiting++;
    }
    return { total, checkedIn, waiting };
  }, [appointments, getPatientState]);

  useEffect(() => {
    if (selectedId && !selectedApt) {
      setSelectedId(null);
    }
  }, [selectedId, selectedApt]);

  useEffect(() => {
    if (appointments.length > 0 && !selectedId) {
      setSelectedId(appointments[0].id);
    }
  }, [appointments, selectedId]);

  const updatePatientState = useCallback((id, updates) => {
    setCheckInStates(prev => {
      const next = { ...prev, [id]: { ...prev[id], ...updates } };
      persistCheckInStates(next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (selectedId) {
      const st = getPatientState(selectedId);
      setGeneratedOtp('');
      setOtpError('');
      setMobileError('');
      formik.setValues({
        appointmentId: `APT-${selectedId}`,
        mobileNumber: '',
        otp: '',
        symptoms: '',
      });
    }
  }, [selectedId]);

  const formik = useFormik({
    initialValues: {
      appointmentId: '',
      mobileNumber: '',
      otp: '',
      symptoms: '',
    },
    validationSchema: Yup.object({
      appointmentId: Yup.string().required('Appointment ID is required'),
      mobileNumber: Yup.string().matches(/^[0-9]{10}$/, 'Invalid phone number').required('Mobile Number is required'),
      otp: Yup.string().matches(/^[0-9]{6}$/, 'OTP must be 6 digits').required('OTP is required'),
    }),
    onSubmit: (values) => {
      if (!selectedId) return;
      const st = getPatientState(selectedId);
      if (!st.otpVerified) {
        setOtpError('Please verify OTP first');
        return;
      }
      updatePatientState(selectedId, { status: 'checked-in', showDigitalToken: true });
    },
    enableReinitialize: true,
  });

  const handleSendOtp = () => {
    if (!selectedId) return;
    setMobileError('');
    setOtpError('');
    const phone = formik.values.mobileNumber;
    if (!phone || phone.length !== 10 || !/^[0-9]{10}$/.test(phone)) {
      setMobileError('Enter a valid 10-digit mobile number');
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    updatePatientState(selectedId, { otpSent: true, otpVerified: false });
    formik.setFieldValue('otp', '');
  };

  const handleVerifyOtp = () => {
    if (!selectedId) return;
    setOtpError('');
    const enteredOtp = formik.values.otp;
    if (!enteredOtp || enteredOtp.length !== 6) {
      setOtpError('Enter a valid 6-digit OTP');
      return;
    }
    if (enteredOtp === generatedOtp) {
      updatePatientState(selectedId, { otpVerified: true });
      setOtpError('');
    } else {
      setOtpError('Invalid OTP. Please try again.');
      updatePatientState(selectedId, { otpVerified: false });
    }
  };

  const handleAdvanceStatus = () => {
    if (!selectedId) return;
    const st = getPatientState(selectedId);
    if (st.status === 'checked-in') {
      updatePatientState(selectedId, { status: 'in-consultation' });
      setTimeout(() => {
        updatePatientState(selectedId, { status: 'completed' });
      }, 10000);
    }
  };

  const handleCancelCheckIn = () => {
    if (!selectedId) return;
    updatePatientState(selectedId, {
      status: 'waiting',
      otpSent: false,
      otpVerified: false,
      showDigitalToken: false,
    });
    setGeneratedOtp('');
    setOtpError('');
    setMobileError('');
    formik.resetForm();
  };

  const statusLabel = (s) => {
    return (s || 'waiting').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const patientInfo = selectedApt ? {
    name: selectedApt.patientName,
    appointmentId: selectedApt.appointmentId || `APT-${selectedApt.id}`,
    doctor: selectedApt.doctorName,
    appointmentTime: selectedApt.timeSlot,
    appointmentDate: selectedApt.appointmentDate,
    department: selectedApt.department,
    consultationMode: selectedApt.consultationMode,
    contactNumber: selectedApt.contactNumber,
    email: selectedApt.email,
    patientId: 'PT-' + selectedApt.id,
    room: 'Room 204',
  } : null;

  return (
    <div className="patient-checkin-page">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>Patient Check-In</h1>
            <p>Select a patient to verify and check in</p>
          </div>
          <div className="checkin-progress">
            <div className={`progress-step ${selectedState?.otpVerified ? 'completed' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Verify OTP</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${selectedState?.status === 'checked-in' ? 'completed' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Check In</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${selectedState?.showDigitalToken ? 'completed' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Get Token</span>
            </div>
          </div>
        </div>
      </div>

      {generatedOtp && (
        <div className="otp-demo-banner">
          <CheckCircleIcon className="banner-icon" />
          <span>Demo OTP: <strong>{generatedOtp}</strong></span>
        </div>
      )}

      <div className="checkin-summary-bar">
        <div className="summary-item">
          <PeopleIcon className="summary-icon total" />
          <span className="summary-label">Total Patients</span>
          <span className="summary-value">{summaryCounts.total}</span>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-item">
          <HowToRegIcon className="summary-icon checked-in" />
          <span className="summary-label">Checked In</span>
          <span className="summary-value">{summaryCounts.checkedIn}</span>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-item">
          <HourglassEmptyIcon className="summary-icon waiting" />
          <span className="summary-label">Waiting</span>
          <span className="summary-value">{summaryCounts.waiting}</span>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="no-booking-card">
          <EventNoteIcon className="no-booking-icon" />
          <h3>No Bookings Found</h3>
          <p>Please book an appointment first from the Doctor Booking page.</p>
          <button className="btn-book" onClick={() => navigate('/appointment')}>Book Appointment</button>
        </div>
      ) : (
        <div className="checkin-layout">
          <div className="left-panel">
            <div className="patient-list-card">
              <div className="patient-list-header">
                <PeopleIcon />
                <h3>All Patients ({appointments.length})</h3>
              </div>
              <div className="patient-list-table-wrapper">
                <table className="patient-list-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPatients.map(apt => {
                      const st = getPatientState(apt.id);
                      return (
                        <tr
                          key={apt.id}
                          className={`patient-row ${selectedId === apt.id ? 'selected' : ''}`}
                          onClick={() => setSelectedId(apt.id)}
                        >
                          <td>
                            <div className="patient-cell">
                              <div className="patient-avatar-sm">
                                <PersonIcon />
                              </div>
                              <span className="patient-name">{apt.patientName}</span>
                            </div>
                          </td>
                          <td>{apt.doctorName}</td>
                          <td>{apt.appointmentDate}</td>
                          <td>{apt.timeSlot}</td>
                          <td>
                            <span className={`status-badge status-${st.status || 'waiting'}`}>
                              <span className={`status-dot status-${st.status || 'waiting'}`}></span>
                              {statusLabel(st.status)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {selectedApt && (
              <>
                <div className="patient-card">
                  <div className="patient-header">
                    <div className="patient-avatar">
                      <PersonIcon />
                    </div>
                    <div className="patient-info">
                      <h3>{patientInfo.name}</h3>
                      <p className="patient-id">ID: {patientInfo.patientId}</p>
                    </div>
                    <div className={`status-badge status-${selectedState?.status || 'waiting'}`}>
                      {statusLabel(selectedState?.status)}
                    </div>
                  </div>
                  <div className="patient-details-grid">
                    <div className="detail-item">
                      <EventNoteIcon />
                      <div>
                        <span className="label">Department</span>
                        <span className="value">{patientInfo.department}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <AccessTimeIcon />
                      <div>
                        <span className="label">Date</span>
                        <span className="value">{patientInfo.appointmentDate}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <AccessTimeIcon />
                      <div>
                        <span className="label">Time Slot</span>
                        <span className="value">{patientInfo.appointmentTime}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <PersonIcon />
                      <div>
                        <span className="label">Doctor</span>
                        <span className="value">{patientInfo.doctor}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <MedicalServicesIcon />
                      <div>
                        <span className="label">Mode</span>
                        <span className="value">{patientInfo.consultationMode}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <PersonIcon />
                      <div>
                        <span className="label">Contact</span>
                        <span className="value">{patientInfo.contactNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="queue-card">
                  <h2>Queue Status</h2>
                  <div className="queue-display">
                    <div className="queue-position">
                      <span className="position-number">
                        #{sortedPatients.findIndex(a => a.id === selectedId) + 1}
                      </span>
                      <span className="position-label">Queue Position</span>
                    </div>
                    <div className="queue-estimated">
                      <span className="time">
                        ~{sortedPatients.filter(a => {
                          const s = getPatientState(a.id).status || 'waiting';
                          return s === 'waiting';
                        }).length * 5} mins
                      </span>
                      <span className="label">Est. Wait</span>
                    </div>
                  </div>
                  <div className="queue-list">
                    <h4>Queue Order</h4>
                    {sortedPatients.map((apt, idx) => {
                      const st = getPatientState(apt.id).status || 'waiting';
                      return (
                        <div
                          key={apt.id}
                          className={`queue-list-item ${apt.id === selectedId ? 'current' : ''} status-${st}`}
                          onClick={() => setSelectedId(apt.id)}
                        >
                          <span className="queue-idx">#{idx + 1}</span>
                          <span className={`status-dot status-${st}`}></span>
                          <span className="queue-name">{apt.patientName}</span>
                          <span className="queue-status-label">{statusLabel(st)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="queue-steps">
                    <div className={`queue-step ${selectedState?.status === 'waiting' || selectedState?.status === 'checked-in' || selectedState?.status === 'in-consultation' || selectedState?.status === 'completed' ? 'completed' : ''}`}>
                      <CheckCircleIcon /> Registered
                    </div>
                    <div className={`queue-step ${selectedState?.status === 'checked-in' || selectedState?.status === 'in-consultation' || selectedState?.status === 'completed' ? 'current' : ''}`}>
                      <span className="step-dot"></span> Checked In
                    </div>
                    <div className={`queue-step ${selectedState?.status === 'in-consultation' || selectedState?.status === 'completed' ? 'current' : ''}`}>
                      <span className="step-dot"></span> In Consultation
                    </div>
                    <div className={`queue-step ${selectedState?.status === 'completed' ? 'completed' : ''}`}>
                      <span className="step-dot"></span> Completed
                    </div>
                  </div>
                </div>

                {selectedState?.showDigitalToken && (
                  <div className="digital-token-card">
                    <div className="token-header">
                      <QrCodeIcon />
                      <h2>Digital Token</h2>
                    </div>
                    <div className="token-body">
                      <div className="qr-code">
                        <QrCodeIcon />
                      </div>
                      <div className="token-details">
                        <div className="token-row">
                          <span className="label">Token ID</span>
                          <span className="value">{patientInfo.appointmentId}</span>
                        </div>
                        <div className="token-row">
                          <span className="label">Patient</span>
                          <span className="value">{patientInfo.name}</span>
                        </div>
                        <div className="token-row">
                          <span className="label">Doctor</span>
                          <span className="value">{patientInfo.doctor}</span>
                        </div>
                        <div className="token-row">
                          <span className="label">Date</span>
                          <span className="value">{patientInfo.appointmentDate}</span>
                        </div>
                        <div className="token-row">
                          <span className="label">Time</span>
                          <span className="value">{patientInfo.appointmentTime}</span>
                        </div>
                        <div className="token-row">
                          <span className="label">Room</span>
                          <span className="value">{patientInfo.room}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="right-panel">
            <div className="checkin-form-card">
              <h2>
                Verification Form
                {selectedApt && <span className="form-patient-name">{selectedApt.patientName}</span>}
              </h2>
              {!selectedApt ? (
                <div className="no-patient-selected">
                  <PersonIcon className="no-patient-icon" />
                  <p>Select a patient from the list to begin check-in</p>
                </div>
              ) : (
                <form onSubmit={formik.handleSubmit} className="checkin-form">
                  <div className="form-group">
                    <label>Appointment ID</label>
                    <input
                      type="text"
                      name="appointmentId"
                      value={formik.values.appointmentId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter your appointment ID"
                      className={formik.touched.appointmentId && formik.errors.appointmentId ? 'error' : ''}
                    />
                    {formik.touched.appointmentId && formik.errors.appointmentId && (
                      <span className="error-text">{formik.errors.appointmentId}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Mobile Number</label>
                    <div className="input-with-button">
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formik.values.mobileNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="10-digit number"
                        className={mobileError || (formik.touched.mobileNumber && formik.errors.mobileNumber) ? 'error' : ''}
                      />
                      <button type="button" className="btn-send-otp" onClick={handleSendOtp} disabled={selectedState?.otpSent}>
                        {selectedState?.otpSent ? 'Sent' : 'Send OTP'}
                      </button>
                    </div>
                    {mobileError && <span className="error-text">{mobileError}</span>}
                  </div>

                  <div className="form-group">
                    <label>
                      Verification OTP
                      {selectedState?.otpVerified && <VerifiedIcon className="verified-icon" />}
                    </label>
                    <div className="input-with-button">
                      <input
                        type="text"
                        name="otp"
                        value={formik.values.otp}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        maxLength={6}
                        placeholder="6-digit OTP"
                        className={otpError || (formik.touched.otp && formik.errors.otp) ? 'error' : ''}
                      />
                      <button type="button" className={`btn-verify ${selectedState?.otpVerified ? 'verified' : ''}`} onClick={handleVerifyOtp} disabled={!selectedState?.otpSent}>
                        {selectedState?.otpVerified ? 'Verified' : 'Verify'}
                      </button>
                    </div>
                    {otpError && <span className="error-text">{otpError}</span>}
                  </div>

                  <div className="form-group">
                    <label>Symptoms / Notes (Optional)</label>
                    <textarea
                      name="symptoms"
                      value={formik.values.symptoms}
                      onChange={formik.handleChange}
                      rows={3}
                      placeholder="Any symptoms or special requirements..."
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={!selectedState?.otpVerified}>
                      <CheckCircleIcon /> Complete Check-In
                    </button>
                    {selectedState?.status === 'checked-in' && (
                      <button type="button" className="btn-advance" onClick={handleAdvanceStatus}>
                        Advance to Consultation
                      </button>
                    )}
                    {selectedState?.status !== 'waiting' && (
                      <button type="button" className="btn-danger" onClick={handleCancelCheckIn}>
                        Reset Check-In
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
