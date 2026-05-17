import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Initialize dark mode from localStorage appSettings
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem('appSettings');
      if (stored) {
        return JSON.parse(stored).darkMode || false;
      }
    } catch (e) {
      console.error('Failed to parse app settings', e);
    }
    return false;
  });

  // Sync dark mode state with document body and localStorage
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('settings-dark-mode');
    } else {
      document.body.classList.remove('settings-dark-mode');
    }

    try {
      const stored = localStorage.getItem('appSettings');
      const currentSettings = stored ? JSON.parse(stored) : {
        darkMode: false,
        notifications: true,
        autoSave: true,
        confidenceThreshold: 70,
        language: 'en'
      };
      currentSettings.darkMode = darkMode;
      localStorage.setItem('appSettings', JSON.stringify(currentSettings));
    } catch (e) {
      console.error('Failed to save app settings', e);
    }
  }, [darkMode]);

  // Route Protection: Check if user session exists in localStorage
  const userSession = localStorage.getItem('user');

  if (!userSession) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`layout ${darkMode ? 'dark' : ''}`}>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="layout-main">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className={`layout-content ${!sidebarOpen ? 'expanded' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;