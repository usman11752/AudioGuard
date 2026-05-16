import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaMicrophone, 
  FaHistory, 
  FaInfoCircle, 
  FaCog,
  FaShieldAlt,
  FaChartLine,
  FaDatabase
} from 'react-icons/fa';
import './sidebar.css';

const Sidebar = ({ sidebarOpen }) => {
  const menuItems = [
    { path: '/', icon: <FaTachometerAlt />, name: 'Dashboard', description: 'Overview & Stats' },
    { path: '/live', icon: <FaMicrophone />, name: 'Live Analysis', description: 'Real-time detection' },
    { path: '/history', icon: <FaHistory />, name: 'History', description: 'Past detections' },
    { path: '/about', icon: <FaInfoCircle />, name: 'About', description: 'System info' },
    { path: '/settings', icon: <FaCog />, name: 'Settings', description: 'Preferences' },
  ];

  return (
    <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-brand">
        <FaShieldAlt className="brand-icon" />
        {sidebarOpen && (
          <div className="brand-info">
            <h3>AudioGuard</h3>
            <p>v2.0.0</p>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <NavLink 
            key={index} 
            to={item.path}
            className={({ isActive }) => 
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            {sidebarOpen && (
              <div className="sidebar-text">
                <span className="item-name">{item.name}</span>
                <span className="item-desc">{item.description}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {sidebarOpen && (
        <div className="sidebar-footer">
          <div className="system-status">
            <div className="status-indicator online"></div>
            <div>
              <div className="status-label">System Status</div>
              <div className="status-value">Operational</div>
            </div>
          </div>
          <div className="storage-info">
            <FaDatabase />
            <div>
              <div>Storage Used</div>
              <progress value="45" max="100"></progress>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;