import React from "react";
import "./works.css";

const HowItWorks = () => {
  return (
    <div id="monitor">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />

      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <div className="how-it-works-header">
            <h2 className="how-it-works-title">Why Choose AquaGuardian</h2>
            <p className="how-it-works-description">
              Our water monitoring system offers unparalleled benefits to ensure
              your water quality is always at its best.
            </p>
          </div>
          <div className="how-it-works-grid">
            {/* Benefit 1 */}
            <div className="how-it-works-card">
              <div className="how-it-works-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3 className="how-it-works-card-title">Real-Time Monitoring</h3>
              <p className="how-it-works-card-description">
                Continuous 24/7 monitoring of all critical water parameters with
                data updated every 5 seconds for the most accurate readings.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="how-it-works-card">
              <div className="how-it-works-icon">
                <i className="fas fa-bell"></i>
              </div>
              <h3 className="how-it-works-card-title">Instant Alerts</h3>
              <p className="how-it-works-card-description">
                Receive immediate notifications via email, SMS, or app when any
                parameter falls outside your customized safe range.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="how-it-works-card">
              <div className="how-it-works-icon">
                <i className="fas fa-tachometer-alt"></i>
              </div>
              <h3 className="how-it-works-card-title">Easy Dashboard</h3>
              <p className="how-it-works-card-description">
                Intuitive interface with color-coded indicators makes it simple
                to understand your water quality at a glance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
