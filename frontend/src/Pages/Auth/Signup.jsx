import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserShield, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import './Auth.css';
import { API_URL } from '../../config';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const checkPasswordStrength = (pass) => {
    if (!pass) {
      setPasswordStrength({ score: 0, label: '', color: '' });
      return;
    }
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    let label = 'Weak';
    let color = '#ef4444';
    if (score === 3) {
      label = 'Medium';
      color = '#f59e0b';
    } else if (score === 4) {
      label = 'Strong';
      color = '#10b981';
    }
    setPasswordStrength({ score, label, color });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError('');
    
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const generateStrongPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let generated = '';
    for (let i = 0; i < 14; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({
      ...prev,
      password: generated,
      confirmPassword: generated
    }));
    checkPasswordStrength(generated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Strict Gmail check
    if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
      setError('Only @gmail.com email addresses are allowed.');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    if (!agreeTerms) {
      setError("You must agree to the Terms of Service & Privacy Policy");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        navigate('/login', { state: { message: 'Registration successful! Please login.' } });
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.error || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isEmailValidGmail = formData.email.toLowerCase().endsWith('@gmail.com');

  return (
    <div className="auth-split-container">
      {/* Left Pane: Signup Form */}
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

          <div className="auth-intro">
            <h2>Create Account</h2>
            <p>Welcome, Please enter your details to create your secure audio analysis account.</p>
          </div>

          {/* Tab Switcher */}
          <div className="auth-pill-tabs">
            <button className="auth-pill-tab" onClick={() => navigate('/login')}>Sign In</button>
            <button className="auth-pill-tab active">Signup</button>
          </div>

          {error && <div className="auth-alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="split-auth-form">
            <div className="split-form-group">
              <div className="input-with-icon">
                <FaUser className="input-field-icon" />
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="split-form-group">
              <div className="input-with-icon">
                <FaEnvelope className="input-field-icon" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {isEmailValidGmail && (
                  <FaCheckCircle className="input-validation-success" />
                )}
              </div>
            </div>

            <div className="split-form-group">
              <div className="label-row-split">
                <button type="button" className="suggest-pwd-link-split" onClick={generateStrongPassword}>
                  Suggest strong password
                </button>
              </div>
              <div className="input-with-icon">
                <FaLock className="input-field-icon" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
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
              {formData.password && (
                <div className="strength-meter-container">
                  <div className="strength-bar-track">
                    <div 
                      className="strength-bar-fill" 
                      style={{ 
                        width: `${(passwordStrength.score / 4) * 100}%`, 
                        backgroundColor: passwordStrength.color 
                      }}
                    ></div>
                  </div>
                  <span className="strength-label" style={{ color: passwordStrength.color }}>
                    Strength: {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="split-form-group">
              <div className="input-with-icon">
                <FaLock className="input-field-icon" />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button" 
                  className="split-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="split-terms-group">
              <label className="checkbox-label-split">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                />
                <span className="terms-text-split">
                  I agree to the <a href="#terms" className="teal-accent">Terms of Service</a> and <a href="#privacy" className="teal-accent">Privacy Policy</a>
                </span>
              </label>
            </div>

            <button type="submit" className="split-submit-btn" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Continue'}
            </button>
          </form>

          <div className="split-auth-footer">
            <p>Already have an account? <Link to="/login" className="teal-accent">Sign In</Link></p>
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
                e.target.style.display = 'none';
                document.getElementById('fallback-svg').style.display = 'block';
              }}
            />
            
            <svg id="fallback-svg" style={{ display: 'none', width: '100%', maxHeight: '350px' }} viewBox="0 0 200 200">
              <defs>
                <radialGradient id="neonGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="100" cy="90" r="60" fill="url(#neonGlow)" />
              <rect x="96" y="120" width="8" height="40" rx="4" fill="#0f766e" />
              <rect x="75" y="160" width="50" height="8" rx="4" fill="#0d5c5c" />
              <rect x="80" y="50" width="40" height="70" rx="20" fill="#115e59" stroke="#14b8a6" strokeWidth="3" />
              <line x1="80" y1="75" x2="120" y2="75" stroke="#14b8a6" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="80" y1="95" x2="120" y2="95" stroke="#14b8a6" strokeWidth="1" strokeDasharray="2,2" />
              <line x1="100" y1="50" x2="100" y2="120" stroke="#14b8a6" strokeWidth="1" strokeDasharray="2,2" />
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

export default Signup;
