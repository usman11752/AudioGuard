import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUserShield, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import './Auth.css';
import { API_URL } from '../../config';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Forgot password states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Strict Gmail validation
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setError('Only @gmail.com email addresses are allowed.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });

      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        window.dispatchEvent(new Event('storage'));
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Strict Gmail validation
    if (!resetEmail.toLowerCase().endsWith('@gmail.com')) {
      setError('Only @gmail.com email addresses are allowed.');
      setIsLoading(false);
      return;
    }

    try {
      // Mock forgot password flow
      setTimeout(() => {
        setResetSuccess(true);
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
      setIsLoading(false);
    }
  };

  const isEmailValidGmail = email.toLowerCase().endsWith('@gmail.com');

  return (
    <div className="auth-split-container">
      {/* Left Pane: Form Container */}
      <div className="auth-left-pane">
        <div className="auth-form-wrapper">
          {/* Logo & Header */}
          <div className="brand-logo-header">
            <FaUserShield className="brand-icon" />
            <div className="brand-text">
              <span className="brand-title">AudioGuard</span>
              <span className="brand-version">v2.0.0</span>
            </div>
          </div>

          {!isForgotPassword ? (
            <>
              <div className="auth-intro">
                <h2>Welcome Back</h2>
                <p>Welcome Back, Please enter your details to access your secure audio analysis dashboard.</p>
              </div>

              {/* Sign In / Signup Tab Switcher */}
              <div className="auth-pill-tabs">
                <button className="auth-pill-tab active">Sign In</button>
                <button className="auth-pill-tab" onClick={() => navigate('/signup')}>Signup</button>
              </div>

              {successMessage && <div className="auth-alert-success">{successMessage}</div>}
              {error && <div className="auth-alert-error">{error}</div>}

              <form onSubmit={handleLoginSubmit} className="split-auth-form">
                <div className="split-form-group">
                  <div className="input-with-icon">
                    <FaEnvelope className="input-field-icon" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      required
                    />
                    {isEmailValidGmail && (
                      <FaCheckCircle className="input-validation-success" />
                    )}
                  </div>
                </div>

                <div className="split-form-group">
                  <div className="input-with-icon">
                    <FaLock className="input-field-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError('');
                      }}
                      required
                    />
                    <button 
                      type="button" 
                      className="split-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="forgot-password-row">
                  <button 
                    type="button" 
                    className="forgot-password-link"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setError('');
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>

                <button type="submit" className="split-submit-btn" disabled={isLoading}>
                  {isLoading ? 'Processing...' : 'Continue'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="auth-intro">
                <h2>Reset Password</h2>
                <p>Enter your secure @gmail.com email address below to receive password recovery instructions.</p>
              </div>

              {error && <div className="auth-alert-error">{error}</div>}

              {!resetSuccess ? (
                <form onSubmit={handleForgotPasswordSubmit} className="split-auth-form">
                  <div className="split-form-group">
                    <div className="input-with-icon">
                      <FaEnvelope className="input-field-icon" />
                      <input
                        type="email"
                        placeholder="gmail_username@gmail.com"
                        value={resetEmail}
                        onChange={(e) => {
                          setResetEmail(e.target.value);
                          if (error) setError('');
                        }}
                        required
                      />
                      {resetEmail.toLowerCase().endsWith('@gmail.com') && (
                        <FaCheckCircle className="input-validation-success" />
                      )}
                    </div>
                  </div>

                  <button type="submit" className="split-submit-btn" disabled={isLoading}>
                    {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                  </button>
                </form>
              ) : (
                <div className="reset-success-card">
                  <FaCheckCircle className="success-icon-large" />
                  <h3>Recovery Email Sent!</h3>
                  <p>We've successfully sent a secure password reset link to <strong>{resetEmail}</strong>. Please check your inbox.</p>
                </div>
              )}

              <button 
                type="button" 
                className="back-to-login-btn"
                onClick={() => {
                  setIsForgotPassword(false);
                  setResetSuccess(false);
                  setError('');
                }}
              >
                <FaArrowLeft /> Back to Sign In
              </button>
            </>
          )}

          <div className="split-auth-footer">
            <p>Don't have an account? <Link to="/signup" className="teal-accent">Sign Up</Link></p>
          </div>
        </div>
      </div>

      {/* Right Pane: Illustration Pane */}
      <div className="auth-right-pane">
        <div className="illustrations-wrapper">
          <h2 className="engine-title">Deepfake Analysis Engine</h2>
          
          <div className="microphone-3d-scene">
            <img 
              src="/auth_microphone.png" 
              alt="Deepfake Analysis Engine illustration" 
              className="microphone-3d-asset"
              onError={(e) => {
                // Fallback to pure gorgeous SVG if image has any trouble loading
                e.target.style.display = 'none';
                document.getElementById('fallback-svg').style.display = 'block';
              }}
            />
            
            {/* High-Fidelity SVG Fallback built directly inside */}
            <svg id="fallback-svg" style={{ display: 'none', width: '100%', maxHeight: '350px' }} viewBox="0 0 200 200">
              <defs>
                <radialGradient id="neonGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="100" cy="90" r="60" fill="url(#neonGlow)" />
              {/* Mic Stand */}
              <rect x="96" y="120" width="8" height="40" rx="4" fill="#0f766e" />
              <rect x="75" y="160" width="50" height="8" rx="4" fill="#0d5c5c" />
              {/* Mic Grid */}
              <rect x="80" y="50" width="40" height="70" rx="20" fill="#115e59" stroke="#14b8a6" strokeWidth="3" />
              <line x1="80" y1="75" x2="120" y2="75" stroke="#14b8a6" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="80" y1="95" x2="120" y2="95" stroke="#14b8a6" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="100" y1="50" x2="100" y2="120" stroke="#14b8a6" strokeWidth="1" strokeDasharray="2,2" />
              {/* Shield */}
              <path d="M 100 25 L 140 45 L 140 85 C 140 120 100 145 100 145 C 100 145 60 120 60 85 L 60 45 Z" fill="rgba(20, 184, 166, 0.15)" stroke="#14b8a6" strokeWidth="4" filter="drop-shadow(0 0 10px rgba(20, 184, 166, 0.6))" />
              <circle cx="100" cy="85" r="15" fill="#115e59" />
              <path d="M 95 80 L 105 80 L 105 90 L 95 90 Z" fill="#14b8a6" />
            </svg>
          </div>

          <div className="illustration-card-floating">
            <div className="card-floating-badge">Live Voice Analysis</div>
            <p className="card-floating-desc">Real-time deepfake detection using your microphone</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
