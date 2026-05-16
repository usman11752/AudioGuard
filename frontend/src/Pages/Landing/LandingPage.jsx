import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

/* ── tiny helper to animate counter numbers ── */
function useCountUp(target, duration = 1800) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = Number.isInteger(target)
        ? Math.floor(start).toLocaleString()
        : start.toFixed(1);
      if (start >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [target, duration]);
  return ref;
}

/* ── wave bars for hero decoration ── */
const WAVE_HEIGHTS = [18, 32, 48, 28, 55, 22, 40, 60, 35, 50, 25, 45, 30, 58, 20, 42, 52, 27, 38, 62];

const LandingPage = () => {
  const countRef1 = useCountUp(98.7);
  const countRef2 = useCountUp(50000);
  const countRef3 = useCountUp(10);
  const countRef4 = useCountUp(99);

  return (
    <div className="landing-page">
      {/* ── NAVBAR ── */}
      <nav className="landing-nav">
        <Link to="/" className="landing-nav-logo">
          <div className="nav-logo-icon">🎙️</div>
          <div className="nav-brand">
            <span className="nav-brand-name">AudioGuard</span>
            <span className="nav-brand-sub">AI Deepfake Detection</span>
          </div>
        </Link>

        <div className="landing-nav-links">
          <Link to="/login"  className="nav-link-ghost">Login</Link>
          <Link to="/signup" className="nav-link-primary">Get Started</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-glow" />

        {/* floating icon */}
        <div className="hero-icon-wrap">🎙️</div>

        {/* badge pill */}
        <div className="hero-badge">
          <span className="badge-dot" />
          🏆 AI-Powered · Real-Time · 98.7% Accuracy
        </div>

        {/* headline exactly like SS */}
        <h1 className="hero-title">
          <span className="title-white">Protecting Every</span>
          <span className="title-gradient">Voice</span>
        </h1>

        {/* description exactly like SS */}
        <p className="hero-desc">
          Empowering security, shielding authenticity. AudioGuard is committed
          to providing world-class deepfake detection with modern AI facilities
          and expert algorithms.
        </p>

        {/* CTA buttons */}
        <div className="hero-cta">
          <Link to="/signup" className="btn-primary-lg">
            🚀 Start Analysing Free
          </Link>
          <Link to="/live" className="btn-outline-lg">
            🎤 Try Live Detection
          </Link>
        </div>

        {/* decorative wave bars */}
        <div className="hero-waves">
          {WAVE_HEIGHTS.concat(WAVE_HEIGHTS).map((h, i) => (
            <span key={i} style={{ height: `${h}px`, animationDelay: `${(i * 0.06).toFixed(2)}s` }} />
          ))}
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div className="stats-strip">
        <div className="stats-strip-inner">
          <div className="stat-strip-item">
            <div className="stat-strip-number">
              <span ref={countRef1}>0.0</span>%
            </div>
            <div className="stat-strip-label">Detection Accuracy</div>
          </div>
          <div className="stat-strip-item">
            <div className="stat-strip-number">
              <span ref={countRef2}>0</span>+
            </div>
            <div className="stat-strip-label">Audio Files Analysed</div>
          </div>
          <div className="stat-strip-item">
            <div className="stat-strip-number">
              &lt;<span ref={countRef3}>0</span>ms
            </div>
            <div className="stat-strip-label">Real-Time Latency</div>
          </div>
          <div className="stat-strip-item">
            <div className="stat-strip-number">
              <span ref={countRef4}>0</span>%
            </div>
            <div className="stat-strip-label">System Uptime</div>
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <p className="section-label">Why AudioGuard?</p>
        <h2 className="section-title">Cutting-Edge Protection Features</h2>
        <p className="section-subtitle">
          Every feature is designed to give you maximum confidence in audio authenticity
          — from a single file to enterprise-scale live streams.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon indigo">🧠</div>
            <h3 className="feature-title">Deep-Learning Model</h3>
            <p className="feature-desc">
              Powered by a state-of-the-art transformer trained on millions of real and
              synthetic voice samples — detecting even the latest voice-cloning tools.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon green">⚡</div>
            <h3 className="feature-title">Real-Time Live Analysis</h3>
            <p className="feature-desc">
              Stream audio directly from your microphone and receive instant deepfake
              probability scores frame-by-frame with sub-10 ms latency.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon purple">📂</div>
            <h3 className="feature-title">Batch File Upload</h3>
            <p className="feature-desc">
              Analyse MP3, WAV, FLAC, M4A and more. Drag-and-drop multiple files for
              bulk processing with a detailed per-file confidence report.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon amber">📊</div>
            <h3 className="feature-title">Rich Analytics Dashboard</h3>
            <p className="feature-desc">
              Track detection history, confidence trends, and threat statistics with
              beautiful interactive charts right inside the app.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon red">🛡️</div>
            <h3 className="feature-title">Threat Confidence Score</h3>
            <p className="feature-desc">
              Every result comes with a 0–100% confidence score and colour-coded risk
              level — Real, Suspicious, or Fake — so you can act fast.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon blue">🗂️</div>
            <h3 className="feature-title">Full Detection History</h3>
            <p className="feature-desc">
              Every scan is logged with timestamps, file details, and results.
              Search, filter, and export your detection history at any time.
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section">
        <p className="section-label">Simple Process</p>
        <h2 className="section-title">How AudioGuard Works</h2>
        <p className="section-subtitle">
          Three simple steps to verify any audio in seconds.
        </p>

        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">01</div>
            <div className="step-content">
              <h3>Upload or Stream Audio</h3>
              <p>
                Drag and drop an audio file (MP3, WAV, FLAC, M4A) or click
                <em> Live Analysis</em> to stream directly from your microphone.
                AudioGuard accepts any common format up to 500 MB.
              </p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">02</div>
            <div className="step-content">
              <h3>AI Model Analyses the Signal</h3>
              <p>
                Our transformer-based model extracts spectral features, prosodic
                patterns, and micro-artefacts left by voice-synthesis tools —
                comparing them against a baseline of real human speech.
              </p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">03</div>
            <div className="step-content">
              <h3>Get an Instant Verdict</h3>
              <p>
                Within milliseconds you receive a colour-coded result —{' '}
                <strong style={{ color: '#10b981' }}>Real</strong>,{' '}
                <strong style={{ color: '#f59e0b' }}>Suspicious</strong>, or{' '}
                <strong style={{ color: '#ef4444' }}>Fake</strong> — with a
                full confidence score and waveform visualisation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-glow" />
        <h2>Ready to Guard Against Audio Fakes?</h2>
        <p>
          Join thousands of users protecting themselves from voice cloning and
          synthetic audio fraud. Free to start — no credit card required.
        </p>
        <div className="cta-buttons">
          <Link to="/signup" className="btn-primary-lg">
            🚀 Create Free Account
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <Link to="/" className="footer-brand">
            <span style={{ fontSize: '1.3rem' }}>🎙️</span>
            <span className="footer-brand-name">AudioGuard</span>
          </Link>
          <span className="footer-copy">
            © {new Date().getFullYear()} AudioGuard. All rights reserved.
          </span>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/live">Live Analysis</Link>
            <Link to="/history">History</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
