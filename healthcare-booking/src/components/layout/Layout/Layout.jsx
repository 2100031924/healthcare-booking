import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import ChatAssistant from '../../features/ChatAssistant/ChatAssistant';
import './Layout.scss';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    setPageLoading(true);
    const timer = setTimeout(() => setPageLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className={`app-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-overlay" onClick={closeSidebar}></div>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="main-wrapper">
        <Header onMenuClick={toggleSidebar} />
        <main className={`main-content ${pageLoading ? 'loading' : ''}`}>
          <div className="page-transition">
            <Outlet />
          </div>
        </main>
      </div>
      <ChatAssistant />
    </div>
  );
}
