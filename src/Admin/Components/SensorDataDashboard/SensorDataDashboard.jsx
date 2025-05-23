import React, { useState } from "react";
import {
  BarChart3,
  FileBarChart,
  AlertTriangle,
  Download,
  Info,
  XCircle,
  Search,
} from "lucide-react";
import "./SensorDataDashboard.css";
import AdminNavbar from "../../Navbar/AdminNavbar";

const initialSensors = [
  {
    id: "SEN-1001",
    name: "East Reservoir",
    location: "District 2",
    lastReading: "2025-05-21 08:30",
    status: "normal",
    remarks: "All water quality indicators are within acceptable limits.",
  },
  {
    id: "SEN-1002",
    name: "West River",
    location: "District 5",
    lastReading: "2025-05-21 08:28",
    status: "alert",
    remarks: "pH level didn’t meet the monthly standard requirements.",
  },
  {
    id: "SEN-1003",
    name: "North Spring",
    location: "District 7",
    lastReading: "2025-05-21 08:31",
    status: "normal",
    remarks: "Stable readings. No anomalies detected.",
  },
];

const SensorDataDashboard = () => {
  const [sensors] = useState(initialSensors);
  const [search, setSearch] = useState("");
  const [reportModal, setReportModal] = useState(false);

  // Filter sensors based on search
  const filteredSensors = sensors.filter(
    (sensor) =>
      sensor.name.toLowerCase().includes(search.toLowerCase()) ||
      sensor.id.toLowerCase().includes(search.toLowerCase()) ||
      sensor.location.toLowerCase().includes(search.toLowerCase())
  );

  // Stat cards (no temp)
  const statCards = [
    {
      icon: <BarChart3 size={22} />,
      label: "Active Sensors",
      value: sensors.length,
    },
    {
      icon: <AlertTriangle size={22} color="#ff6b6b" />,
      label: "Alerts",
      value: sensors.filter((s) => s.status === "alert").length,
    },
    {
      icon: <FileBarChart size={22} />,
      label: "Reports Generated",
      value: 156,
    },
  ];

  // CSV download
  const downloadReport = () => {
    // Show modal briefly for feedback
    setReportModal(true);

    // Prepare CSV data
    const headers = [
      "ID",
      "Sensor Name",
      "Location",
      "Last Reading",
      "Status",
      "Remarks",
    ];
    const rows = filteredSensors.map((sensor) => [
      sensor.id,
      sensor.name,
      sensor.location,
      sensor.lastReading,
      sensor.status.toUpperCase(),
      sensor.remarks.replace(/\n/g, " "),
    ]);
    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((item) => `"${String(item).replace(/"/g, '""')}"`).join(",")
      )
      .join("\r\n");

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `sensor-data-report-${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => {
      setReportModal(false);
      URL.revokeObjectURL(url);
    }, 1500);
  };

  return (
    <div className="sensor-dashboard-container">
      <AdminNavbar />
      <div className="sensor-dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1
              className="dashboard-title"
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <BarChart3 size={28} className="title-icon" />
              Sensor Data Dashboard
            </h1>
            <p className="dashboard-subtitle">
              Monitor and analyze collected water quality data from all
              connected sensors.
            </p>
          </div>
          <div className="dashboard-actions">
            <button
              className="dashboard-btn"
              onClick={downloadReport}
              title="Download report (CSV)"
            >
              <Download size={18} />
              Download Report
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="stat-cards">
          {statCards.map((card, idx) => (
            <div className="stat-card" key={idx}>
              <div className="stat-icon">{card.icon}</div>
              <div className="stat-content">
                <h3 className="stat-value">{card.value}</h3>
                <p className="stat-label">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search bar */}
        <div className="sensors-searchbar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search sensors by name, location, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Sensors table */}
        <div className="sensors-table-wrapper">
          <table className="sensors-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Sensor Name</th>
                <th>Location</th>
                <th>Last Reading</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredSensors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="no-data">
                    No sensors found
                  </td>
                </tr>
              ) : (
                filteredSensors.map((sensor) => (
                  <tr key={sensor.id}>
                    <td>{sensor.id}</td>
                    <td>{sensor.name}</td>
                    <td>{sensor.location}</td>
                    <td>{sensor.lastReading}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          sensor.status === "alert" ? "alert" : "normal"
                        }`}
                        title={
                          sensor.status === "alert"
                            ? "Alert: See remarks"
                            : "Normal"
                        }
                      >
                        {sensor.status === "alert" ? (
                          <>
                            <AlertTriangle
                              size={14}
                              style={{ verticalAlign: "-2px", marginRight: 3 }}
                            />
                            Alert
                          </>
                        ) : (
                          <>
                            <Info
                              size={14}
                              style={{ verticalAlign: "-2px", marginRight: 3 }}
                            />
                            Normal
                          </>
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="remarks">{sensor.remarks}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Download Modal */}
      {reportModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 350, textAlign: "center" }}>
            <div className="modal-header" style={{ justifyContent: "center" }}>
              <Download
                size={26}
                style={{ color: "#3b82f6", marginBottom: 5 }}
              />
            </div>
            <p
              style={{ fontSize: "1.15rem", fontWeight: 600, color: "#3b82f6" }}
            >
              Generating CSV report...
            </p>
            <p style={{ color: "#64748b", marginTop: 10, marginBottom: 6 }}>
              Your download will start shortly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SensorDataDashboard;
