import React, { useState, useEffect } from "react";
import {
  FileText,
  AlertCircle,
  BarChart2,
  Download,
  Filter,
  Clock,
  Trash2,
  LineChart,
  PieChart,
  ChevronRight,
} from "lucide-react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import DhNavbar from "../dh_navbar";
import "./Report.css";
import {
  ResponsiveContainer,
  LineChart as RLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cryokbzmtpmclaukyplq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyeW9rYnptdHBtY2xhdWt5cGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MTkwMjYsImV4cCI6MjA2MzM5NTAyNn0.Vyz14ENyzDdPSWWNk-W3AOVmflJEdDiyH9caycD1M0k";
const supabase = createClient(supabaseUrl, supabaseKey);

const Reports = () => {
  const [activeTab, setActiveTab] = useState("standard");
  const [dateRange, setDateRange] = useState("7d");
  const [selectedParams, setSelectedParams] = useState([
    "ph",
    "tds",
    "temperature",
    "turbidity",
  ]);
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customReport, setCustomReport] = useState({
    title: "",
    charts: [],
    parameters: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const now = new Date();
      let fromDate;
      switch (dateRange) {
        case "24h":
          fromDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "7d":
          fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }
      const fromISOString = fromDate.toISOString();

      // Fetch all parameters
      const [
        { data: turbidityRows },
        { data: phRows },
        { data: tdsRows },
        { data: tempRows },
      ] = await Promise.all([
        supabase
          .from("turbidity_readings")
          .select("turbidity_value,created_at")
          .gte("created_at", fromISOString)
          .order("created_at", { ascending: true }),
        supabase
          .from("ph_readings")
          .select("ph_value,created_at")
          .gte("created_at", fromISOString)
          .order("created_at", { ascending: true }),
        supabase
          .from("tds_readings")
          .select("tds_value,recorded_at")
          .gte("recorded_at", fromISOString)
          .order("recorded_at", { ascending: true }),
        supabase
          .from("temperature_readings")
          .select("temperature_value,created_at")
          .gte("created_at", fromISOString)
          .order("created_at", { ascending: true }),
      ]);

      // Helper for grouping
      function formatKey(dt, granularity) {
        const d = new Date(dt);
        if (granularity === "hour") {
          return d.toISOString().slice(0, 13); // YYYY-MM-DDTHH
        }
        return d.toISOString().split("T")[0]; // YYYY-MM-DD
      }

      const granularity = dateRange === "24h" ? "hour" : "day";

      // Group and average
      function groupAvg(rows, keyField, valueField) {
        const grouped = {};
        rows.forEach((row) => {
          const key = formatKey(row[keyField], granularity);
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(Number(row[valueField]));
        });
        return grouped;
      }

      const turbidityGrouped = groupAvg(
        turbidityRows || [],
        "created_at",
        "turbidity_value"
      );
      const phGrouped = groupAvg(phRows || [], "created_at", "ph_value");
      const tdsGrouped = groupAvg(tdsRows || [], "recorded_at", "tds_value");
      const tempGrouped = groupAvg(
        tempRows || [],
        "created_at",
        "temperature_value"
      );

      // Build report data for each period (hour or day)
      let points = [];
      let nPoints = dateRange === "24h" ? 24 : dateRange === "30d" ? 30 : 7;
      for (let i = nPoints - 1; i >= 0; i--) {
        let d = new Date(now);
        if (granularity === "hour")
          d.setHours(now.getHours() - (nPoints - 1 - i));
        else d.setDate(now.getDate() - (nPoints - 1 - i));
        const key =
          granularity === "hour"
            ? d.toISOString().slice(0, 13)
            : d.toISOString().split("T")[0];
        points.push({
          date: granularity === "hour" ? key.replace("T", " ") : key,
          turbidity:
            turbidityGrouped[key] && turbidityGrouped[key].length
              ? Number(
                  (
                    turbidityGrouped[key].reduce((a, b) => a + b, 0) /
                    turbidityGrouped[key].length
                  ).toFixed(2)
                )
              : null,
          ph:
            phGrouped[key] && phGrouped[key].length
              ? Number(
                  (
                    phGrouped[key].reduce((a, b) => a + b, 0) /
                    phGrouped[key].length
                  ).toFixed(2)
                )
              : null,
          tds:
            tdsGrouped[key] && tdsGrouped[key].length
              ? Number(
                  (
                    tdsGrouped[key].reduce((a, b) => a + b, 0) /
                    tdsGrouped[key].length
                  ).toFixed(2)
                )
              : null,
          temperature:
            tempGrouped[key] && tempGrouped[key].length
              ? Number(
                  (
                    tempGrouped[key].reduce((a, b) => a + b, 0) /
                    tempGrouped[key].length
                  ).toFixed(2)
                )
              : null,
        });
      }

      setReportData(points);
      setIsLoading(false);
    };

    fetchData();
  }, [dateRange]);

  const toggleParameter = (param) => {
    setSelectedParams((prev) =>
      prev.includes(param) ? prev.filter((p) => p !== param) : [...prev, param]
    );
  };

  const exportReport = (format) => {
    const dataToExport = reportData.map((item) => {
      const exportItem = { date: item.date };
      selectedParams.forEach((param) => {
        exportItem[param] = item[param];
      });
      return exportItem;
    });

    if (dataToExport.length === 0) {
      alert("No data to export.");
      return;
    }

    if (format === "csv") {
      const csvContent = [
        Object.keys(dataToExport[0]).join(","),
        ...dataToExport.map((item) => Object.values(item).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      saveAs(
        blob,
        `water_quality_report_${new Date().toISOString().slice(0, 10)}.csv`
      );
    } else if (format === "excel") {
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      XLSX.writeFile(
        wb,
        `water_quality_report_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
    } else {
      alert("PDF export would be implemented here");
    }
  };

  // Custom report builder logic (optional, for your previous custom builder)
  const addChart = (type) => {
    setCustomReport((prev) => ({
      ...prev,
      charts: [
        ...prev.charts,
        {
          id: Date.now(),
          type,
          title: `${type} Chart`,
          parameters: selectedParams,
        },
      ],
    }));
  };
  const removeChart = (id) => {
    setCustomReport((prev) => ({
      ...prev,
      charts: prev.charts.filter((chart) => chart.id !== id),
    }));
  };
  const updateChartTitle = (id, title) => {
    setCustomReport((prev) => ({
      ...prev,
      charts: prev.charts.map((chart) =>
        chart.id === id ? { ...chart, title } : chart
      ),
    }));
  };

  const renderChart = (chart) => {
    const filteredData = reportData.map((item) => {
      const filteredItem = { date: item.date };
      chart.parameters.forEach((param) => {
        filteredItem[param] = item[param];
      });
      return filteredItem;
    });

    switch (chart.type) {
      case "line":
        return (
          <div className="chart-wrapper">
            <h4>{chart.title}</h4>
            <ResponsiveContainer width="100%" height={300}>
              <RLineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {chart.parameters.map((param) => (
                  <Line
                    key={param}
                    type="monotone"
                    dataKey={param}
                    stroke={`#${Math.floor(Math.random() * 16777215).toString(
                      16
                    )}`}
                  />
                ))}
              </RLineChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="hero-report">
      <DhNavbar />
      <div className="reports-container">
        <header className="reports-header">
          <div className="header-content">
            <h1>
              <BarChart2 className="header-icon" />
              <span className="title-text">Water Quality Analytics</span>
            </h1>
            <p className="header-subtitle">
              Comprehensive water parameter analysis and reporting
            </p>
          </div>
        </header>
        <div className="report-content">
          {isLoading ? (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Generating your report...</p>
            </div>
          ) : (
            <>
              {activeTab === "standard" && (
                <StandardReports
                  data={reportData}
                  selectedParams={selectedParams}
                  onToggleParameter={toggleParameter}
                  onExport={exportReport}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                />
              )}
              {activeTab === "custom" && (
                <div className="custom-builder">
                  <div className="builder-controls">
                    <div className="control-group">
                      <h3>Add Chart</h3>
                      <div className="chart-types">
                        <button onClick={() => addChart("line")}>
                          <LineChart size={18} />
                          Line Chart
                        </button>
                        <button onClick={() => addChart("pie")}>
                          <PieChart size={18} />
                          Pie Chart
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="custom-report-preview">
                    {customReport.charts.length === 0 ? (
                      <div className="empty-state">
                        <BarChart2 size={48} />
                        <h3>No charts added yet</h3>
                        <p>
                          Start by adding your first chart from the controls
                        </p>
                      </div>
                    ) : (
                      customReport.charts.map((chart) => (
                        <div key={chart.id} className="custom-chart">
                          <div className="chart-header">
                            <input
                              type="text"
                              value={chart.title}
                              onChange={(e) =>
                                updateChartTitle(chart.id, e.target.value)
                              }
                              className="chart-title-input"
                            />
                            <button
                              onClick={() => removeChart(chart.id)}
                              className="delete-chart"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          {renderChart(chart)}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const StandardReports = ({
  data,
  selectedParams,
  onToggleParameter,
  onExport,
  dateRange,
  setDateRange,
}) => {
  // Choose a color for each parameter
  const paramColors = {
    ph: "#4A90E2",
    tds: "#F5A623",
    temperature: "#D0021B",
    turbidity: "#7ED321",
  };

  return (
    <div className="standard-reports">
      <div className="quick-filters">
        <div className="filter-group">
          <label>
            <Clock size={16} /> Time Range:
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
        <div className="filter-group">
          <label>
            <Filter size={16} /> Parameters:
          </label>
          <div className="parameter-tags">
            {["ph", "tds", "temperature", "turbidity"].map((param) => (
              <span
                key={param}
                className={`tag ${
                  selectedParams.includes(param) ? "active" : ""
                }`}
                onClick={() => onToggleParameter(param)}
              >
                {param.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <label>Export:</label>
          <div className="exports-options">
            <button onClick={() => onExport("csv")} className="export-btns">
              <Download size={16} /> CSV
            </button>
            <button onClick={() => onExport("excel")} className="export-btns">
              <Download size={16} /> Excel
            </button>
            <button onClick={() => onExport("pdf")} className="export-btns">
              <Download size={16} /> PDF
            </button>
          </div>
        </div>
      </div>
      <div className="report-cards">
        <div className="report-card summary-card">
          <h3>
            <FileText size={18} /> Analytics Report
          </h3>
          <div className="card-content">
            <ResponsiveContainer width="100%" height={300}>
              <RLineChart
                data={data.filter((d) =>
                  selectedParams.some((p) => d[p] !== null)
                )}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedParams.map((param) => (
                  <Line
                    key={param}
                    type="monotone"
                    dataKey={param}
                    stroke={paramColors[param]}
                    name={param.toUpperCase()}
                    dot={false}
                    isAnimationActive={false}
                  />
                ))}
              </RLineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="report-card violations-card">
          <h3>
            <AlertCircle size={18} /> Threshold Violations
          </h3>
          <div className="card-content">
            <div className="violation-list">
              <div className="violation-item critical">
                <div className="violation-details">
                  <span className="time">Today 14:30</span>
                  <span className="parameter">Turbidity</span>
                  <span className="value">7.8 NTU (max: 5 NTU)</span>
                </div>
                <button className="violation-action">
                  <span>View Details</span>
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="violation-item warning">
                <div className="violation-details">
                  <span className="time">Yesterday 09:15</span>
                  <span className="parameter">Turbidity</span>
                  <span className="value">5.8 NTU (max: 5 NTU)</span>
                </div>
                <button className="violation-action">
                  <span>View Details</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
