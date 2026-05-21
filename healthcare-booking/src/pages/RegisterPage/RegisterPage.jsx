import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import './RegisterPage.scss';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (values) => {
    const newErrors = {};
    if (!values.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }
    if (!values.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!values.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(values.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit number';
    }
    if (!values.password) {
      newErrors.password = 'Password is required';
    } else if (values.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!values.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!values.agreeTerms) {
      newErrors.agreeTerms = 'You must accept the terms and conditions';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (touched[name]) {
      const updatedData = { ...formData, [name]: newValue };
      const newErrors = validate(updatedData);
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] || '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate(formData);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] || '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      agreeTerms: true,
    });
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        alert('Account created successfully (demo)');
        navigate('/login');
      }, 1000);
    }
  };

  const getFieldClass = (fieldName) => {
    if (!touched[fieldName]) return '';
    if (errors[fieldName]) return 'field-error';
    return 'field-valid';
  };

  return (
    <div className="register-page">
      <div className="register-bg-pattern" />
      <div className="register-container">
        <div className="register-left-panel">
          <div className="brand-content">
            <div className="brand-logo">
              <LocalHospitalIcon />
            </div>
            <h1>Healthcare Telemedicine</h1>
            <p className="tagline">
              Your health journey starts here. Accessible, secure, and modern telemedicine.
            </p>
            <div className="features-list">
              <div className="feature-item">
                <CheckCircleIcon className="feature-check" />
                <span>Instant Doctor Consultations</span>
              </div>
              <div className="feature-item">
                <CheckCircleIcon className="feature-check" />
                <span>Digital Prescriptions</span>
              </div>
              <div className="feature-item">
                <CheckCircleIcon className="feature-check" />
                <span>Secure Medical Records</span>
              </div>
            </div>
          </div>
          <div className="floating-shapes">
            <div className="shape shape-1"><MonitorHeartIcon /></div>
            <div className="shape shape-2"><VaccinesIcon /></div>
            <div className="shape shape-3"><SupportAgentIcon /></div>
          </div>
        </div>

        <div className="register-right-panel">
          <div className="mobile-header">
            <div className="mobile-logo">
              <LocalHospitalIcon />
            </div>
            <span className="mobile-brand">Healthcare</span>
          </div>
          <div className="register-card">
            <div className="register-header">
              <h2>Create Account</h2>
              <p>Register as a new patient</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="register-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <div className="input-wrapper">
                  <PersonOutlinedIcon className="input-icon" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getFieldClass('fullName')}
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  />
                </div>
                {touched.fullName && errors.fullName && (
                  <span id="fullName-error" className="error-text" role="alert">{errors.fullName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <EmailOutlinedIcon className="input-icon" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getFieldClass('email')}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                </div>
                {touched.email && errors.email && (
                  <span id="email-error" className="error-text" role="alert">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Mobile / Phone</label>
                <div className="input-wrapper">
                  <PhoneOutlinedIcon className="input-icon" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={10}
                    className={getFieldClass('phone')}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                </div>
                {touched.phone && errors.phone && (
                  <span id="phone-error" className="error-text" role="alert">{errors.phone}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper password-wrap">
                    <LockOutlinedIcon className="input-icon" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getFieldClass('password')}
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? 'password-error' : undefined}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <span id="password-error" className="error-text" role="alert">{errors.password}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-wrapper password-wrap">
                    <LockOutlinedIcon className="input-icon" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={getFieldClass('confirmPassword')}
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </button>
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <span id="confirmPassword-error" className="error-text" role="alert">{errors.confirmPassword}</span>
                  )}
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!errors.agreeTerms}
                  />
                  <span className="checkbox-custom">
                    <CheckCircleIcon className="checkbox-check" />
                  </span>
                  <span className="checkbox-text">
                    I agree to the <span className="link-text">Terms of Service</span> & <span className="link-text">Privacy Policy</span>
                  </span>
                </label>
                {touched.agreeTerms && errors.agreeTerms && (
                  <span className="error-text checkbox-error" role="alert">{errors.agreeTerms}</span>
                )}
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="spinner" />
                ) : (
                  'CREATE ACCOUNT'
                )}
              </button>

              <p className="login-link">
                Already have an account? <Link to="/login">Login here</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
