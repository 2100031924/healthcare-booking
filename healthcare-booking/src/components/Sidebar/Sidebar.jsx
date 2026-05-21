import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DescriptionIcon from '@mui/icons-material/Description';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HistoryIcon from '@mui/icons-material/History';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CloseIcon from '@mui/icons-material/Close';
import './Sidebar.scss';

export default function Sidebar({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    dispatch(logout());
    navigate('/login');
  };

  const [expandedMenu, setExpandedMenu] = useState(null);

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <DashboardIcon />, color: '#0ea5e9' },
    {
      name: 'Appointment Booking',
      icon: <EventAvailableIcon />,
      color: '#10b981',
      subItems: [
        { path: '/appointment', name: 'Appointment Calendar' },
        { path: '/appointment', name: 'Doctor Availability' },
      ],
    },
    { path: '/checkin', name: 'Patient Check-In', icon: <PersonAddIcon />, color: '#f59e0b' },
    { path: '/prescription', name: 'Prescription', icon: <DescriptionIcon />, color: '#8b5cf6' },
    { path: '/billing', name: 'Billing & Payment', icon: <ReceiptIcon />, color: '#ec4899' },
  ];

  const secondaryItems = [
    { path: '/booking-history', name: 'Booking History', icon: <HistoryIcon />, color: '#6366f1' },
    { path: '/notifications', name: 'Notifications', icon: <NotificationsIcon />, color: '#f43f5e' },
    { path: '/reports', name: 'Reports', icon: <BarChartIcon />, color: '#14b8a6' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-container">
          <LocalHospitalIcon className="logo-icon" />
          <div className="logo-text">
            <h2>CareConnect</h2>
            <span>AI Telemedicine</span>
          </div>
        </div>
        <button className="close-sidebar-btn" onClick={onClose} aria-label="Close sidebar">
          <CloseIcon />
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-section-title">Main Menu</span>
          {navItems.map((item, idx) => (
            <React.Fragment key={idx}>
              {item.subItems ? (
                <div className="nav-group">
                  <button
                    className={`nav-item nav-group-header ${expandedMenu === idx ? 'expanded' : ''}`}
                    onClick={() => setExpandedMenu(expandedMenu === idx ? null : idx)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-text">{item.name}</span>
                    <span className="expand-arrow">{expandedMenu === idx ? '▾' : '▸'}</span>
                  </button>
                  {expandedMenu === idx && (
                    <div className="nav-subitems">
                      {item.subItems.map((sub, subIdx) => (
                        <NavLink
                          key={subIdx}
                          to={sub.path}
                          className={({ isActive }) => `nav-subitem ${isActive ? 'active' : ''}`}
                        >
                          <span className="nav-text">{sub.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.name}</span>
                  <span className="active-indicator"></span>
                </NavLink>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="nav-section">
          <span className="nav-section-title">More</span>
          {secondaryItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">
                {item.icon}
              </span>
              <span className="nav-text">{item.name}</span>
              <span className="active-indicator"></span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="footer-card">
          <div className="footer-icon">
            <LocalHospitalIcon />
          </div>
          <div className="footer-content">
            <h4>Need Help?</h4>
            <p>Contact support</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <LogoutIcon />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
