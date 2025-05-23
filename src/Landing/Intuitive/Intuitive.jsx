import React from "react";
import "./Intuitive.css";

const Intuitive = () => {
  return (
    <div className="intuitive-containers">
      <div className="dashboard-wrappers">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Intuitive Dashboard Interface</h2>
          <p className="dashboard-description">
            Monitor all your water parameters from one easy-to-use dashboard
            with color-coded alerts and historical data tracking.
          </p>
        </div>

        <div className="dashboard-preview-wrapper">
          <div className="dashboard-preview-box">
            <div className="dashboard-images" />
          </div>
          <div className="watch-demo-button">
            <span className="button-content">
              <i className="fas fa-play-circle"></i>
              Watch Live Demo
            </span>
          </div>
        </div>

        <div className="feature-grid">
          <div className="feature-cards">
            <div className="feature-icon-title">
              <div className="feature-icon">
                <i className="fas fa-history"></i>
              </div>
              <h3 className="feature-title">Historical Data</h3>
            </div>
            <p className="feature-text">
              Access and analyze trends with up to 2 years of historical data
              storage for all parameters.
            </p>
          </div>

          <div className="feature-cards">
            <div className="feature-icon-title">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3 className="feature-title">Mobile Access</h3>
            </div>
            <p className="feature-text">
              Monitor your water quality from anywhere with our responsive
              mobile application.
            </p>
          </div>

          <div className="feature-cards">
            <div className="feature-icon-title">
              <div className="feature-icon">
                <i className="fas fa-cog"></i>
              </div>
              <h3 className="feature-title">Custom Alerts</h3>
            </div>
            <p className="feature-text">
              Set personalized alert thresholds based on your specific water
              quality requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intuitive;
