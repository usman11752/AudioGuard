import React, { useEffect, useState } from 'react';
import { FaCog, FaBell, FaMoon, FaTrash, FaCheckCircle, FaSyncAlt, FaUser, FaLock, FaCamera, FaEnvelope } from 'react-icons/fa';
import './Setting.css';

const defaultSettings = {
  darkMode: false,
  notifications: true,
  autoSave: true,
  confidenceThreshold: 70,
  language: 'en'
};

const Settings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [toast, setToast] = useState({ visible: false, message: '' });

  useEffect(() => {
    const stored = localStorage.getItem('appSettings');
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch (error) {
        console.warn('Invalid saved settings', error);
      }
    }
  }, []);

  useEffect(() => {
    if (settings.darkMode) {
      document.body.classList.add('settings-dark-mode');
    } else {
      document.body.classList.remove('settings-dark-mode');
    }
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  const handleToggle = (key) => {
    const newValue = !settings[key];
    setSettings((prev) => ({
      ...prev,
      [key]: newValue
    }));

    if (key === 'notifications') {
      showToast(`Notifications ${newValue ? 'enabled' : 'disabled'}`);
    }
    if (key === 'autoSave') {
      showToast(`Auto-save ${newValue ? 'enabled' : 'disabled'}`);
    }
    if (key === 'darkMode') {
      showToast(`${newValue ? 'Dark mode enabled' : 'Dark mode disabled'}`);
    }
  };

  const handleSliderChange = (e) => {
    setSettings((prev) => ({
      ...prev,
      confidenceThreshold: parseInt(e.target.value, 10)
    }));
  };

  const handleLanguageChange = (e) => {
    setSettings((prev) => ({
      ...prev,
      language: e.target.value
    }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    showToast('Settings saved successfully!');
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all detection history? This action cannot be undone?')) {
      localStorage.removeItem('detectionHistory');
      showToast('Detection history cleared successfully.');
    }
  };

  const handleRestoreDefaults = () => {
    setSettings(defaultSettings);
    localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
    showToast('Default settings restored.');
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <h1>
            <FaCog className="header-icon" />
            Settings
          </h1>
          <p>Control your app preferences, notifications, and detection behavior.</p>
        </div>
        <button className="restore-btn" onClick={handleRestoreDefaults}>
          <FaSyncAlt /> Restore Defaults
        </button>
      </div>

      {toast.visible && (
        <div className="save-toast">
          <FaCheckCircle /> {toast.message}
        </div>
      )}

      <div className="settings-container">
        {/* ── USER PROFILE SECTION ── */}
        <div className="settings-section">
          <div className="section-header">
            <FaUser className="section-icon" />
            <h2>User Profile</h2>
          </div>
          <div className="profile-edit-area">
            <div className="profile-pic-container">
              <div className="profile-pic-wrapper">
                <img src="https://ui-avatars.com/api/?name=User+Account&background=0d5c5c&color=fff&size=128" alt="Profile" />
                <button className="change-pic-btn" title="Change Photo">
                  <FaCamera />
                </button>
              </div>
              <div className="profile-status">
                <span className="status-badge">Verified Account</span>
              </div>
            </div>
            <div className="profile-form-grid">
              <div className="input-group">
                <label><FaUser /> Full Name</label>
                <input type="text" defaultValue="User Account" placeholder="Your name" />
              </div>
              <div className="input-group">
                <label><FaEnvelope /> Email Address</label>
                <input type="email" defaultValue="user@audioguard.ai" placeholder="Your email" disabled />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECURITY SECTION ── */}
        <div className="settings-section">
          <div className="section-header">
            <FaLock className="section-icon" />
            <h2>Account Security</h2>
          </div>
          <div className="security-form">
            <div className="input-group">
              <label>Current Password</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <div className="security-row">
              <div className="input-group">
                <label>New Password</label>
                <input type="password" placeholder="New password" />
              </div>
              <div className="input-group">
                <label>Confirm Password</label>
                <input type="password" placeholder="Confirm password" />
              </div>
            </div>
            <button className="update-pwd-btn">Update Password</button>
          </div>
        </div>
        <div className="settings-section">
          <div className="section-header">
            <FaMoon className="section-icon" />
            <h2>Display</h2>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Dark Mode</h3>
              <p>Switch the app UI to a darker theme for low-light comfort.</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={() => handleToggle('darkMode')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <FaBell className="section-icon" />
            <h2>Notifications</h2>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Enable Notifications</h3>
              <p>Receive alerts when new sounds are detected.</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={() => handleToggle('notifications')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Auto-Save Settings</h3>
              <p>Save changes automatically as soon as you update them.</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={() => handleToggle('autoSave')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <FaCog className="section-icon" />
            <h2>Detection</h2>
          </div>
          <div className="setting-item threshold-item">
            <div className="setting-info">
              <h3>Confidence Threshold</h3>
              <p>Set the minimum detection confidence needed for alerts.</p>
              <div className="threshold-value">{settings.confidenceThreshold}%</div>
            </div>
            <div className="threshold-control">
              <input
                type="range"
                min="0"
                max="100"
                value={settings.confidenceThreshold}
                onChange={handleSliderChange}
                className="threshold-slider"
              />
              <div className="threshold-labels">
                <span>Low</span>
                <span>Balanced</span>
                <span>High</span>
              </div>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>App Language</h3>
              <p>Choose the language used in the app interface.</p>
            </div>
            <select
              value={settings.language}
              onChange={handleLanguageChange}
              className="language-select"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
        </div>

        <div className="settings-section danger-section">
          <div className="section-header">
            <FaTrash className="section-icon" />
            <h2>Danger Zone</h2>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Clear Detection History</h3>
              <p className="warning-text">This deletes all stored detection events permanently.</p>
            </div>
            <button className="danger-btn" onClick={handleClearData}>
              <FaTrash /> Clear Data
            </button>
          </div>
        </div>

        <div className="settings-actions">
          <button className="save-btn" onClick={handleSaveSettings}>
            <FaCheckCircle /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
