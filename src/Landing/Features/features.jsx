import React from "react";
import "./features.css";

const Features = () => {
  return (
    <div id="hero">
      <section className="features-section">
        <div id="features" className="features-bg">
          <div className="features-container">
            <div className="features-header">
              <h2 className="features-title">Monitor What Matters</h2>
              <p className="features-subtitle">
                Our advanced sensors provide real-time data on the most critical
                water quality parameters with precision and reliability.
              </p>
            </div>
            <div className="features-grid">
              {/* pH Card */}
              <div className="features-card features-border-green">
                <div className="features-card-body">
                  <div className="features-icon-wrap">
                    <i className="fas fa-flask features-icon"></i>
                  </div>
                  <h3 className="features-card-title">pH Level</h3>
                  <div className="features-value">
                    <span>7.2</span>
                  </div>
                  <div className="features-bar-bg">
                    <div
                      className="features-bar-fill features-fill-green"
                      style={{ width: "72%" }}
                    ></div>
                  </div>
                  <p className="features-range">Optimal Range: 6.5 - 8.5</p>
                </div>
                <div className="features-status features-bg-green">Normal</div>
              </div>

              {/* TDS Card */}
              <div className="features-card features-border-yellow">
                <div className="features-card-body">
                  <div className="features-icon-wrap">
                    <i className="fas fa-tint-slash features-icon"></i>
                  </div>
                  <h3 className="features-card-title">TDS</h3>
                  <div className="features-value">
                    <span>285</span>
                    <span className="features-unit">ppm</span>
                  </div>
                  <div className="features-bar-bg">
                    <div
                      className="features-bar-fill features-fill-yellow"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                  <p className="features-range">Optimal Range: 50 - 300 ppm</p>
                </div>
                <div className="features-status features-bg-yellow">
                  Caution
                </div>
              </div>

              {/* Temperature Card */}
              <div className="features-card features-border-blue">
                <div className="features-card-body">
                  <div className="features-icon-wrap">
                    <i className="fas fa-thermometer-half features-icon"></i>
                  </div>
                  <h3 className="features-card-title">Temperature</h3>
                  <div className="features-value">
                    <span>24.5</span>
                    <span className="features-unit">°C</span>
                  </div>
                  <div className="features-bar-bg">
                    <div
                      className="features-bar-fill features-fill-blue"
                      style={{ width: "80%" }}
                    ></div>
                  </div>
                  <p className="features-range">Optimal Range: 20 - 26°C</p>
                </div>
                <div className="features-status features-bg-blue">Optimal</div>
              </div>

              {/* Salinity Card */}
              <div className="features-card features-border-green">
                <div className="features-card-body">
                  <div className="features-icon-wrap">
                    <i className="fas fa-water features-icon"></i>
                  </div>
                  <h3 className="features-card-title">Turbidity</h3>
                  <div className="features-value">
                    <span>0.2</span>
                    <span className="features-unit">ppt</span>
                  </div>
                  <div className="features-bar-bg">
                    <div
                      className="features-bar-fill features-fill-green"
                      style={{ width: "20%" }}
                    ></div>
                  </div>
                  <p className="features-range">Optimal Range: 0 - 1.0 ppt</p>
                </div>
                <div className="features-status features-bg-green">Normal</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
