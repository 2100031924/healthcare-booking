import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SystemUpdateIcon from '@mui/icons-material/SystemUpdate';
import './NotificationsPage.scss';

const initialNotifications = [
  { id: 1, type: 'booking', title: 'New Appointment Booked', message: 'John Doe booked an appointment with Dr. Venkat Reddy', time: '2 mins ago', read: false, icon: <EventAvailableIcon /> },
  { id: 2, type: 'payment', title: 'Payment Received', message: 'Payment of ₹1,050 received from Jane Smith', time: '1 hour ago', read: false, icon: <ReceiptIcon /> },
  { id: 3, type: 'prescription', title: 'Prescription Generated', message: 'Dr. Priya Patel generated a new prescription', time: '3 hours ago', read: false, icon: <DescriptionIcon /> },
  { id: 4, type: 'checkin', title: 'Patient Checked In', message: 'Rahul Sharma checked in for appointment APT-2026-001', time: '5 hours ago', read: true, icon: <PersonAddIcon /> },
  { id: 5, type: 'system', title: 'System Update', message: 'Scheduled maintenance on May 25, 2026 at midnight', time: '1 day ago', read: true, icon: <SystemUpdateIcon /> },
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

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon-wrapper">
            <NotificationsIcon />
            {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
          </div>
          <div>
            <h1>Notifications</h1>
            <p>Stay updated with your healthcare activities</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            Mark All Read
          </button>
        </div>
      </div>

      <div className="filter-tabs">
        <button className={`tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          All ({notifications.length})
        </button>
        <button className={`tab ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
          Unread ({unreadCount})
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <NotificationsIcon className="empty-icon" />
            <h3>No Notifications</h3>
            <p>You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-card ${!notification.read ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-icon">
                {notification.icon}
              </div>
              <div className="notification-content">
                <div className="notification-header">
                  <h3>{notification.title}</h3>
                  <span className="notification-time">{notification.time}</span>
                </div>
                <p>{notification.message}</p>
                <div className="notification-actions">
                  {!notification.read && <span className="unread-dot">New</span>}
                  <button
                    className="delete-btn"
                    onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
