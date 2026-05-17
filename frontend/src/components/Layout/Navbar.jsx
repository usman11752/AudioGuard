import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaUserCircle, FaMoon, FaSun, FaSearch, FaSignOutAlt, FaCog, FaCrown, FaCheckCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ sidebarOpen, setSidebarOpen, darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  // Load user details dynamically from localStorage
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState('Free Plan');
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    const loadUserData = () => {
      // User name and email
      const userString = localStorage.getItem('user');
      if (userString) {
        try {
          setUser(JSON.parse(userString));
        } catch (e) {
          console.error('Failed to parse user session', e);
        }
      }

      // User plan
      const storedPlan = localStorage.getItem('userPlan') || 'Free Plan';
      setPlan(storedPlan);

      // Detections count from history
      const historyString = localStorage.getItem('detectionHistory');
      if (historyString) {
        try {
          setHistoryCount(JSON.parse(historyString).length);
        } catch (e) {
          console.error('Failed to parse detection history', e);
        }
      }
    };

    loadUserData();

    // Listen to changes in localStorage
    window.addEventListener('storage', loadUserData);
    return () => window.removeEventListener('storage', loadUserData);
  }, []);

  // Sync click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowDropdown(false);
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  const handleTogglePlan = () => {
    const nextPlan = plan === 'Free Plan' ? 'Pro Plan' : 'Free Plan';
    setPlan(nextPlan);
    localStorage.setItem('userPlan', nextPlan);
    alert(`Plan updated! You are now using the ${nextPlan}.`);
    // Dispatch event so other components refresh if needed
    window.dispatchEvent(new Event('storage'));
  };

  // Dynamic Detections & Usage computations
  const limit = plan === 'Pro Plan' ? 250 : 75;
  const remaining = Math.max(0, limit - historyCount);
  const usagePercentage = Math.min(100, Math.round((historyCount / limit) * 100));

  const userName = user?.name || 'Usman Account';
  const userEmail = user?.email || 'user@audioguard.ai';

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
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} title="Toggle Dark/Light Mode">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>


          <div className="user-dropdown-container" ref={dropdownRef}>
            <button className="user-profile" onClick={() => setShowDropdown(!showDropdown)}>
              <FaUserCircle className="user-icon" />
              <span className="user-name">{userName}</span>
            </button>
            
            {showDropdown && (
              <div className="user-dropdown-menu">
                <div className="dropdown-user-info">
                  <div className="dropdown-avatar-wrapper" onClick={() => navigate('/settings')}>
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0d5c5c&color=fff`} 
                      alt="User" 
                    />
                    <FaCheckCircle className="verified-badge" />
                  </div>
                  <div className="dropdown-user-details">
                    <p className="dropdown-user-name">{userName}</p>
                    <p className="dropdown-user-email">{userEmail}</p>
                    <span 
                      className={`plan-badge ${plan === 'Pro Plan' ? 'pro-gold' : ''}`}
                      onClick={handleTogglePlan}
                      style={{ cursor: 'pointer' }}
                      title="Click to switch plan"
                    >
                      <FaCrown /> {plan}
                    </span>
                  </div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <div className="dropdown-usage">
                  <div className="usage-label">
                    <span>Monthly Usage</span>
                    <span>{usagePercentage}%</span>
                  </div>
                  <div className="usage-bar">
                    <div 
                      className="usage-progress" 
                      style={{ 
                        width: `${usagePercentage}%`,
                        background: plan === 'Pro Plan' ? 'var(--secondary)' : 'var(--primary)'
                      }}
                    ></div>
                  </div>
                  <p className="usage-text">{remaining}/{limit} detections remaining</p>
                  
                  {plan === 'Free Plan' && (
                    <button className="upgrade-action-btn" onClick={handleTogglePlan}>
                      🚀 Upgrade to Pro Plan
                    </button>
                  )}
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