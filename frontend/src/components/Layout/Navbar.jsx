import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaBell, FaUserCircle, FaMoon, FaSun, FaSearch } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ sidebarOpen, setSidebarOpen, darkMode, setDarkMode }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, message: 'New detection completed', time: '5 min ago', type: 'success' },
    { id: 2, message: 'Model updated to v2.0', time: '1 hour ago', type: 'info' },
    { id: 3, message: 'System maintenance scheduled', time: '2 hours ago', type: 'warning' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars />
          </button>
          <Link to="/" className="logo">
            <div className="logo-icon">🎙️</div>
            <div className="logo-text">
              <span className="logo-main">AudioGuard</span>
            </div>
          </Link>
        </div>

        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search detections..." />
        </div>

        <div className="navbar-right">
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          
          <div className="notifications">
            <button className="notification-btn" onClick={() => setShowNotifications(!showNotifications)}>
              <FaBell />
              <span className="notification-badge">3</span>
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>
                  <button>Mark all as read</button>
                </div>
                {notifications.map(notif => (
                  <div key={notif.id} className={`notification-item ${notif.type}`}>
                    <p>{notif.message}</p>
                    <span>{notif.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="auth-links">
            <Link to="/login" className="login-link">Login</Link>
            <Link to="/signup" className="signup-btn">Sign Up</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;