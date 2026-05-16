import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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