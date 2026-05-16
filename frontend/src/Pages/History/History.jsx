import React, { useState, useEffect } from 'react';
import { FaTrash, FaDownload, FaChartLine, FaSearch, FaFilter, FaEye } from 'react-icons/fa';
import './History.css';

const History = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [filter, setFilter] = useState('all'); // all, real, fake
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterAndSortHistory();
  }, [history, filter, sortBy, searchTerm]);

  const loadHistory = () => {
    const savedHistory = localStorage.getItem('detectionHistory');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setHistory(parsed);
      setFilteredHistory(parsed);
    }
  };

  const filterAndSortHistory = () => {
    let filtered = [...history];

    // Apply filter
    if (filter === 'real') {
      filtered = filtered.filter(item => !item.is_fake);
    } else if (filter === 'fake') {
      filtered = filtered.filter(item => item.is_fake);
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.timestamp.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => b.id - a.id);
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => a.id - b.id);
    } else if (sortBy === 'confidence') {
      filtered.sort((a, b) => b.confidence - a.confidence);
    }

    setFilteredHistory(filtered);
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('detectionHistory');
      setHistory([]);
      setFilteredHistory([]);
    }
  };

  const deleteItem = (id) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('detectionHistory', JSON.stringify(updatedHistory));
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `audioguard_history_${new Date().toISOString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getStats = () => {
    const total = history.length;
    const real = history.filter(h => !h.is_fake).length;
    const fake = history.filter(h => h.is_fake).length;
    const avgConfidence = history.reduce((sum, h) => sum + h.confidence, 0) / total || 0;
    
    return { total, real, fake, avgConfidence };
  };

  const stats = getStats();

  return (
    <div className="history-page">
      <div className="page-header">
        <div>
          <h1>Detection History</h1>
          <p>View and manage all your audio deepfake detection results</p>
        </div>
        <div className="header-actions">
          <button onClick={exportHistory} className="btn-export">
            <FaDownload /> Export
          </button>
          <button onClick={clearHistory} className="btn-clear">
            <FaTrash /> Clear All
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="history-stats">
        <div className="stat-box">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Detections</div>
        </div>
        <div className="stat-box real">
          <div className="stat-value">{stats.real}</div>
          <div className="stat-label">Real Voices</div>
        </div>
        <div className="stat-box fake">
          <div className="stat-value">{stats.fake}</div>
          <div className="stat-label">Fake Voices</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{(stats.avgConfidence * 100).toFixed(1)}%</div>
          <div className="stat-label">Avg Confidence</div>
        </div>
      </div>

      {/* Filters */}
      <div className="history-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by filename or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <FaFilter className="filter-icon" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Results</option>
            <option value="real">Real Only</option>
            <option value="fake">Fake Only</option>
          </select>
        </div>

        <div className="filter-group">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="confidence">Highest Confidence</option>
          </select>
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="empty-history">
          <FaChartLine className="empty-icon" />
          <h3>No Detection History</h3>
          <p>Upload audio files or use live recording to see results here</p>
        </div>
      ) : (
        <div className="history-list">
          {filteredHistory.map((item) => (
            <div key={item.id} className={`history-item ${item.is_fake ? 'fake' : 'real'}`}>
              <div className="item-header">
                <div className="item-icon">
                  {item.is_fake ? '🤖' : '👤'}
                </div>
                <div className="item-info">
                  <div className="item-title">
                    {item.is_fake ? 'Fake Voice Detected' : 'Real Voice Confirmed'}
                  </div>
                  <div className="item-meta">
                    <span className="timestamp">{item.timestamp}</span>
                    <span className="filename">{item.filename}</span>
                  </div>
                </div>
                <div className="item-actions">
                  <div className="confidence-badge">
                    {(item.confidence * 100).toFixed(0)}%
                  </div>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="delete-btn"
                    title="Delete"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="item-details">
                <div className="detail-row">
                  <span className="detail-label">Confidence Score:</span>
                  <div className="confidence-bar-container">
                    <div className="confidence-bar">
                      <div 
                        className="confidence-fill"
                        style={{ 
                          width: `${item.confidence * 100}%`,
                          backgroundColor: item.is_fake ? '#ef4444' : '#10b981'
                        }}
                      />
                    </div>
                    <span className="detail-value">{(item.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Analysis Type:</span>
                  <span className="detail-value">
                    {item.type === 'live' ? '🎙️ Live Recording' : '📁 File Upload'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Result:</span>
                  <span className={`result-badge ${item.is_fake ? 'fake' : 'real'}`}>
                    {item.is_fake ? 'Suspicious - Fake Voice' : 'Authentic - Real Voice'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;