import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaMicrophone, FaRobot, FaShieldAlt, FaChartLine, FaArrowUp, FaClock, FaFileUpload } from 'react-icons/fa';
import Button from '../../components/UI/Button';
import AudioUploader from '../../AudioUploader';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDetections: 0,
    realVoices: 0,
    fakeVoices: 0,
    accuracy: 0,
    avgConfidence: 0
  });
  
  const [recentDetections, setRecentDetections] = useState([]);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    loadStats();
    loadRecentDetections();
    loadTrendData();

    // Listen for storage changes from other components (like AudioUploader)
    const handleStorageChange = () => {
      loadStats();
      loadRecentDetections();
      loadTrendData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadStats = () => {
    const history = JSON.parse(localStorage.getItem('detectionHistory') || '[]');
    const total = history.length;
    const real = history.filter(h => !h.is_fake).length;
    const fake = history.filter(h => h.is_fake).length;
    const avgConfidence = history.reduce((sum, h) => sum + h.confidence, 0) / total || 0;
    
    setStats({
      totalDetections: total,
      realVoices: real,
      fakeVoices: fake,
      accuracy: total > 0 ? (real / total * 100).toFixed(1) : 0,
      avgConfidence: (avgConfidence * 100).toFixed(1)
    });
  };

  const loadRecentDetections = () => {
    const history = JSON.parse(localStorage.getItem('detectionHistory') || '[]');
    setRecentDetections(history.slice(0, 5));
  };

  const loadTrendData = () => {
    const history = JSON.parse(localStorage.getItem('detectionHistory') || '[]');
    const last7Days = history.slice(0, 7).reverse().map((item, index) => ({
      day: `Day ${index + 1}`,
      confidence: parseFloat((item.confidence * 100).toFixed(1)),
      type: item.is_fake ? 'Fake' : 'Real'
    }));
    setTrendData(last7Days);
  };

  const pieData = [
    { name: 'Real Voices', value: stats.realVoices, color: '#10b981' },
    { name: 'Fake Voices', value: stats.fakeVoices, color: '#ef4444' }
  ];

  const getConfidenceColor = (confidence) => {
    if (confidence >= 70) return '#10b981';
    if (confidence >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your audio detection overview</p>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Quick Analysis Section */}
        <div className="quick-analysis-section">
          <div className="section-header">
            <h3>
              <FaFileUpload className="section-icon" />
              Quick Analysis - Upload Audio
            </h3>
            <p>Upload any audio file to instantly detect deepfakes</p>
          </div>
          <AudioUploader />
        </div>

        {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">
            <FaShieldAlt />
          </div>
          <div className="stat-content">
            <h3>Total Detections</h3>
            <div className="stat-value">{stats.totalDetections}</div>

          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <FaShieldAlt />
          </div>
          <div className="stat-content">
            <h3>Real Voices</h3>
            <div className="stat-value">{stats.realVoices}</div>

          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <FaRobot />
          </div>
          <div className="stat-content">
            <h3>Fake Voices</h3>
            <div className="stat-value">{stats.fakeVoices}</div>

          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>Avg Confidence</h3>
            <div className="stat-value">{stats.avgConfidence}%</div>

          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-card">
          <h3>Real vs Fake Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Confidence Trend (Last 7 Detections)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="confidence" 
                stroke="#667eea" 
                strokeWidth={2}
                dot={{ fill: '#667eea', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Detections Table */}
      <div className="recent-detections">
        <div className="section-header">
          <h3>
            <FaClock className="section-icon" />
            Recent Detections
          </h3>
        </div>
        
        {recentDetections.length === 0 ? (
          <div className="empty-state">
            <p>No detections yet. Start analyzing audio to see results here.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="detections-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Filename</th>
                  <th>Result</th>
                  <th>Confidence</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentDetections.map((detection) => (
                  <tr key={detection.id}>
                    <td>{detection.timestamp}</td>
                    <td>{detection.filename}</td>
                    <td>
                      <span className={`badge ${detection.is_fake ? 'badge-fake' : 'badge-real'}`}>
                        {detection.is_fake ? 'Fake' : 'Real'}
                      </span>
                    </td>
                    <td>
                      <div className="confidence-cell">
                        <div className="confidence-bar-mini">
                          <div 
                            className="confidence-fill-mini"
                            style={{ 
                              width: `${detection.confidence * 100}%`,
                              backgroundColor: getConfidenceColor(detection.confidence * 100)
                            }}
                          />
                        </div>
                        <span>{(detection.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-dot ${detection.is_fake ? 'status-warning' : 'status-success'}`}>
                        {detection.is_fake ? '⚠️ Suspicious' : '✓ Verified'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default Dashboard;