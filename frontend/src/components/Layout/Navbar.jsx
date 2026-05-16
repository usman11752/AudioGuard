import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaBell, FaUserCircle, FaMoon, FaSun, FaSearch, FaSignOutAlt, FaCog, FaCrown, FaCheckCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ sidebarOpen, setSidebarOpen, darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    setShowDropdown(false);
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  const notifications = [
    { id: 1, message: 'New detection completed', time: '5 min ago', type: 'success' },
    { id: 2, message: 'Model updated to v2.0', time: '1 hour ago', type: 'info' },
    { id: 3, message: 'System maintenance scheduled', time: '2 hours ago', type: 'warning' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
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

          <div className="user-dropdown-container">
            <button className="user-profile" onClick={() => setShowDropdown(!showDropdown)}>
              <FaUserCircle className="user-icon" />
              <span className="user-name">User Account</span>
            </button>
            
            {showDropdown && (
              <div className="user-dropdown-menu">
                <div className="dropdown-user-info">
                  <div className="dropdown-avatar-wrapper" onClick={() => navigate('/settings')}>
                    <img src="https://ui-avatars.com/api/?name=User+Account&background=0d5c5c&color=fff" alt="User" />
                    <FaCheckCircle className="verified-badge" />
                  </div>
                  <div className="dropdown-user-details">
                    <p className="dropdown-user-name">Usman Account</p>
                    <p className="dropdown-user-email">user@audioguard.ai</p>
                    <span className="plan-badge">
                      <FaCrown /> Pro Plan
                    </span>
                  </div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <div className="dropdown-usage">
                  <div className="usage-label">
                    <span>Monthly Usage</span>
                    <span>75%</span>
                  </div>
                  <div className="usage-bar">
                    <div className="usage-progress" style={{ width: '75%' }}></div>
                  </div>
                  <p className="usage-text">75/100 detections remaining</p>
                </div>

                <div className="dropdown-divider"></div>
                
                <Link to="/settings" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                  <FaUserCircle className="dropdown-item-icon" /> Profile Settings
                </Link>
                <Link to="/settings" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                  <FaCog className="dropdown-item-icon" /> System Preferences
                </Link>
                
                <div className="dropdown-divider"></div>
                
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <FaSignOutAlt className="dropdown-item-icon" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;