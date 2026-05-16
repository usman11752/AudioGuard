import React from 'react';
import { FaShieldAlt, FaMicrophone, FaRobot, FaChartLine } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="page-header">
        <h1>About</h1>
        <p>Advanced AI-Powered Audio Deepfake Detection System</p>
      </div>

      <div className="about-content">
        <div className="about-section">
          <h2>What is AudioGuard?</h2>
          <p>
            AudioGuard Pro is a state-of-the-art deepfake audio detection system that uses 
            advanced machine learning algorithms to identify AI-generated voices and manipulated audio.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <FaShieldAlt className="feature-icon" />
            <h3>Real-time Detection</h3>
            <p>Analyze audio in real-time with high accuracy</p>
          </div>
          <div className="feature-card">
            <FaMicrophone className="feature-icon" />
            <h3>Live Recording</h3>
            <p>Record and analyze voices instantly</p>
          </div>
          <div className="feature-card">
            <FaRobot className="feature-icon" />
            <h3>AI-Powered</h3>
            <p>Powered by advanced deep learning models</p>
          </div>
          <div className="feature-card">
            <FaChartLine className="feature-icon" />
            <h3>Detailed Analytics</h3>
            <p>Comprehensive reports and statistics</p>
          </div>
        </div>

        <div className="tech-section">
          <h2>Technology Stack</h2>
          <div className="tech-badges">
            <span className="tech-badge">React 18</span>
            <span className="tech-badge">Python Flask</span>
            <span className="tech-badge">PyTorch</span>
            <span className="tech-badge">Librosa</span>
            <span className="tech-badge">Recharts</span>
            <span className="tech-badge">REST API</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;