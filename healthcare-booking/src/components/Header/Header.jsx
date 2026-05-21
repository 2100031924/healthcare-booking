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
import './Header.scss';

export default function Header({ onMenuClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const userName = user?.name || 'Administrator';
  const userEmail = user?.email || 'admin@careconnect.com';

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    dispatch(logout());
    navigate('/login');
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark-mode');
  };

  const getFirstName = (name) => {
    if (!name) return 'User';
    const parts = name.split(' ').filter(Boolean);
    return parts[0];
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
        {/* Left: Logo & Branding */}
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

        {/* Center: Search */}
        <div className="header-center">
          <form 
            className="search-bar"
            onSubmit={(e) => {
              e.preventDefault();
              navigate('/appointment', { state: { searchQuery: e.target.search.value } });
            }}
          >
            <SearchIcon className="search-icon" />
            <input 
              name="search"
              type="text" 
              placeholder="Search doctors..." 
              className="search-input"
            />
            <button type="submit" className="search-submit-hidden">Search</button>
            <span className="search-shortcut">⌘K</span>
          </form>
        </div>

        {/* Right: Actions */}
        <div className="header-right">
          <button 
            className="icon-btn theme-toggle"
            onClick={handleToggleDarkMode}
            aria-label="Toggle theme"
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </button>

          <div className="divider-line"></div>

          <div className="user-profile-container" ref={profileRef}>
            <button 
              className="profile-trigger"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              aria-label="User profile menu"
            >
              <div className="user-details">
                <span className="welcome-text">Welcome back</span>
                <span className="user-name">{getFirstName(userName)}</span>
              </div>
              <KeyboardArrowDownIcon 
                className={`dropdown-arrow ${isProfileOpen ? 'open' : ''}`} 
              />
            </button>

            {isProfileOpen && (
              <div className="dropdown-panel profile-panel">
                <div className="profile-header">
                  <div className="profile-info">
                    <h4>{userName}</h4>
                    <p>{userEmail}</p>
                  </div>
                </div>
                
                {dropdownItems.map((item, index) => (
                  <button
                    key={index}
                    className="dropdown-item"
                    onClick={() => {
                      if (item.path) navigate(item.path);
                      setIsProfileOpen(false);
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}

                <div className="dropdown-divider"></div>
                
                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                  <LogoutIcon />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}