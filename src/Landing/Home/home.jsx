import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import BG from "../../assets/landing-bg.jpg";

const Home = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="home-wrapper">
      <div className="home-hero">
        <div className="home-bg-image">
          <img src={BG} alt="Water Background" />
          <div className="home-overlay"></div>
        </div>

        <div className="home-content">
          <div className="home-text">
            <h1>Real-Time Water Quality Monitoring Solution</h1>
            <p>
              Monitor pH, TDS, Temperature, and Salinity levels with precision.
              Get instant alerts and maintain optimal water quality with our
              advanced monitoring system.
            </p>
            <div className="home-buttons">
              <button className="home-btn-primary" onClick={handleLoginClick}>
                Get Started
              </button>
              <button className="home-btn-secondary">
                <i className="fas fa-play-circle"></i> Watch Demo
              </button>
            </div>
          </div>

          <div className="home-dashboard">
            <div className="home-dashboard-card">
              <div className="home-dashboard-header">
                <div className="home-dashboard-title">
                  <i className="fas fa-water"></i>
                  <span>Water Monitor</span>
                </div>
                <div className="home-dashboard-time">
                  {currentTime.toLocaleTimeString()}
                </div>
              </div>

              <div className="home-dashboard-stats">
                <div className="home-stat-box home-border-green">
                  <div className="home-stat-label">
                    <span>pH Level</span>
                    <span>7.2</span>
                  </div>
                  <div className="home-stat-bar">
                    <div
                      className="home-bar-fill home-bg-green"
                      style={{ width: "72%" }}
                    ></div>
                  </div>
                </div>
                <div className="home-stat-box home-border-yellow">
                  <div className="home-stat-label">
                    <span>TDS</span>
                    <span>285 ppm</span>
                  </div>
                  <div className="home-stat-bar">
                    <div
                      className="home-bar-fill home-bg-yellow"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                </div>
                <div className="home-stat-box home-border-blue">
                  <div className="home-stat-label">
                    <span>Temperature</span>
                    <span>24.5°C</span>
                  </div>
                  <div className="home-stat-bar">
                    <div
                      className="home-bar-fill home-bg-blue"
                      style={{ width: "80%" }}
                    ></div>
                  </div>
                </div>
                <div className="home-stat-box home-border-green">
                  <div className="home-stat-label">
                    <span>Salinity</span>
                    <span>0.2 ppt</span>
                  </div>
                  <div className="home-stat-bar">
                    <div
                      className="home-bar-fill home-bg-green"
                      style={{ width: "20%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
