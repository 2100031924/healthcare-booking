import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LockIcon from '@mui/icons-material/Lock';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import './Header.scss';

const QUICK_NOTIFS = [
  { id: 1, text: 'New appointment booked by Kiran Kumar', time: '5m', unread: true },
  { id: 2, text: 'Payment of ₹1,050 received', time: '1h', unread: true },
  { id: 3, text: 'Prescription generated for Anusha', time: '3h', unread: true },
];

export default function Header({ onMenuClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const userName = user?.name || 'Administrator';
  const userEmail = user?.email || 'admin@careconnect.com';

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const mobileSearchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (mobileSearch && mobileSearchRef.current) mobileSearchRef.current.focus();
  }, [mobileSearch]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    dispatch(logout());
    navigate('/login');
  };

  const handleToggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark-mode');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/appointment', { state: { searchQuery: searchVal } });
    setMobileSearch(false);
    setSearchVal('');
  };

  const firstName = (name) => {
    if (!name) return 'User';
    return name.split(' ').filter(Boolean)[0];
  };

  const dropdownItems = [
    { icon: <DashboardIcon />, label: 'My Dashboard', path: '/dashboard' },
    { icon: <EventAvailableIcon />, label: 'My Appointments', path: '/appointment' },
    { icon: <PeopleIcon />, label: 'My Doctors', path: '/appointment' },
    { icon: <ReceiptIcon />, label: 'Billing & Payments', path: '/billing' },
    { icon: <SettingsIcon />, label: 'Account Settings', path: null },
    { icon: <LockIcon />, label: 'Change Password', path: null },
  ];

  return (
    <header className={`modern-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        <div className="header-left">
          <button className="menu-toggle-btn" onClick={onMenuClick} aria-label="Toggle menu">
            <MenuIcon />
          </button>
          <div className="app-branding">
            <div className="logo-container">
              <LocalHospitalIcon />
            </div>
            <div className="brand-text">
              <h1 className="app-name">CareConnect</h1>
              <span className="app-tagline">Telemedicine Portal</span>
            </div>
          </div>
        </div>

        <div className="header-center">
          <form className="search-bar" onSubmit={handleSearch}>
            <SearchIcon className="search-icon" />
            <input
              name="search"
              type="text"
              placeholder="Search doctors, patients..."
              className="search-input"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
            <span className="search-shortcut">⌘K</span>
          </form>
        </div>

        <div className="header-right">
          <button
            className="icon-btn mobile-search-btn"
            onClick={() => setMobileSearch(!mobileSearch)}
            aria-label="Search"
          >
            <SearchIcon />
          </button>

          <button
            className="icon-btn theme-toggle"
            onClick={handleToggleDark}
            aria-label="Toggle theme"
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </button>

          <div className="notif-container" ref={notifRef}>
            <button
              className="icon-btn notif-btn"
              onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              aria-label="Notifications"
            >
              <NotificationsIcon />
              <span className="notif-badge">{QUICK_NOTIFS.filter((n) => n.unread).length}</span>
            </button>
            {notifOpen && (
              <div className="dropdown-panel notif-panel">
                <div className="panel-header">
                  <h3>Notifications</h3>
                  <span className="panel-action">Mark all read</span>
                </div>
                <div className="panel-body">
                  {QUICK_NOTIFS.map((n) => (
                    <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
                      <div className="notif-dot" />
                      <div className="notif-content">
                        <p>{n.text}</p>
                        <span className="notif-time">{n.time} ago</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="panel-footer" onClick={() => { navigate('/notifications'); setNotifOpen(false); }}>
                  View All Notifications
                </div>
              </div>
            )}
          </div>

          <div className="divider-line" />

          <div className="user-profile-container" ref={profileRef}>
            <button
              className="profile-trigger"
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              aria-label="User menu"
            >
              <div className="user-details">
                <span className="welcome-text">Welcome back</span>
                <span className="user-name">{firstName(userName)}</span>
              </div>
              <KeyboardArrowDownIcon className={`dropdown-arrow ${profileOpen ? 'open' : ''}`} />
            </button>
            {profileOpen && (
              <div className="dropdown-panel profile-panel">
                <div className="profile-header">
                  <h4>{userName}</h4>
                  <p>{userEmail}</p>
                </div>
                {dropdownItems.map((item, i) => (
                  <button
                    key={i}
                    className="dropdown-item"
                    onClick={() => { if (item.path) navigate(item.path); setProfileOpen(false); }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
                <div className="dropdown-divider" />
                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                  <LogoutIcon />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileSearch && (
        <div className="mobile-search-overlay">
          <form className="mobile-search-bar" onSubmit={handleSearch}>
            <SearchIcon className="search-icon" />
            <input
              ref={mobileSearchRef}
              type="text"
              placeholder="Search doctors, patients..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
            <button type="button" className="close-search" onClick={() => setMobileSearch(false)}>
              <CloseIcon />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
