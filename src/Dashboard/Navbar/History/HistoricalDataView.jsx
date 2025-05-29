import React, { useState, useEffect } from "react";
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
import { createClient } from "@supabase/supabase-js";

// Utility function to format date
const formatDate = (date) => date.toISOString().split("T")[0];

// Supabase setup
const supabaseUrl = "https://cryokbzmtpmclaukyplq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyeW9rYnptdHBtY2xhdWt5cGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MTkwMjYsImV4cCI6MjA2MzM5NTAyNn0.Vyz14ENyzDdPSWWNk-W3AOVmflJEdDiyH9caycD1M0k";
const supabase = createClient(supabaseUrl, supabaseKey);

// Generate simulated historical data (for fallback/other parameters)
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

const HistoricalDataView = ({ historicalData = generateData(), darkMode }) => {
  // We'll fetch real turbidity from the database, rest remain simulated
  const [allData, setAllData] = useState(historicalData);
  const [filteredData, setFilteredData] = useState(historicalData);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  // Fetch real turbidity history from Supabase
  useEffect(() => {
    const fetchTurbidityHistory = async () => {
      let { data, error } = await supabase
        .from("turbidity_readings")
        .select("created_at, turbidity_value")
        .order("created_at", { ascending: true })
        .limit(200);

      if (error) {
        console.error("Error fetching turbidity history:", error);
        setAllData(historicalData);
        setFilteredData(historicalData);
        return;
      }

      // Map to recharts format and merge with existing data
      const turbidityHistory = data.map((d, i) => ({
        ...historicalData[i],
        time: d.created_at,
        turbidity: parseFloat(d.turbidity_value),
        ph: historicalData[i]?.ph ?? 7.2,
        tds: historicalData[i]?.tds ?? 200,
        temperature: historicalData[i]?.temperature ?? 22,
      }));

      setAllData(turbidityHistory);
      setFilteredData(turbidityHistory);
    };

    fetchTurbidityHistory();
    // eslint-disable-next-line
  }, []);

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

  // Filtering logic
  const filterByRange = (
    rangeHours = null,
    customStartDate = null,
    customEndDate = null
  ) => {
    let data = allData;
    if (rangeHours) {
      const now = new Date();
      const cutoff = new Date(now.getTime() - rangeHours * 60 * 60 * 1000);
      data = data.filter((d) => new Date(d.time) >= cutoff);
    } else if (customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      data = data.filter((d) => {
        const t = new Date(d.time);
        return t >= start && t <= end;
      });
    }
    setFilteredData(data);
  };

  // Handler for 24HR and 7DAYS
  const handle24Hours = () => {
    setCustomStart("");
    setCustomEnd("");
    filterByRange(24, null, null);
  };

  const handle7Days = () => {
    setCustomStart("");
    setCustomEnd("");
    filterByRange(24 * 7, null, null);
  };

  // Handler for custom range
  const handleCustomRange = () => {
    if (customStart && customEnd) {
      filterByRange(null, customStart, customEnd);
    }
  };

  // Keep filteredData in sync with allData if no filters active
  useEffect(() => {
    if (!customStart && !customEnd) {
      setFilteredData(allData);
    }
  }, [allData, customStart, customEnd]);

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
            <button onClick={handle24Hours}>Last 24 hours</button>
            <button onClick={handle7Days}>Last 7 days</button>
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
