import React from 'react';
import { 
  FaShieldAlt, FaMicrophone, FaRobot, FaChartLine, 
  FaArrowRight, FaPlay, FaUsers, FaQuoteLeft, 
  FaHeart, FaTwitter, FaLinkedin, FaGithub, FaEnvelope,
  FaCheckCircle, FaLock, FaGlobe, FaCloudUploadAlt, FaBrain, FaUserTie, FaUserCircle,
  FaCode, FaLaptopCode
} from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section - Updated for contrast with sidebar */}
      <section className="about-hero">
        <div className="hero-content">
          <div className="hero-badge">About AudioGuard</div>
          <h1 className="hero-title">
            Protecting the Truth in an <span className="hero-gradient">AI-Driven World</span>
          </h1>
          <p className="hero-subtitle">
            AudioGuard is the global leader in voice authenticity. We provide 
            enterprise-grade deepfake detection to ensure that every voice you hear is real.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">Get Started Now</button>
            <button className="btn-secondary">Watch Demo <FaPlay style={{marginLeft: '8px', fontSize: '0.8rem'}} /></button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Accuracy Rate</div>
            </div>
            <div className="stat">
              <div className="stat-number">2M+</div>
              <div className="stat-label">Audios Analyzed</div>
            </div>
            <div className="stat">
              <div className="stat-number">50+</div>
              <div className="stat-label">Enterprise Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-card">
            <div className="mission-content">
              <h2>Our Mission</h2>
              <p>
                In an era where synthetic media is becoming indistinguishable from reality, 
                our mission is to build a foundation of trust. We empower individuals 
                and organizations to verify audio content instantly, preventing fraud 
                and misinformation before it spreads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose AudioGuard?</h2>
            <p>Cutting-edge technology designed for accuracy and speed</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <FaShieldAlt className="feature-icon" />
              </div>
              <h3>Real-time Guard</h3>
              <p>Instant detection as audio streams in, perfect for live calls and broadcast monitoring.</p>
              <span className="feature-tag">Instant</span>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <FaRobot className="feature-icon" />
              </div>
              <h3>Advanced AI Models</h3>
              <p>Our proprietary neural networks are trained on millions of real and synthetic voice samples.</p>
              <span className="feature-tag">AI-Powered</span>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <FaLock className="feature-icon" />
              </div>
              <h3>Privacy First</h3>
              <p>Your data is processed securely and never stored without your explicit permission.</p>
              <span className="feature-tag">Secure</span>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <FaGlobe className="feature-icon" />
              </div>
              <h3>Global Support</h3>
              <p>Detect deepfakes across 50+ languages and various regional accents with ease.</p>
              <span className="feature-tag">Multilingual</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Redesigned for better SS2 appearance */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Three simple steps to voice verification</p>
          </div>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-visual">
                <div className="step-number">01</div>
                <div className="step-icon-main"><FaCloudUploadAlt /></div>
              </div>
              <div className="step-info">
                <h3>Capture</h3>
                <p>Record or upload the audio clip you want to verify.</p>
              </div>
            </div>
            <div className="step-connector">
              <FaArrowRight />
            </div>
            <div className="step-item">
              <div className="step-visual">
                <div className="step-number">02</div>
                <div className="step-icon-main"><FaBrain /></div>
              </div>
              <div className="step-info">
                <h3>Analyze</h3>
                <p>Our AI analyzes 1,000+ acoustic features per second.</p>
              </div>
            </div>
            <div className="step-connector">
              <FaArrowRight />
            </div>
            <div className="step-item">
              <div className="step-visual">
                <div className="step-number">03</div>
                <div className="step-icon-main"><FaCheckCircle /></div>
              </div>
              <div className="step-info">
                <h3>Result</h3>
                <p>Receive a detailed report with a clear confidence score.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Updated with requested names */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Leadership</h2>
            <p>The experts behind the technology</p>
          </div>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-avatar-wrapper">
                <div className="team-avatar"><FaCode /></div>
              </div>
              <h3>Muhammad Usman</h3>
              <p>Lead Full-Stack Developer</p>
              <div className="team-social">
                <FaLinkedin /> <FaGithub />
              </div>
            </div>
            <div className="team-card">
              <div className="team-avatar-wrapper">
                <div className="team-avatar"><FaLaptopCode /></div>
              </div>
              <h3>Aryan</h3>
              <p>Frontend Developer</p>
              <div className="team-social">
                <FaLinkedin /> <FaGithub />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Trusted by Leaders</h2>
            <p>See what experts are saying about us</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <FaQuoteLeft className="quote-icon-top" />
              <p className="testimonial-text">
                "AudioGuard has become an essential tool for our newsroom. In an era of misinformation, 
                being able to verify source material in seconds is invaluable."
              </p>
              <div className="testimonial-author">
                <strong>Elena Rodriguez</strong>
                <span>Editor-in-Chief, Global News</span>
              </div>
            </div>
            <div className="testimonial-card">
              <FaQuoteLeft className="quote-icon-top" />
              <p className="testimonial-text">
                "The accuracy of their detection model is unmatched. We've tested multiple solutions, 
                and AudioGuard consistently outperforms the competition."
              </p>
              <div className="testimonial-author">
                <strong>David Park</strong>
                <span>CTO, SecureLink Systems</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to Verify?</h2>
            <p>Join thousands of organizations protecting their voice security today.</p>
            <div className="hero-buttons">
              <button className="btn-primary">Start Free Trial</button>
              <button className="btn-outline">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">AudioGuard</div>
              <p>The world's most advanced AI-powered audio deepfake detection system.</p>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <a href="#">Whitepaper</a>
              <a href="#">API Documentation</a>
              <a href="#">Privacy Policy</a>
            </div>
            <div className="footer-column">
              <h4>Connect</h4>
              <div className="footer-social">
                <a href="#"><FaTwitter /></a>
                <a href="#"><FaLinkedin /></a>
                <a href="#"><FaGithub /></a>
                <a href="#"><FaEnvelope /></a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 AudioGuard Pro. Made with <FaHeart className="heart-icon" /> for a safer web.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;