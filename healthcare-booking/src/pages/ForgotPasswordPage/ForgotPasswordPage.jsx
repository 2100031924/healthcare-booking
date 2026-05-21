import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './ForgotPasswordPage.scss';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-header">
          <button className="back-btn" onClick={() => navigate('/login')}>
            <ArrowBackIcon /> Back to Login
          </button>
          <div className="header-icon">
            <LocalHospitalIcon />
          </div>
          <h2>Forgot Password?</h2>
          <p>Enter your registered email to receive a password reset link</p>
        </div>

        {success ? (
          <div className="success-state">
            <div className="success-icon-wrapper">
              <CheckCircleIcon />
            </div>
            <h3>Reset Link Sent!</h3>
            <p>We've sent a password reset link to <strong>{email}</strong></p>
            <p className="success-sub">Please check your inbox and follow the instructions.</p>
            <button className="btn-primary" onClick={() => navigate('/login')}>
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="forgot-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <EmailOutlinedIcon className="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={touched && error ? 'is-invalid' : touched && !error ? 'is-valid' : ''}
                />
              </div>
              {touched && error && (
                <div className="error-message">{error}</div>
              )}
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <p className="login-link">
              Remember your password? <Link to="/login">Login here</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
