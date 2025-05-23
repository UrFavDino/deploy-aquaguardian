import React, { useState, useEffect } from "react";
import {
  FileText,
  AlertCircle,
  BarChart2,
  Settings,
  Download,
  Calendar,
  Filter,
  Clock,
  Mail,
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  Trash2,
  Share2,
  LineChart,
  PieChart,
} from "lucide-react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import DhNavbar from "../dh_navbar";
import "./Report.css";

const Reports = () => {
  // State management
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

  // Sample data - in a real app, this would come from an API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockData = generateMockData();
      setReportData(mockData);
      setIsLoading(false);
    };

    fetchData();
  }, [dateRange]);

  // Generate mock data based on selected date range
  const generateMockData = () => {
    const dataPoints = dateRange === "24h" ? 24 : dateRange === "7d" ? 7 : 30;

    return Array.from({ length: dataPoints }, (_, i) => {
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() - i);

      return {
        date: baseDate.toISOString().split("T")[0],
        ph: +(7 + Math.sin(i) * 0.3).toFixed(2),
        tds: Math.round(300 + Math.cos(i * 0.5) * 50),
        temperature: +(22 + Math.sin(i * 0.3) * 3).toFixed(1),
        turbidity: +(2 + Math.sin(i * 0.7)).toFixed(1),
      };
    }).reverse();
  };

  // Toggle parameter selection
  const toggleParameter = (param) => {
    setSelectedParams((prev) =>
      prev.includes(param) ? prev.filter((p) => p !== param) : [...prev, param]
    );
  };

  // Export report data
  const exportReport = (format) => {
    const dataToExport = reportData.map((item) => {
      const exportItem = { date: item.date };
      selectedParams.forEach((param) => {
        exportItem[param] = item[param];
      });
      return exportItem;
    });

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
      // PDF would require a library like jsPDF or a server-side solution
      alert("PDF export would be implemented here");
    }
  };

  // Custom report builder functions
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

  // Render chart based on type
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
              <LineChart data={filteredData}>
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
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case "bar":
        return (
          <div className="chart-wrapper">
            <h4>{chart.title}</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {chart.parameters.map((param) => (
                  <Bar
                    key={param}
                    dataKey={param}
                    fill={`#${Math.floor(Math.random() * 16777215).toString(
                      16
                    )}`}
                  />
                ))}
              </BarChart>
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
        {/* Header with animated gradient */}
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

        {/* Main Content Area */}
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
                        <button onClick={() => addChart("bar")}>
                          <BarChart2 size={18} />
                          Bar Chart
                        </button>
                        <button onClick={() => addChart("pie")}>
                          <PieChart size={18} />
                          Pie Chart
                        </button>
                      </div>
                    </div>

                    <div className="control-group">
                      <h3>Parameters</h3>
                      <div className="parameter-selector">
                        {["ph", "tds", "temperature", "turbidity"].map(
                          (param) => (
                            <label key={param} className="parameter-checkbox">
                              <input
                                type="checkbox"
                                checked={selectedParams.includes(param)}
                                onChange={() => toggleParameter(param)}
                              />
                              {param.toUpperCase()}
                            </label>
                          )
                        )}
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

// Standard Reports Component
const StandardReports = ({
  data,
  selectedParams,
  onToggleParameter,
  onExport,
}) => {
  const complianceData = [
    { parameter: "pH", value: 7.2, status: "compliant", min: 6.5, max: 8.5 },
    { parameter: "TDS", value: 285, status: "compliant", min: 0, max: 500 },
    {
      parameter: "Temperature",
      value: 24.5,
      status: "warning",
      min: 20,
      max: 26,
    },
    { parameter: "Turbidity", value: 2.4, status: "compliant", min: 0, max: 5 },
  ];

  return (
    <div className="standard-reports">
      <div className="quick-filters">
        <div className="filter-group">
          <label>
            <Clock size={16} /> Time Range:
          </label>
          <select>
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
            <FileText size={18} /> Daily Summary
          </h3>
          <div className="card-content">
            <div className="metrics-grid">
              {complianceData
                .filter((d) =>
                  selectedParams.includes(d.parameter.toLowerCase())
                )
                .map((item) => (
                  <div key={item.parameter} className={`metric ${item.status}`}>
                    <span className="parameter">{item.parameter}</span>
                    <span className="value">{item.value}</span>
                    <span className="range">
                      {item.min}-{item.max}
                    </span>
                    <div className="status-indicator"></div>
                  </div>
                ))}
            </div>
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
                  <span className="parameter">Temperature</span>
                  <span className="value">26.8°C (max: 26°C)</span>
                </div>
                <button className="violation-action">
                  <span>View Details</span>
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="violation-item warning">
                <div className="violation-details">
                  <span className="time">Yesterday 09:15</span>
                  <span className="parameter">TDS</span>
                  <span className="value">512ppm (max: 500ppm)</span>
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
