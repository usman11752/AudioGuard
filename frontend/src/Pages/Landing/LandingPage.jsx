import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserShield, FaCheckCircle, FaLock, FaMicrophone, FaChartBar, FaShieldAlt } from 'react-icons/fa';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page">
      {/* ─── NAVBAR (Exactly like the User's Mockup) ─── */}
      <nav className="landing-nav">
        <div className="landing-nav-container">
          <Link to="/" className="landing-nav-logo">
            <FaUserShield className="nav-logo-icon-svg" />
            <div className="nav-brand">
              <span className="nav-brand-name">AudioGuard</span>
              <span className="nav-brand-sub">AI DEEPFAKE DETECTION</span>
            </div>
          </Link>

          <div className="landing-nav-center">
            <button onClick={() => handleScroll('features')} className="nav-link-text">Features</button>
            <button onClick={() => handleScroll('how-it-works')} className="nav-link-text">How It Works</button>
            <button onClick={() => handleScroll('about')} className="nav-link-text">About</button>
          </div>

          <div className="landing-nav-right">
            <Link to="/login" className="nav-signin-link">Sign In</Link>
            <Link to="/signup" className="nav-getstarted-btn">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION (Split-Screen Laptop Layout) ─── */}
      <header className="hero-container">
        <div className="hero-split-grid">
          {/* Left Column: Headline & CTA */}
          <div className="hero-text-content">
            <div className="hero-badge-pill">
              <span className="badge-dot" />
              AI-Powered Deepfake Voice Shield
            </div>
            <h1 className="hero-main-title">
              Protecting Every <br />
              <span className="gradient-highlight">Voice</span>
            </h1>
            <p className="hero-subtext">
              Empowering security, shielding authenticity. AudioGuard is committed
              to providing world-class deepfake detection with modern AI facilities
              and expert algorithms. Verify speech signals in seconds.
            </p>
            <div className="hero-cta-row">
              <Link to="/signup" className="hero-primary-cta">Get Started Free →</Link>
              <button onClick={() => handleScroll('how-it-works')} className="hero-secondary-cta">How It Works</button>
            </div>
          </div>

          {/* Right Column: Breathtaking Illustration Scene */}
          <div className="hero-illustration-scene">
            <div className="visual-glow-background" />
            
            {/* The beautiful fallback SVG shield microphone matching the auth screen */}
            <div className="microphone-3d-scene">
              <img 
                src="/auth_microphone.png" 
                alt="AudioGuard Protection Engine" 
                className="microphone-3d-asset"
                onError={(e) => {
                  e.target.style.display = 'none';
                  document.getElementById('hero-fallback-svg').style.display = 'block';
                }}
              />
              
              <svg id="hero-fallback-svg" style={{ display: 'none', width: '100%', maxHeight: '340px' }} viewBox="0 0 200 200">
                <defs>
                  <radialGradient id="heroNeonGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="100" cy="95" r="65" fill="url(#heroNeonGlow)" />
                {/* Stand */}
                <rect x="96" y="125" width="8" height="40" rx="4" fill="#0f766e" />
                <rect x="75" y="165" width="50" height="8" rx="4" fill="#0d5c5c" />
                {/* Body */}
                <rect x="80" y="55" width="40" height="70" rx="20" fill="#115e59" stroke="#10b981" strokeWidth="3" />
                <line x1="80" y1="75" x2="120" y2="75" stroke="#10b981" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="80" y1="95" x2="120" y2="95" stroke="#10b981" strokeWidth="1" strokeDasharray="2,2" />
                {/* Shield Overlay */}
                <path d="M 100 25 L 140 45 L 140 85 C 140 120 100 145 100 145 C 100 145 60 120 60 85 L 60 45 Z" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="4.5" filter="drop-shadow(0 0 12px rgba(16, 185, 129, 0.5))" />
                <circle cx="100" cy="85" r="14" fill="#0f766e" />
                <path d="M 96 82 L 104 82 L 104 88 L 96 88 Z" fill="#10b981" />
              </svg>
            </div>

            {/* Interactive floating descriptive panel */}
            <div className="hero-floating-card">
              <div className="floating-card-badge">Engine Status: Active</div>
              <p className="floating-card-title">Deepfake Analysis Active</p>
              <span className="floating-card-subtitle">Real-time signal analysis & classification</span>
            </div>
          </div>
        </div>
      </header>

      {/* ─── FEATURES SECTION ─── */}
      <section id="features" className="landing-section features-landing">
        <div className="section-header-centered">
          <span className="section-mini-tag">Key Capabilities</span>
          <h2>Cutting-Edge Protection</h2>
          <p>Every feature is designed to give you maximum confidence in audio authenticity.</p>
        </div>

        <div className="capabilities-grid">
          <div className="capability-card">
            <div className="capability-icon-wrap bg-green">
              <FaShieldAlt />
            </div>
            <h3>Deep Learning Analysis</h3>
            <p>Powered by neural networks trained on millions of real and synthetic voice samples to detect cloned speech.</p>
          </div>

          <div className="capability-card">
            <div className="capability-icon-wrap bg-teal">
              <FaMicrophone />
            </div>
            <h3>Real-Time Live Analysis</h3>
            <p>Stream directly from your microphone and receive instant deepfake probability scores frame-by-frame.</p>
          </div>

          <div className="capability-card">
            <div className="capability-icon-wrap bg-indigo">
              <FaChartBar />
            </div>
            <h3>Analytics Dashboard</h3>
            <p>Track history, confidence scores, and past signals on an interactive, clean interface.</p>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS SECTION ─── */}
      <section id="how-it-works" className="landing-section how-landing">
        <div className="section-header-centered">
          <span className="section-mini-tag">Simple Process</span>
          <h2>How AudioGuard Works</h2>
          <p>Verify speech signals in three simple steps.</p>
        </div>

        <div className="how-steps-timeline">
          <div className="timeline-step">
            <div className="timeline-badge">1</div>
            <div className="timeline-body">
              <h3>Upload or Stream Speech</h3>
              <p>Drag and drop a speech recording or stream directly using the live microphone analyzer.</p>
            </div>
          </div>

          <div className="timeline-step">
            <div className="timeline-badge">2</div>
            <div className="timeline-body">
              <h3>AI Feature Extraction</h3>
              <p>The system extracts spectral prosody and vocal artifacts left behind by speech synthesis algorithms.</p>
            </div>
          </div>

          <div className="timeline-step">
            <div className="timeline-badge">3</div>
            <div className="timeline-body">
              <h3>Instant Verdict</h3>
              <p>Receive a clear percentage confidence indicator and validation verdict immediately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ABOUT / CTA SECTION ─── */}
      <section id="about" className="landing-section cta-landing">
        <div className="cta-box-wrapper">
          <div className="cta-mesh-glow" />
          <h2>Protect Your Audio Integrity Today</h2>
          <p>Join secure systems safeguarding vocal communication from synthesis fraud and identity cloning.</p>
          <Link to="/signup" className="cta-final-button">Get Started Now</Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="landing-clean-footer">
        <div className="footer-container">
          <div className="footer-brand-column">
            <div className="footer-brand-logo">
              <FaUserShield className="footer-brand-icon" />
              <span>AudioGuard</span>
            </div>
            <p className="footer-description-tag">World-class AI voice-cloning detection shield.</p>
          </div>

          <div className="footer-nav-column">
            <h4>Platform</h4>
            <Link to="/login">Sign In</Link>
            <Link to="/signup">Get Started</Link>
          </div>

          <div className="footer-nav-column">
            <h4>System</h4>
            <Link to="/live">Live Analysis</Link>
            <Link to="/history">History</Link>
          </div>
        </div>
        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} AudioGuard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
