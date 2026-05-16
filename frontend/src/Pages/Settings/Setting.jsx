import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    autoSave: true,
    confidenceThreshold: 70,
    language: 'en'
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleThresholdChange = (e) => {
    setSettings(prev => ({ ...prev, confidenceThreshold: parseInt(e.target.value) }));
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all detection history?')) {
      localStorage.removeItem('detectionHistory');
      alert('History cleared successfully!');
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Customize your AudioGuard experience</p>
      </div>

      <div className="settings-container">
        <div className="settings-section">
          <h2>Appearance</h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Dark Mode</h3>
              <p>Switch between light and dark theme</p>
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
          <h2>Notifications</h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Enable Notifications</h3>
              <p>Receive alerts for detection results</p>
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
        </div>

        <div className="settings-section">
          <h2>Detection Settings</h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Auto-save Results</h3>
              <p>Automatically save all detection results</p>
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
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Confidence Threshold</h3>
              <p>Minimum confidence to consider a detection valid</p>
            </div>
            <div className="threshold-control">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={settings.confidenceThreshold}
                onChange={handleThresholdChange}
              />
              <span>{settings.confidenceThreshold}%</span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Data Management</h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Clear History</h3>
              <p>Remove all saved detection history</p>
            </div>
            <button onClick={clearHistory} className="danger-btn">
              Clear All History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;