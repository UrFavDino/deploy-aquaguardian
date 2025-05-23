import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./Dashboard.css"; // Make sure to replace this file with our updated CSS
import DhNavbar from "./Navbar/dh_navbar";

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [waterData, setWaterData] = useState({
    ph: 7.2,
    tds: 285,
    temperature: 24.5,
    turbidity: 2.4,
  });

  // Historical data for trends
  const [historicalData, setHistoricalData] = useState([]);

  // Overall water quality score
  const [qualityScore, setQualityScore] = useState(85);

  // User preferences for thresholds
  const [thresholds, setThresholds] = useState({
    ph: { min: 6.5, max: 8.5 },
    tds: { min: 50, max: 300 },
    temperature: { min: 20, max: 26 },
    turbidity: { max: 5 },
  });

  // Action recommendations based on current alerts
  const [recommendations, setRecommendations] = useState([]);

  // Toggle for settings panel
  const [showSettings, setShowSettings] = useState(false);

  // State to track dark mode from localStorage
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    // Check for dark mode changes in localStorage
    const handleStorageChange = () => {
      setIsDarkMode(localStorage.getItem("darkMode") === "true");
    };

    // Set up event listener for storage changes
    window.addEventListener("storage", handleStorageChange);

    // Also check periodically for changes in case event isn't triggered
    const checkDarkMode = setInterval(() => {
      setIsDarkMode(localStorage.getItem("darkMode") === "true");
    }, 500);

    // Simulate real-time data updates
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setWaterData((prev) => {
        const newData = {
          ph: +(prev.ph + (Math.random() - 0.5) * 0.1).toFixed(2),
          tds: +(prev.tds + (Math.random() - 0.5) * 5).toFixed(1),
          temperature: +(
            prev.temperature +
            (Math.random() - 0.5) * 0.2
          ).toFixed(1),
          turbidity: +(prev.turbidity + (Math.random() - 0.5) * 0.1).toFixed(1),
        };

        // Update historical data every 5 seconds
        if (currentTime.getSeconds() % 5 === 0) {
          updateHistoricalData(newData);
        }

        // Update quality score
        calculateQualityScore(newData);

        // Generate recommendations based on data
        generateRecommendations(newData);

        return newData;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(checkDarkMode);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [currentTime]);

  // Function to add current data to historical records
  const updateHistoricalData = (newData) => {
    const timestamp = new Date().toLocaleTimeString();
    setHistoricalData((prev) => {
      const updated = [...prev, { timestamp, ...newData }];
      // Keep only the last 10 data points
      return updated.length > 10 ? updated.slice(-10) : updated;
    });
  };

  // Calculate overall water quality score
  const calculateQualityScore = (data) => {
    let score = 100;

    // pH score
    if (data.ph < thresholds.ph.min) {
      score -= 5 * (thresholds.ph.min - data.ph);
    } else if (data.ph > thresholds.ph.max) {
      score -= 5 * (data.ph - thresholds.ph.max);
    }

    // TDS score
    if (data.tds < thresholds.tds.min) {
      score -= 0.2 * (thresholds.tds.min - data.tds);
    } else if (data.tds > thresholds.tds.max) {
      score -= 0.2 * (data.tds - thresholds.tds.max);
    }

    // Temperature score
    if (data.temperature < thresholds.temperature.min) {
      score -= 3 * (thresholds.temperature.min - data.temperature);
    } else if (data.temperature > thresholds.temperature.max) {
      score -= 3 * (data.temperature - thresholds.temperature.max);
    }

    // Turbidity score
    if (data.turbidity > thresholds.turbidity.max) {
      score -= 5 * (data.turbidity - thresholds.turbidity.max);
    }

    setQualityScore(Math.max(0, Math.min(100, Math.round(score))));
  };

  // Generate recommendations based on current water data
  const generateRecommendations = (data) => {
    const newRecommendations = [];

    if (data.ph < thresholds.ph.min) {
      newRecommendations.push("Add alkaline buffer to increase pH level");
    } else if (data.ph > thresholds.ph.max) {
      newRecommendations.push("Add pH reducer or vinegar to decrease pH level");
    }

    if (data.tds > thresholds.tds.max) {
      newRecommendations.push(
        "Consider a partial water change to reduce TDS levels"
      );
    }

    if (data.temperature > thresholds.temperature.max) {
      newRecommendations.push(
        "Reduce water temperature by cooling the environment"
      );
    } else if (data.temperature < thresholds.temperature.min) {
      newRecommendations.push("Increase water temperature using a heater");
    }

    if (data.turbidity > thresholds.turbidity.max) {
      newRecommendations.push("Improve filtration system to reduce turbidity");
    }

    setRecommendations(newRecommendations);
  };

  // Function to determine the severity of an alert
  const getAlertSeverity = (value, parameter) => {
    switch (parameter) {
      case "ph":
        if (value < thresholds.ph.min - 1 || value > thresholds.ph.max + 1)
          return "high";
        if (value < thresholds.ph.min || value > thresholds.ph.max)
          return "medium";
        return "low";
      case "tds":
        if (value > thresholds.tds.max + 50) return "high";
        if (value > thresholds.tds.max) return "medium";
        return "low";
      case "temperature":
        if (
          value < thresholds.temperature.min - 3 ||
          value > thresholds.temperature.max + 3
        )
          return "high";
        if (
          value < thresholds.temperature.min ||
          value > thresholds.temperature.max
        )
          return "medium";
        return "low";
      case "turbidity":
        if (value > thresholds.turbidity.max + 2) return "high";
        if (value > thresholds.turbidity.max) return "medium";
        return "low";
      default:
        return "low";
    }
  };

  // Function to get color class based on severity
  const getSeverityColorClass = (severity) => {
    switch (severity) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "green";
    }
  };

  // Function to handle threshold updates
  const updateThreshold = (parameter, type, value) => {
    setThresholds((prev) => ({
      ...prev,
      [parameter]: {
        ...prev[parameter],
        [type]: Number(value),
      },
    }));
  };

  // Get quality score color
  const getQualityScoreColor = () => {
    if (qualityScore >= 80) return "green";
    if (qualityScore >= 60) return "orange";
    return "red";
  };

  return (
    <div className="hero-dashboard">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
      <DhNavbar />
      <div className="dashboard">
        <main className="dashboard-mains">
          <div className="cards-grid">
            {/* Card Template */}
            {[
              {
                title: "pH Level",
                value: waterData.ph,
                icon: "fas fa-flask",
                color: "blue",
                unit: "",
                range: [0, 7, 14],
                barMax: 14,
                parameter: "ph",
                condition:
                  waterData.ph >= thresholds.ph.min &&
                  waterData.ph <= thresholds.ph.max,
              },
              {
                title: "TDS",
                value: waterData.tds,
                icon: "fas fa-tint-slash",
                color: "purple",
                unit: "",
                range: [0, 250, 500],
                barMax: 500,
                parameter: "tds",
                condition:
                  waterData.tds >= thresholds.tds.min &&
                  waterData.tds <= thresholds.tds.max,
              },
              {
                title: "Temperature",
                value: waterData.temperature,
                icon: "fas fa-thermometer-half",
                color: "red",
                unit: "°C",
                range: ["0°C", "20°C", "40°C"],
                barMax: 40,
                parameter: "temperature",
                condition:
                  waterData.temperature >= thresholds.temperature.min &&
                  waterData.temperature <= thresholds.temperature.max,
              },
              {
                title: "Turbidity",
                value: waterData.turbidity,
                icon: "fas fa-water",
                color: "green",
                unit: "",
                range: [0, 5, 10],
                barMax: 10,
                parameter: "turbidity",
                condition: waterData.turbidity <= thresholds.turbidity.max,
              },
            ].map((card, idx) => (
              <div className="card" key={idx}>
                <div className="card-header">
                  <div className={`card-icon ${card.color}`}>
                    <i className={card.icon}></i>
                  </div>
                  <div>
                    <h3>{card.title}</h3>
                    <p className="subtext">Real-time value</p>
                  </div>
                  <span
                    className={`card-value ${getSeverityColorClass(
                      getAlertSeverity(card.value, card.parameter)
                    )}`}
                  >
                    {card.value}
                    {card.unit}
                  </span>
                </div>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div
                      className={`progress ${card.color}`}
                      style={{ width: `${(card.value / card.barMax) * 100}%` }}
                    ></div>
                  </div>
                  <div className="range-labels">
                    {card.range.map((val, i) => (
                      <span key={i}>{val}</span>
                    ))}
                  </div>
                </div>
                <div className="threshold-markers">
                  {card.parameter !== "turbidity" && (
                    <div
                      className="min-threshold"
                      style={{
                        left: `${
                          (thresholds[card.parameter].min / card.barMax) * 100
                        }%`,
                      }}
                      title={`Min: ${thresholds[card.parameter].min}`}
                    ></div>
                  )}
                  <div
                    className="max-threshold"
                    style={{
                      left: `${
                        (thresholds[card.parameter].max / card.barMax) * 100
                      }%`,
                    }}
                    title={`Max: ${thresholds[card.parameter].max}`}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="status-alerts">
            <div className="alerts-container">
              {/* Alerts */}
              <div className="alerts">
                <h3>Recent Alerts</h3>
                <div className="alert red-alert">
                  <i className="fas fa-exclamation-circle"></i>
                  <div>
                    <p>High TDS Level Detected</p>
                    <span>Value: 285 ppm at 10:45 AM</span>
                  </div>
                  <div className="alert-severity high">High</div>
                </div>
                <div className="alert yellow-alert">
                  <i className="fas fa-exclamation-triangle"></i>
                  <div>
                    <p>Temperature Warning</p>
                    <span>Value: 26.8°C at 10:30 AM</span>
                  </div>
                  <div className="alert-severity medium">Medium</div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="system-status">
              <h3>System Status</h3>
              {["Sensors Online", "Data Collection", "Alert System"].map(
                (status, i) => (
                  <div className="status-row" key={i}>
                    <div className="status-left">
                      <div className="status-dot green-dot"></div>
                      <span>{status}</span>
                    </div>
                    <span className="status-text">Operational</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Recommendations Section */}
          {recommendations.length > 0 && (
            <div className="recommendations-section">
              <h3>Recommendations</h3>
              <ul className="recommendations-list">
                {recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
