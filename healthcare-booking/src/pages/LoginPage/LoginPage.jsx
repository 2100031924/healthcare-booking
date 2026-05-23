import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginRequest, selectAuthLoading, selectAuthError, selectIsAuthenticated } from '../../redux';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CircularProgress from '@mui/material/CircularProgress';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import VideocamIcon from '@mui/icons-material/Videocam';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import './LoginPage.scss';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => ({
    loading: selectAuthLoading(state),
    error: selectAuthError(state),
    isAuthenticated: selectIsAuthenticated(state),
  }));

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(loginRequest(values));
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-container">
      <div className="login-split-layout">
        
        {/* Left Side: Branding & Illustration */}
        <div className="login-left-panel">
          <div className="floating-icons">
            <div className="float-icon icon-1"><FavoriteIcon /></div>
            <div className="float-icon icon-2"><CalendarMonthIcon /></div>
            <div className="float-icon icon-3"><MedicalServicesIcon /></div>
            <div className="float-icon icon-4"><VideocamIcon /></div>
            <div className="float-icon icon-5"><HealthAndSafetyIcon /></div>
          </div>
          
          <div className="brand-content">
            <div className="brand-logo">
              <LocalHospitalIcon fontSize="inherit" />
            </div>
            <h1>Healthcare Telemedicine</h1>
            <p className="tagline">AI-Powered Telemedicine Ecosystem</p>
            
            <div className="features-showcase">
              <div className="feature-badge">
                <CheckCircleIcon className="badge-icon" />
                <span>24/7 Virtual Consultations</span>
              </div>
              <div className="feature-badge">
                <CheckCircleIcon className="badge-icon" />
                <span>Expert Healthcare Professionals</span>
              </div>
              <div className="feature-badge">
                <CheckCircleIcon className="badge-icon" />
                <span>Secure Medical Records</span>
              </div>
            </div>
            
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Patients Served</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">200+</span>
                <span className="stat-label">Expert Doctors</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">99%</span>
                <span className="stat-label">Satisfaction Rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="login-right-panel">
          <div className="mobile-header">
            <div className="mobile-logo">
              <LocalHospitalIcon />
            </div>
            <span className="mobile-brand">Healthcare</span>
          </div>
          <div className="login-card">
            <div className="login-header">
              <div className="header-icon">
                <LocalHospitalIcon />
              </div>
              <h2>Welcome Back</h2>
              <p>Sign in to access your healthcare portal</p>
            </div>

            {error && (
              <div className="error-alert" role="alert" aria-live="assertive">
                <span className="error-icon">!</span>
                {error}
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-with-icon">
                  <EmailOutlinedIcon className="input-icon" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email (e.g. Sincere@april.biz)"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.email && formik.errors.email ? 'is-invalid' : formik.touched.email && !formik.errors.email ? 'is-valid' : ''}
                    aria-invalid={formik.touched.email && !!formik.errors.email}
                    aria-describedby="email-error"
                  />
                  {formik.touched.email && !formik.errors.email && <CheckCircleIcon className="success-icon" />}
                </div>
                {formik.touched.email && formik.errors.email && (
                  <div id="email-error" className="error-message">{formik.errors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon password-input-wrap">
                  <LockOutlinedIcon className="input-icon" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.password && formik.errors.password ? 'is-invalid' : formik.touched.password && !formik.errors.password ? 'is-valid' : ''}
                    aria-invalid={formik.touched.password && !!formik.errors.password}
                    aria-describedby="password-error"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                  {formik.touched.password && !formik.errors.password && <CheckCircleIcon className="success-icon" />}
                </div>
                {formik.touched.password && formik.errors.password && (
                  <div id="password-error" className="error-message">{formik.errors.password}</div>
                )}
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formik.values.rememberMe}
                    onChange={formik.handleChange}
                  />
                  <span className="checkmark"></span>
                  Remember me for 30 days
                </label>
                <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}>Forgot Password?</a>
              </div>

              <button 
                type="submit" 
                className="login-submit-btn" 
                disabled={loading || !formik.isValid || !formik.dirty}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>

              <div className="register-link">
                <span>Don't have an account?</span>
                <Link to="/register">Create Account</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
