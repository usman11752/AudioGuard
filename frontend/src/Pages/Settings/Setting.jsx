import React, { useEffect, useState } from 'react';
import { FaCog, FaMoon, FaTrash, FaCheckCircle, FaSyncAlt, FaUser, FaLock, FaCamera, FaEnvelope, FaExclamationTriangle } from 'react-icons/fa';
import './Setting.css';

const defaultSettings = {
  darkMode: false,
  language: 'en'
};

const Settings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  
  // Profile editable states
  const [profileName, setProfileName] = useState('User Account');
  const [profileEmail, setProfileEmail] = useState('user@audioguard.ai');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Password fields state
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });

  useEffect(() => {
    // Load general preferences
    const stored = localStorage.getItem('appSettings');
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch (error) {
        console.warn('Invalid saved settings', error);
      }
    }

    // Load active user details dynamically
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setProfileName(parsed.name || 'User Account');
        setProfileEmail(parsed.email || 'user@audioguard.ai');
        setAvatarUrl(`https://ui-avatars.com/api/?name=${encodeURIComponent(parsed.name || 'User Account')}&background=0d5c5c&color=fff&size=128`);
      } catch (e) {
        console.error('Failed to parse user session', e);
      }
    } else {
      setAvatarUrl('https://ui-avatars.com/api/?name=User+Account&background=0d5c5c&color=fff&size=128');
    }
  }, []);

  useEffect(() => {
    if (settings.darkMode) {
      document.body.classList.add('settings-dark-mode');
    } else {
      document.body.classList.remove('settings-dark-mode');
    }
    localStorage.setItem('appSettings', JSON.stringify(settings));
    // Dispatch storage event to sync with other headers/layouts
    window.dispatchEvent(new Event('storage'));
  }, [settings]);

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3000);
  };

  const handleToggle = (key) => {
    const newValue = !settings[key];
    setSettings((prev) => ({
      ...prev,
      [key]: newValue
    }));

    if (key === 'darkMode') {
      showToast(`${newValue ? 'Dark mode enabled' : 'Dark mode disabled'}`);
    }
  };

  const handleLanguageChange = (e) => {
    setSettings((prev) => ({
      ...prev,
      language: e.target.value
    }));
    showToast(`Language changed to ${e.target.value.toUpperCase()}`);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileName.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const updated = { ...parsed, name: profileName };
        localStorage.setItem('user', JSON.stringify(updated));
        setAvatarUrl(`https://ui-avatars.com/api/?name=${encodeURIComponent(profileName)}&background=0d5c5c&color=fff&size=128`);
        window.dispatchEvent(new Event('storage'));
        showToast('Profile updated successfully!');
      } catch (error) {
        showToast('Failed to update profile details', 'error');
      }
    } else {
      localStorage.setItem('user', JSON.stringify({ name: profileName, email: profileEmail }));
      window.dispatchEvent(new Event('storage'));
      showToast('Profile updated successfully!');
    }
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      showToast('Please fill out all password fields', 'error');
      return;
    }

    if (passwords.newPass !== passwords.confirm) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (passwords.newPass.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    setPasswords({ current: '', newPass: '', confirm: '' });
    showToast('Password updated successfully!');
  };

  const handleSaveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    showToast('All preferences saved successfully!');
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all detection history? This action cannot be undone.')) {
      localStorage.removeItem('detectionHistory');
      window.dispatchEvent(new Event('storage'));
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
          <h1><FaCog className="header-icon" /> Settings</h1>
          <p>Control your app preferences, notifications, and detection behavior.</p>
        </div>
        <button className="restore-btn" onClick={handleRestoreDefaults}>
          <FaSyncAlt /> Restore Defaults
        </button>
      </div>

      {toast.visible && (
        <div className={`save-toast ${toast.type === 'error' ? 'toast-error' : ''}`}>
          {toast.type === 'error' ? <FaExclamationTriangle /> : <FaCheckCircle />} 
          {toast.message}
        </div>
      )}

      <div className="settings-container">
        {/* ── USER PROFILE SECTION ── */}
        <div className="settings-section">
          <div className="section-header">
            <FaUser className="section-icon" />
            <h2>User Profile</h2>
          </div>
          <form onSubmit={handleSaveProfile} className="profile-edit-area">
            <div className="profile-pic-container">
              <div className="profile-pic-wrapper">
                <img src={avatarUrl} alt="Profile" />
                <button type="button" className="change-pic-btn" title="Change Photo" onClick={() => showToast('Avatar upload available in upcoming cloud version!')}>
                  <FaCamera />
                </button>
              </div>
              <div className="profile-status">
                <span className="status-badge">Verified Account</span>
              </div>
            </div>
            <div className="profile-form-grid">
              <div className="input-group">
                <label><FaUser className="input-label-icon" /> Full Name</label>
                <input 
                  type="text" 
                  value={profileName} 
                  onChange={(e) => setProfileName(e.target.value)} 
                  placeholder="Your name" 
                  required
                />
              </div>
              <div className="input-group">
                <label><FaEnvelope className="input-label-icon" /> Email Address</label>
                <input 
                  type="email" 
                  value={profileEmail} 
                  disabled 
                  title="Email cannot be changed" 
                />
              </div>
              <div className="profile-submit-row">
                <button type="submit" className="save-profile-btn">Update Profile Info</button>
              </div>
            </div>
          </form>
        </div>

        {/* ── SECURITY SECTION ── */}
        <div className="settings-section">
          <div className="section-header">
            <FaLock className="section-icon" />
            <h2>Account Security</h2>
          </div>
          <form onSubmit={handlePasswordUpdate} className="security-form">
            <div className="input-group">
              <label>Current Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                required
              />
            </div>
            <div className="security-row">
              <div className="input-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  placeholder="New password" 
                  value={passwords.newPass}
                  onChange={(e) => setPasswords({...passwords, newPass: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>Confirm Password</label>
                <input 
                  type="password" 
                  placeholder="Confirm password" 
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  required
                />
              </div>
            </div>
            <button type="submit" className="update-pwd-btn">Update Password</button>
          </form>
        </div>

        {/* ── DISPLAY SECTION ── */}
        <div className="settings-section">
          <div className="section-header">
            <FaMoon className="section-icon" />
            <h2>Display Preferences</h2>
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

        {/* ── DANGER ZONE SECTION ── */}
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