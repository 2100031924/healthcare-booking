import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SystemUpdateIcon from '@mui/icons-material/SystemUpdate';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FilterListIcon from '@mui/icons-material/FilterList';
import './NotificationsPage.scss';

const initialNotifications = [
  { id: 1, type: 'booking', title: 'New Appointment Booked', message: 'John Doe booked an appointment with Dr. Venkat Reddy', time: '2 mins ago', read: false, icon: <EventAvailableIcon />, category: 'Appointment' },
  { id: 2, type: 'payment', title: 'Payment Received', message: 'Payment of ₹1,050 received from Jane Smith', time: '1 hour ago', read: false, icon: <ReceiptIcon />, category: 'Billing' },
  { id: 3, type: 'prescription', title: 'Prescription Generated', message: 'Dr. Priya Patel generated a new prescription', time: '3 hours ago', read: false, icon: <DescriptionIcon />, category: 'Prescription' },
  { id: 4, type: 'checkin', title: 'Patient Checked In', message: 'Rahul Sharma checked in for appointment APT-2026-001', time: '5 hours ago', read: true, icon: <PersonAddIcon />, category: 'Check-In' },
  { id: 5, type: 'system', title: 'System Update', message: 'Scheduled maintenance on May 25, 2026 at midnight', time: '1 day ago', read: true, icon: <SystemUpdateIcon />, category: 'System' },
];

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.type === 'booking') navigate('/appointment');
    else if (notification.type === 'payment') navigate('/billing');
    else if (notification.type === 'prescription') navigate('/prescription');
    else if (notification.type === 'checkin') navigate('/checkin');
  };

  const getIconBg = (type) => {
    const map = {
      booking: 'icon-blue',
      payment: 'icon-green',
      prescription: 'icon-purple',
      checkin: 'icon-amber',
      system: 'icon-slate',
    };
    return map[type] || 'icon-blue';
  };

  return (
    <div className="notifications-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <div className="header-icon-wrap">
            <NotificationsIcon />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </div>
          <div className="header-text">
            <h1>Notifications</h1>
            <p>Stay updated with your healthcare activities</p>
          </div>
        </div>
        <div className="header-right">
          {unreadCount > 0 && (
            <button className="btn-mark-all" onClick={markAllAsRead}>
              <DoneAllIcon />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-bar">
        <div className="filter-tabs">
          <button
            className={`tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
            <span className="tab-count">{notifications.length}</span>
          </button>
          <button
            className={`tab ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread
            {unreadCount > 0 && <span className="tab-count">{unreadCount}</span>}
          </button>
        </div>
        <div className="filter-meta">
          <FilterListIcon />
          <span>{filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrap">
              <CheckCircleIcon />
            </div>
            <h3>All Caught Up</h3>
            <p>No notifications to display right now.</p>
          </div>
        ) : (
          filteredNotifications.map((notification, index) => (
            <div
              key={notification.id}
              className={`notification-card ${!notification.read ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(notification)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Icon */}
              <div className={`notif-icon ${getIconBg(notification.type)}`}>
                {notification.icon}
              </div>

              {/* Content */}
              <div className="notif-body">
                <div className="notif-top">
                  <div className="notif-title-group">
                    <h3>{notification.title}</h3>
                    <span className="notif-category">{notification.category}</span>
                  </div>
                  <span className="notif-time">{notification.time}</span>
                </div>
                <p className="notif-message">{notification.message}</p>
                <div className="notif-footer">
                  {!notification.read && (
                    <span className="new-badge">
                      <span className="new-dot"></span>
                      New
                    </span>
                  )}
                  <button
                    className="btn-dismiss"
                    onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                  >
                    <DeleteIcon />
                    <span>Dismiss</span>
                  </button>
                </div>
              </div>

              {/* Unread indicator line */}
              {!notification.read && <div className="unread-line"></div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
