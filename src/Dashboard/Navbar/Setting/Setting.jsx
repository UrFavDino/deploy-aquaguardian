import React, { useState, useEffect } from "react";
import {
  User,
  Bell,
  Database,
  Cpu,
  Shield,
  Settings,
  Moon,
  Sun,
  Clock,
  Mail,
  Smartphone,
  Globe,
  AlertCircle,
  Sliders,
  Calendar,
  HardDrive,
  Key,
  Lock,
  Share2,
  Download,
  Wifi,
  Zap,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  RotateCw,
  Circle,
  Activity,
  Power,
} from "lucide-react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import "./Setting.css";
import DhNavbar from "../dh_navbar";

const Setting = ({ darkMode, setDarkMode }) => {
  const [activeTab, setActiveTab] = useState("user");
  const [language, setLanguage] = useState("English");
  const [timeFormat, setTimeFormat] = useState("12-hour");
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const [thresholds, setThresholds] = useState({
    ph: { min: 6.5, max: 8.5 },
    tds: { min: 50, max: 500 },
    temperature: { min: 20, max: 26 },
    turbidity: { min: 0, max: 5 },
  });
  const [sensorStatus, setSensorStatus] = useState([
    {
      id: 1,
      name: "pH Probe",
      calibrated: "2023-11-15",
      status: "normal",
      value: 7.2,
    },
    {
      id: 2,
      name: "TDS Meter",
      calibrated: "2023-11-10",
      status: "needs calibration",
      value: 285,
    },
    {
      id: 3,
      name: "Turbidity Sensor",
      calibrated: "2023-11-18",
      status: "normal",
      value: 2.4,
    },
  ]);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const tabs = [
    { id: "alerts", icon: <Bell size={18} />, label: "Alerts" },
    { id: "devices", icon: <Cpu size={18} />, label: "Devices" },
    { id: "security", icon: <Shield size={18} />, label: "Security" },
  ];

  const languages = ["English", "Spanish", "French", "German"];
  const timeFormats = ["12-hour", "24-hour"];
  const exportFormats = ["CSV", "Excel", "JSON"];

  // Simulate sensor calibration
  const calibrateSensor = (sensorId) => {
    setIsCalibrating(true);
    setTimeout(() => {
      setSensorStatus((prev) =>
        prev.map((sensor) =>
          sensor.id === sensorId
            ? {
                ...sensor,
                calibrated: new Date().toISOString().split("T")[0],
                status: "normal",
                value: sensor.name.includes("pH")
                  ? 7.0
                  : sensor.name.includes("TDS")
                  ? 250
                  : 1.5,
              }
            : sensor
        )
      );
      setIsCalibrating(false);
    }, 2000);
  };

  // Export data with progress simulation
  const exportData = (format) => {
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          generateExportFile(format);
          return 0;
        }
        return prev + 10;
      });
    }, 100);
  };

  const generateExportFile = (format) => {
    const data = sensorStatus.map((sensor) => ({
      Sensor: sensor.name,
      Value: sensor.value,
      Status: sensor.status,
      "Last Calibrated": sensor.calibrated,
    }));

    if (format === "CSV") {
      const csv = XLSX.utils.json_to_sheet(data);
      const csvContent = XLSX.utils.sheet_to_csv(csv);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      saveAs(blob, `sensor_data_${new Date().toISOString().slice(0, 10)}.csv`);
    } else if (format === "Excel") {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, "Sensor Data");
      XLSX.writeFile(
        wb,
        `sensor_data_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
    } else {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      saveAs(blob, `sensor_data_${new Date().toISOString().slice(0, 10)}.json`);
    }
  };

  const handleThresholdChange = (param, type, value) => {
    setThresholds((prev) => ({
      ...prev,
      [param]: {
        ...prev[param],
        [type]: parseFloat(value),
      },
    }));
  };

  const toggleNotification = (type) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className="hero-setting">
      <DhNavbar />
      <div className={`settings-container ${darkMode ? "dark-mode" : ""}`}>
        <div className="settings-sidebar">
          <div className="sidebar-header">
            <Settings size={24} />
            <h2>System Settings</h2>
          </div>
          <div className="tabs-container">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`settings-tab ${
                  activeTab === tab.id ? "active" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
                <ChevronRight size={16} className="tab-chevron" />
              </button>
            ))}
          </div>
        </div>

        <div className="settings-content">
          {activeTab === "alerts" && (
            <div className="settings-section">
              <div className="section-header">
                <Bell size={24} />
                <h3>Alert Settings</h3>
              </div>

              <div className="thresholds-container">
                <h4 className="subsection-title">
                  <AlertCircle size={18} />
                  Parameter Thresholds
                </h4>
                <div className="threshold-grid">
                  {Object.entries(thresholds).map(([param, range]) => (
                    <div key={param} className="threshold-card">
                      <div className="threshold-header">
                        <Activity size={18} />
                        <h5>{param.toUpperCase()}</h5>
                      </div>
                      <div className="threshold-controls">
                        <div className="slider-group">
                          <label>Minimum</label>
                          <input
                            type="range"
                            min={
                              param === "ph"
                                ? 0
                                : param === "temperature"
                                ? 10
                                : 0
                            }
                            max={
                              param === "ph"
                                ? 14
                                : param === "temperature"
                                ? 40
                                : 1000
                            }
                            value={range.min}
                            onChange={(e) =>
                              handleThresholdChange(
                                param,
                                "min",
                                e.target.value
                              )
                            }
                          />
                          <div className="slider-value">
                            {range.min}
                            {param === "temperature"
                              ? "°C"
                              : param === "tds"
                              ? "ppm"
                              : ""}
                          </div>
                        </div>
                        <div className="slider-group">
                          <label>Maximum</label>
                          <input
                            type="range"
                            min={
                              param === "ph"
                                ? 0
                                : param === "temperature"
                                ? 10
                                : 0
                            }
                            max={
                              param === "ph"
                                ? 14
                                : param === "temperature"
                                ? 40
                                : 1000
                            }
                            value={range.max}
                            onChange={(e) =>
                              handleThresholdChange(
                                param,
                                "max",
                                e.target.value
                              )
                            }
                          />
                          <div className="slider-value">
                            {range.max}
                            {param === "temperature"
                              ? "°C"
                              : param === "tds"
                              ? "ppm"
                              : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="setting-notifications-container">
                <h4 className="subsection-title">
                  <Mail size={18} />
                  Notification Channels
                </h4>
                <div className="notification-cards">
                  <div
                    className={`notification-card ${
                      notifications.email ? "active" : ""
                    }`}
                  >
                    <div className="notification-header">
                      <Mail size={20} />
                      <h5>Email</h5>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={notifications.email}
                          onChange={() => toggleNotification("email")}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <p>Receive alerts via email</p>
                  </div>

                  <div
                    className={`notification-card ${
                      notifications.sms ? "active" : ""
                    }`}
                  >
                    <div className="notification-header">
                      <Smartphone size={20} />
                      <h5>SMS</h5>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={notifications.sms}
                          onChange={() => toggleNotification("sms")}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <p>Receive text message alerts</p>
                  </div>

                  <div
                    className={`notification-card ${
                      notifications.push ? "active" : ""
                    }`}
                  >
                    <div className="notification-header">
                      <Bell size={20} />
                      <h5>Push Notifications</h5>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={notifications.push}
                          onChange={() => toggleNotification("push")}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <p>Get notifications on your devices</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "devices" && (
            <div className="settings-section">
              <div className="section-header">
                <Cpu size={24} />
                <h3>Device Management</h3>
              </div>

              <div className="sensors-container">
                <h4 className="subsection-title">
                  <Circle size={18} />
                  Sensor Status
                </h4>
                <div className="sensors-grid">
                  {sensorStatus.map((sensor) => (
                    <div
                      key={sensor.id}
                      className={`sensor-card ${
                        sensor.status === "needs calibration"
                          ? "needs-attention"
                          : ""
                      }`}
                    >
                      <div className="sensor-header">
                        <div className="sensor-status">
                          <div
                            className={`status-indicator ${
                              sensor.status === "normal" ? "normal" : "warning"
                            }`}
                          ></div>
                          <h5>{sensor.name}</h5>
                        </div>
                        <div className="sensor-value">
                          {sensor.value}
                          {sensor.name.includes("Temperature")
                            ? "°C"
                            : sensor.name.includes("TDS")
                            ? "ppm"
                            : ""}
                        </div>
                      </div>
                      <div className="sensor-details">
                        <div className="detail-item">
                          <span>Last Calibrated:</span>
                          <span>{sensor.calibrated}</span>
                        </div>
                        <div className="detail-item">
                          <span>Status:</span>
                          <span
                            className={`status-text ${
                              sensor.status === "normal" ? "normal" : "warning"
                            }`}
                          >
                            {sensor.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => calibrateSensor(sensor.id)}
                        disabled={isCalibrating}
                        className={`calibrate-btn ${
                          isCalibrating ? "calibrating" : ""
                        }`}
                      >
                        {isCalibrating ? (
                          <>
                            <RotateCw className="spinner" size={16} />
                            Calibrating...
                          </>
                        ) : (
                          "Calibrate Now"
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="firmware-container">
                <h4 className="subsection-title">
                  <Zap size={18} />
                  Firmware Update
                </h4>
                <div className="firmware-card">
                  <div className="firmware-info">
                    <div className="firmware-icon">
                      <Power size={24} />
                    </div>
                    <div>
                      <h5>Current Version: v2.3.4</h5>
                      <p>New version v2.4.1 available</p>
                    </div>
                  </div>
                  <button className="update-btn">
                    <Download size={16} />
                    Update Firmware
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <div className="settings-section">
              <div className="section-header">
                <Database size={24} />
                <h3>Data Management</h3>
              </div>

              <div className="export-container">
                <h4 className="subsection-title">
                  <Download size={18} />
                  Export Data
                </h4>
                <div className="export-options">
                  {exportFormats.map((format) => (
                    <div key={format} className="export-card">
                      <div className="export-header">
                        <div className="export-icon">
                          {format === "CSV" && <FileText size={24} />}
                          {format === "Excel" && <HardDrive size={24} />}
                          {format === "JSON" && <Database size={24} />}
                        </div>
                        <h5>{format} Export</h5>
                      </div>
                      <p>Export all sensor data in {format} format</p>
                      <button
                        onClick={() => exportData(format)}
                        className="export-btn"
                      >
                        Export {format}
                      </button>
                    </div>
                  ))}
                </div>

                {exportProgress > 0 && exportProgress < 100 && (
                  <div className="export-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${exportProgress}%` }}
                      ></div>
                    </div>
                    <span>{exportProgress}%</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Setting;
