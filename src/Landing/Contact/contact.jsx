import React from "react";
import { useNavigate } from "react-router-dom";
import "./Contact.css";

const Contact = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };
  return (
    <div id="why">
      <div className="contact">
        <div className="contact-cta">
          <div className="contact-container">
            <h2 className="contact-title">
              Ready to Transform Your Water Management?
            </h2>
            <p className="contact-subtitle">
              Join thousands of satisfied customers who have improved their
              water quality monitoring with AquaGuardian.
            </p>
            <div className="contact-buttons">
              <button className="btn-start-trial" onClick={handleLoginClick}>
                Start Now
              </button>
              <button className="btn-watch-demo">
                <i className="fas fa-play-circle"></i> Watch Demo
              </button>
            </div>
            <div className="contact-stats">
              <div className="stat-item">
                <div className="stat-value">99.9%</div>
                <div className="stat-label">Uptime Reliability</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">5s</div>
                <div className="stat-label">Data Update Frequency</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">10K+</div>
                <div className="stat-label">Active Installations</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">24/7</div>
                <div className="stat-label">Technical Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer id="contact" className="footer">
          <div className="footer-container">
            <div className="footer-grid">
              <div className="footer-brand">
                <div className="footer-logo">
                  <i className="fas fa-water"></i>
                  <span>AquaGuardian</span>
                </div>
                <p className="footer-description">
                  Advanced water monitoring solutions for residential,
                  commercial, and industrial applications.
                </p>
                <div className="footer-socials">
                  <a href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
              <div className="footer-links">
                <h3>Quick Links</h3>
                <ul>
                  <li>
                    <a href="#features">Features</a>
                  </li>
                  <li>
                    <a href="#how-it-works">How It Works</a>
                  </li>
                  <li>
                    <a href="#pricing">Pricing</a>
                  </li>
                  <li>
                    <a href="#">Support</a>
                  </li>
                  <li>
                    <a href="#">Blog</a>
                  </li>
                </ul>
              </div>
              <div className="footer-contact">
                <h3>Contact Us</h3>
                <ul>
                  <li>
                    <i className="fas fa-map-marker-alt"></i> National
                    University Dasmarinas
                  </li>
                  <li>
                    <i className="fas fa-phone-alt"></i> +1 (555) 123-4567
                  </li>
                  <li>
                    <i className="fas fa-envelope"></i> info@aquaguardian.com
                  </li>
                </ul>
              </div>
              <div className="footer-newsletter">
                <h3>Newsletter</h3>
                <p>
                  Subscribe to our newsletter for the latest updates and water
                  quality tips.
                </p>
                <form>
                  <input type="email" placeholder="Your email address" />
                  <button type="submit">Subscribe</button>
                </form>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© 2025 AquaGuardian. All rights reserved.</p>
              <div className="footer-policy-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Cookie Policy</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Contact;
