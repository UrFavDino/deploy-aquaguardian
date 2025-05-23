import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  School,
  BarChart3,
  Settings,
  HelpCircle,
  UserCheck,
  FileCheck,
  AlertTriangle,
} from "lucide-react";
import AdminNavbar from "./Navbar/AdminNavbar";
import "./AdminDashboard.css";
import { supabase } from "../utils/supabaseClient"; // Adjust this import if your utils location differs

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Dynamic stats
  const [pendingCount, setPendingCount] = useState(0);
  const [schoolsCount, setSchoolsCount] = useState(0);

  // Notification placeholder - you can fetch these dynamically if you want
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "New verification request from East High School",
      isNew: true,
    },
    { id: 2, text: "Water quality alert in District 5", isNew: true },
    { id: 3, text: "System maintenance scheduled for tomorrow", isNew: false },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch dynamic stats from Supabase
  useEffect(() => {
    // Fetch pending verifications
    const fetchPending = async () => {
      const { count, error } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"); // Change "status" to your pending field if needed
      if (!error) setPendingCount(count || 0);
    };

    // Fetch number of unique schools
    const fetchSchools = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("school_name");
      if (!error && data) {
        const uniqueSchools = new Set(
          data
            .map((u) => u.school_name)
            .filter((name) => !!name && name.trim() !== "")
        );
        setSchoolsCount(uniqueSchools.size);
      }
    };

    fetchPending();
    fetchSchools();
  }, []);

  const handleReview = () => {
    navigate("/userverification");
  };

  const handleManageAccounts = () => {
    navigate("/manageschools");
  };

  const handleViewData = () => {
    navigate("/sensordata");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  const handleHelp = () => {
    navigate("/support");
  };

  const handleNotificationRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isNew: false }
          : notification
      )
    );
  };

  // Search filter for dashboard sections
  const sections = [
    {
      key: "userverification",
      icon: <Users size={24} className="section-icon" />,
      title: "User Verification",
      description:
        "Review and approve user-submitted documentation for account verification. Handle verification requests and maintain verification standards.",
      statNumber: pendingCount,
      statLabel: "Pending",
      button: {
        text: "Review Submissions",
        action: handleReview,
        className: "primary",
      },
    },
    {
      key: "manageschools",
      icon: <School size={24} className="section-icon" />,
      title: "Manage School Accounts",
      description:
        "Add, update, or remove school-related accounts. Configure permissions and access levels for different school administrators.",
      statNumber: schoolsCount,
      statLabel: "Schools",
      button: {
        text: "Manage Accounts",
        action: handleManageAccounts,
        className: "primary",
      },
    },
    {
      key: "sensordata",
      icon: <BarChart3 size={24} className="section-icon" />,
      title: "Sensor Data Dashboard",
      description:
        "Monitor and analyze collected water quality data from all connected sensors. View trends, generate reports, and set up alert thresholds.",
      statNumber: 156,
      statLabel: "Reports",
      button: {
        text: "View Analytics",
        action: handleViewData,
        className: "primary",
      },
    },
    {
      key: "settings",
      icon: <Settings size={24} className="section-icon" />,
      title: "System Settings",
      description:
        "Configure system-wide settings, notification preferences, and maintenance schedules. Manage backup and security policies.",
      button: {
        text: "Manage Settings",
        action: handleSettings,
        className: "secondary",
      },
    },
    {
      key: "support",
      icon: <HelpCircle size={24} className="section-icon" />,
      title: "Help & Support",
      description:
        "Access documentation, tutorials, and contact support for assistance with administrative tasks and troubleshooting.",
      button: {
        text: "Get Support",
        action: handleHelp,
        className: "secondary",
      },
    },
  ];

  // Stats section (Pending and Schools are dynamic)
  const stats = [
    {
      title: "Pending Verifications",
      value: pendingCount,
      icon: <UserCheck size={24} />,
    },
    {
      title: "Approved Schools",
      value: schoolsCount,
      icon: <School size={24} />,
    },
    {
      title: "Quality Alerts",
      value: 3,
      icon: <AlertTriangle size={24} color="#ff6b6b" />,
    },
    { title: "Reports Generated", value: 156, icon: <FileCheck size={24} /> },
  ];

  // Filter dashboard sections based on search
  const filteredSections = sections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-dashboard-container">
      <AdminNavbar />
      <div className="admin-dashboard-content">
        <div className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">
              Manage and monitor all system activities
            </p>
          </div>
        </div>

        <div className="dashboard-stats">
          {stats.map((stat, index) => (
            <div className="stat-card" key={index}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-title">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-sections">
          {filteredSections.length === 0 ? (
            <div className="no-search-results">
              <p>No dashboard sections found for "{searchQuery}"</p>
            </div>
          ) : (
            filteredSections.map((section) => (
              <div className="dashboard-section" key={section.key}>
                <div className="section-header">
                  {section.icon}
                  <h2 className="section-title">{section.title}</h2>
                </div>
                <p className="section-description">{section.description}</p>
                <div className="action-items">
                  {"statNumber" in section && (
                    <div className="action-stat">
                      <span className="stat-number">{section.statNumber}</span>
                      <span className="stat-label">{section.statLabel}</span>
                    </div>
                  )}
                  <button
                    className={`section-button ${section.button.className}`}
                    onClick={section.button.action}
                  >
                    {section.button.text}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
