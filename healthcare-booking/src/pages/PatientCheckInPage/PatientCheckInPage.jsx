import React, { useState, useEffect } from 'react';
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
import './PatientCheckInPage.scss';

export default function PatientCheckInPage() {
  const navigate = useNavigate();
  const storedBooking = JSON.parse(localStorage.getItem('lastBooking') || 'null');
  const lastAppointment = storedBooking;
  const [checkInStatus, setCheckInStatus] = useState('waiting');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showDigitalToken, setShowDigitalToken] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [queuePosition, setQueuePosition] = useState(3);
  const [estimatedWait, setEstimatedWait] = useState(20);

  const patientInfo = lastAppointment ? {
    name: lastAppointment.patientName,
    appointmentId: `APT-${lastAppointment.id}`,
    doctor: lastAppointment.doctorName,
    appointmentTime: lastAppointment.timeSlot,
    appointmentDate: lastAppointment.appointmentDate,
    department: lastAppointment.department,
    consultationMode: lastAppointment.consultationMode,
    contactNumber: lastAppointment.contactNumber,
    email: lastAppointment.email,
    patientId: 'PT-' + lastAppointment.id,
    room: 'Room 204',
  } : null;

  const handleSendOtp = () => {
    setMobileError('');
    setOtpError('');
    const phone = formik.values.mobileNumber;
    if (!phone || phone.length !== 10 || !/^[0-9]{10}$/.test(phone)) {
      setMobileError('Enter a valid 10-digit mobile number');
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setOtpSent(true);
    setOtpVerified(false);
    formik.setFieldValue('otp', '');
  };

  const handleVerifyOtp = () => {
    setOtpError('');
    const enteredOtp = formik.values.otp;
    if (!enteredOtp || enteredOtp.length !== 6) {
      setOtpError('Enter a valid 6-digit OTP');
      return;
    }
    if (enteredOtp === generatedOtp) {
      setOtpVerified(true);
      setOtpError('');
    } else {
      setOtpError('Invalid OTP. Please try again.');
      setOtpVerified(false);
    }
  };

  const queueInfo = {
    position: 3,
    waitingTime: '15 mins',
    consultationRoom: 'Room 204',
    status: 'Waiting',
    estimatedWait: '20 mins',
  };

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
      if (!otpVerified) {
        setOtpError('Please verify OTP first');
        return;
      }
      setCheckInStatus('checked-in');
      setShowDigitalToken(true);
    },
  });

  useEffect(() => {
    if (checkInStatus === 'waiting') {
      const interval = setInterval(() => {
        setQueuePosition(prev => Math.max(1, prev - 1));
        setEstimatedWait(prev => Math.max(5, prev - Math.floor(Math.random() * 3 + 1)));
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [checkInStatus]);

  const handleCancelCheckIn = () => {
    setCheckInStatus('waiting');
    setShowDigitalToken(false);
    setOtpSent(false);
    setOtpVerified(false);
    setGeneratedOtp('');
    setQueuePosition(3);
    setEstimatedWait(20);
    formik.resetForm();
  };

  const handleAdvanceStatus = () => {
    if (checkInStatus === 'checked-in') {
      setCheckInStatus('in-consultation');
      setTimeout(() => {
        setCheckInStatus('completed');
      }, 10000);
    }
  };

  return (
    <div className="patient-checkin-page">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>Patient Check-In</h1>
            <p>Complete your verification and get your digital token</p>
          </div>
          <div className="checkin-progress">
            <div className={`progress-step ${otpVerified ? 'completed' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Verify OTP</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${checkInStatus === 'checked-in' ? 'completed' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Check In</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${showDigitalToken ? 'completed' : ''}`}>
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

      {patientInfo && (
        <div className="checkin-info-header">
          <div className="checkin-info-item">
            <PersonIcon className="info-icon" />
            <span className="info-label">Patient</span>
            <span className="info-value">{patientInfo.name}</span>
          </div>
          <div className="checkin-info-divider"></div>
          <div className="checkin-info-item">
            <EventNoteIcon className="info-icon" />
            <span className="info-label">Appointment ID</span>
            <span className="info-value">{patientInfo.appointmentId}</span>
          </div>
          <div className="checkin-info-divider"></div>
          <div className="checkin-info-item">
            <PersonIcon className="info-icon" />
            <span className="info-label">Doctor</span>
            <span className="info-value">{patientInfo.doctor}</span>
          </div>
          <div className="checkin-info-divider"></div>
          <div className="checkin-info-item">
            <AccessTimeIcon className="info-icon" />
            <span className="info-label">Time</span>
            <span className="info-value">{patientInfo.appointmentTime}</span>
          </div>
          <div className="checkin-info-divider"></div>
          <div className="checkin-info-item">
            <span className={`status-dot status-${checkInStatus}`}></span>
            <span className="info-label">Check-In Status</span>
            <span className={`info-value status-${checkInStatus}`}>
              {checkInStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
        </div>
      )}

      <div className="checkin-layout">
        <div className="left-panel">
          {!patientInfo ? (
            <div className="no-booking-card">
              <EventNoteIcon className="no-booking-icon" />
              <h3>No Booking Found</h3>
              <p>Please book an appointment first from the Doctor Booking page.</p>
              <button className="btn-book" onClick={() => navigate('/appointment')}>Book Appointment</button>
            </div>
          ) : (
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
                  <div className={`status-badge status-${checkInStatus}`}>
                    {checkInStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                <span className="position-number">#{queuePosition}</span>
                <span className="position-label">Your Position</span>
              </div>
              <div className="queue-estimated">
                <span className="time">~{estimatedWait} mins</span>
                <span className="label">Est. Wait</span>
              </div>
            </div>
            <div className="queue-steps">
              <div className={`queue-step ${checkInStatus === 'waiting' || checkInStatus === 'checked-in' || checkInStatus === 'in-consultation' || checkInStatus === 'completed' ? 'completed' : ''}`}>
                <CheckCircleIcon /> Registered
              </div>
              <div className={`queue-step ${checkInStatus === 'checked-in' || checkInStatus === 'in-consultation' || checkInStatus === 'completed' ? 'current' : ''}`}>
                <span className="step-dot"></span> Checked In
              </div>
              <div className={`queue-step ${checkInStatus === 'in-consultation' || checkInStatus === 'completed' ? 'current' : ''}`}>
                <span className="step-dot"></span> In Consultation
              </div>
              <div className={`queue-step ${checkInStatus === 'completed' ? 'completed' : ''}`}>
                <span className="step-dot"></span> Completed
              </div>
            </div>
          </div>

          {showDigitalToken && (
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
            <h2>Verification Form</h2>
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
                  <button type="button" className="btn-send-otp" onClick={handleSendOtp} disabled={otpSent}>
                    {otpSent ? 'Sent' : 'Send OTP'}
                  </button>
                </div>
                {mobileError && <span className="error-text">{mobileError}</span>}
              </div>

              <div className="form-group">
                <label>
                  Verification OTP
                  {otpVerified && <VerifiedIcon className="verified-icon" />}
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
                  <button type="button" className={`btn-verify ${otpVerified ? 'verified' : ''}`} onClick={handleVerifyOtp} disabled={!otpSent}>
                    {otpVerified ? 'Verified' : 'Verify'}
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
                <button type="submit" className="btn-primary" disabled={!otpVerified}>
                  <CheckCircleIcon /> Complete Check-In
                </button>
                {checkInStatus === 'checked-in' && (
                  <button type="button" className="btn-advance" onClick={handleAdvanceStatus}>
                    Advance to Consultation
                  </button>
                )}
                <button type="button" className="btn-outline">Update Details</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
