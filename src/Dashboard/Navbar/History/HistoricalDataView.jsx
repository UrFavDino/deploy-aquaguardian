import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./HistoricalDataView.css";
import DhNavbar from "../dh_navbar";

// Utility function to format date
const formatDate = (date) => date.toISOString().split("T")[0];

// Generate simulated historical data
const generateData = () => {
  const data = [];
  const now = new Date();
  for (let i = 0; i < 200; i++) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000); // hourly data
    data.push({
      time: time.toISOString(),
      ph: +(6.5 + Math.random() * 2).toFixed(2),
      tds: +(150 + Math.random() * 100).toFixed(0),
      temperature: +(20 + Math.random() * 5).toFixed(1),
      turbidity: +(1 + Math.random() * 3).toFixed(1),
    });
  }
  return data.reverse(); // oldest to newest
};

const sampleHistoricalData = generateData();

const HistoricalDataView = ({
  historicalData = sampleHistoricalData,
  darkMode,
}) => {
  const [filteredData, setFilteredData] = useState(historicalData);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const charts = [
    { key: "ph", name: "pH Level", color: "#8884d8", domain: [6, 9], unit: "" },
    {
      key: "tds",
      name: "TDS",
      color: "#82ca9d",
      domain: [0, 500],
      unit: "ppm",
    },
    {
      key: "temperature",
      name: "Temperature",
      color: "#ffc658",
      domain: [15, 30],
      unit: "°C",
    },
    {
      key: "turbidity",
      name: "Turbidity",
      color: "#ff8042",
      domain: [0, 10],
      unit: "NTU",
    },
  ];

  const filterData = (hoursBack) => {
    const now = new Date();
    const cutoff = new Date(now.getTime() - hoursBack * 60 * 60 * 1000);
    setFilteredData(historicalData.filter((d) => new Date(d.time) >= cutoff));
  };

  const handleCustomRange = () => {
    if (customStart && customEnd) {
      const start = new Date(customStart);
      const end = new Date(customEnd);
      setFilteredData(
        historicalData.filter((d) => {
          const t = new Date(d.time);
          return t >= start && t <= end;
        })
      );
    }
  };

  return (
    <div className="hero-history">
      <DhNavbar />
      <div
        className={`historical-view-container ${darkMode ? "dark-mode" : ""}`}
      >
        <h1>Historical Data Trends</h1>

        <div className="chart-grid">
          {charts.map((chart) => (
            <div key={chart.key} className="chart-card">
              <h2 className="chart-title">
                {chart.name} {chart.unit && `(${chart.unit})`}
              </h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      tickFormatter={(str) =>
                        new Date(str).toLocaleTimeString()
                      }
                      minTickGap={20}
                    />
                    <YAxis domain={chart.domain} />
                    <Tooltip
                      labelFormatter={(val) => new Date(val).toLocaleString()}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={chart.key}
                      stroke={chart.color}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>

        <div className="date-range-selector">
          <h2>Select Date Range</h2>
          <div className="range-buttons">
            <button onClick={() => filterData(24)}>Last 24 hours</button>
            <button onClick={() => filterData(24 * 7)}>Last 7 days</button>
          </div>

          <div className="custom-range">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              max={formatDate(new Date())}
            />
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              max={formatDate(new Date())}
            />
            <button onClick={handleCustomRange}>Apply Custom Range</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalDataView;
