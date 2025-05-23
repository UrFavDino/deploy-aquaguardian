import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../utils/supabaseClient";
import {
  User,
  Mail,
  Smartphone,
  Lock,
  LogOut,
  Key,
  Bell,
  Shield,
  Upload,
  Activity,
  AlertCircle,
  Calendar,
  Settings,
  BarChart2,
  Download,
  Eye,
  EyeOff,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DhNavbar from "../dh_navbar";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  // User data state
  const [user, setUser] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  // UI states
  const [activeTab, setActiveTab] = useState("overview");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    criticalAlerts: "all",
  });
  const [activityData, setActivityData] = useState([]);
  const [timeRange, setTimeRange] = useState("week");
  const [toast, setToast] = useState({ message: "", type: "" });

  // Simulated active sessions
  const [sessions, setSessions] = useState([
    {
      id: 1,
      device: "Chrome on Windows",
      location: "New York, US",
      last_active: "Current session",
      current: true,
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "Boston, US",
      last_active: "2 days ago",
      current: false,
    },
  ]);

  // Fetch user info from localStorage/Supabase on mount
  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        navigate("/");
        return;
      }
      const userObj = JSON.parse(storedUser);
      // Fetch latest user info from Supabase
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userObj.id)
        .single();
      if (error || !data) {
        showToast("Failed to load user profile", "error");
        setUser(userObj); // fallback to local
        return;
      }
      setUser(data);
      setFilePreview(data.school_id_url || null);
    };
    fetchUser();
    // eslint-disable-next-line
  }, []);

  // Generate mock activity data
  useEffect(() => {
    const generateData = () => {
      const data = [];
      const points = timeRange === "week" ? 7 : timeRange === "month" ? 30 : 12;
      const today = new Date();

      for (let i = points - 1; i >= 0; i--) {
        const date = new Date(today);
        if (timeRange === "week" || timeRange === "month") {
          date.setDate(date.getDate() - i);
        } else {
          date.setMonth(date.getMonth() - i);
        }

        data.push({
          date:
            timeRange === "week" || timeRange === "month"
              ? date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : date.toLocaleDateString("en-US", { month: "short" }),
          reports: Math.floor(Math.random() * 10) + 2,
          alerts: Math.floor(Math.random() * 5),
          resolved: Math.floor(Math.random() * 5),
        });
      }
      setActivityData(data);
    };

    generateData();
  }, [timeRange]);

  // Toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 2500);
  };

  // Calculate account age
  const calculateAccountAge = () => {
    if (!user?.created_at) return "";
    const joinDate = new Date(user.created_at);
    const today = new Date();
    const diffTime = Math.abs(today - joinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Change password
  const handlePasswordSave = async () => {
    if (passwordData.new !== passwordData.confirm) {
      showToast("New passwords do not match", "error");
      return;
    }
    setPasswordLoading(true);
    // Check current password
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .eq("password", passwordData.current)
      .single();

    if (error || !users) {
      showToast("Current password is incorrect", "error");
      setPasswordLoading(false);
      return;
    }

    // Update new password
    const { error: updateErr } = await supabase
      .from("users")
      .update({ password: passwordData.new })
      .eq("id", user.id);

    if (updateErr) {
      showToast("Failed to change password", "error");
      setPasswordLoading(false);
      return;
    }
    showToast("Password changed successfully");
    setPasswordData({ current: "", new: "", confirm: "" });
    setPasswordLoading(false);
  };

  // Toggle notification preferences
  const toggleNotification = (type) => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
    // Optionally, update in database
  };

  // Logout
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="hero-profile">
      <DhNavbar />
      <div className="profile-container">
        {/* Toast notification */}
        {toast.message && (
          <div className={`toast-notification ${toast.type}`}>
            {toast.message}
          </div>
        )}

        <div className="profile-header">
          <div className="avatar-upload">
            <div className="avatar-wrapper">
              {filePreview ? (
                <img
                  src={filePreview}
                  alt="School ID"
                  className="avatar-image"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="avatar-placeholder">
                  {user.full_name
                    ? user.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()
                    : "U"}
                </div>
              )}
            </div>
          </div>

          <div className="user-info">
            <h2>{user.full_name}</h2>
            <p className="role">{user.position}</p>
            <div className="meta-info">
              <span className="meta-item">
                <Calendar size={14} />
                Joined {new Date(user.created_at).toLocaleDateString()} (
                {calculateAccountAge()})
              </span>
              <span className="meta-item">
                <Clock size={14} />
                Last active:{" "}
                {user.last_login
                  ? new Date(user.last_login).toLocaleString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <User size={16} />
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === "activity" ? "active" : ""}`}
            onClick={() => setActiveTab("activity")}
          >
            <Activity size={16} />
            Activity
          </button>
          <button
            className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <Shield size={16} />
            Security
          </button>
          <button
            className={`tab-btn ${
              activeTab === "notifications" ? "active" : ""
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell size={16} />
            Notifications
          </button>
          <button
            className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={16} />
            Settings
          </button>
        </div>
        <div className="profile-content">
          {activeTab === "overview" && (
            <div className="overview-section">
              <div className="info-card">
                <h3 className="card-title">Personal Information</h3>
                <div className="info-item">
                  <Mail size={18} className="info-icon" />
                  <div>
                    <h4>Email</h4>
                    <p>{user.email}</p>
                  </div>
                </div>
                <div className="info-item">
                  <User size={18} className="info-icon" />
                  <div>
                    <h4>Full Name</h4>
                    <p>{user.full_name}</p>
                  </div>
                </div>
                <div className="info-item">
                  <Settings size={18} className="info-icon" />
                  <div>
                    <h4>Role/Position</h4>
                    <p>{user.position}</p>
                  </div>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stats-card">
                  <div className="stats-header">
                    <BarChart2 size={18} />
                    <h3>Quick Stats</h3>
                  </div>
                  <div className="stats-content">
                    <div className="stat-item">
                      <div className="stat-value">24</div>
                      <div className="stat-label">Reports created</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">8</div>
                      <div className="stat-label">Alerts resolved</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">97%</div>
                      <div className="stat-label">System uptime</div>
                    </div>
                  </div>
                </div>

                <div className="stats-card">
                  <div className="stats-header">
                    <Activity size={18} />
                    <h3>Recent Activity</h3>
                  </div>
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="activity-dot success"></div>
                      <div className="activity-content">
                        <p>Completed water quality report</p>
                        <span>2 hours ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-dot warning"></div>
                      <div className="activity-content">
                        <p>Responded to pH level alert</p>
                        <span>5 hours ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-dot"></div>
                      <div className="activity-content">
                        <p>Logged in from new device</p>
                        <span>1 day ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="activity-section">
              <div className="activity-header">
                <h2>Your Activity</h2>
                <div className="time-range-selector">
                  <button
                    className={`time-btn ${
                      timeRange === "week" ? "active" : ""
                    }`}
                    onClick={() => setTimeRange("week")}
                  >
                    Week
                  </button>
                  <button
                    className={`time-btn ${
                      timeRange === "month" ? "active" : ""
                    }`}
                    onClick={() => setTimeRange("month")}
                  >
                    Month
                  </button>
                  <button
                    className={`time-btn ${
                      timeRange === "year" ? "active" : ""
                    }`}
                    onClick={() => setTimeRange("year")}
                  >
                    Year
                  </button>
                </div>
              </div>
              <div className="chart-card">
                <h3 className="chart-title">Activity Overview</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="reports"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="alerts"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="resolved"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color blue"></div>
                    <span>Reports Created</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color red"></div>
                    <span>Alerts Triggered</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color green"></div>
                    <span>Alerts Resolved</span>
                  </div>
                </div>
              </div>
              <div className="export-section">
                <h3>Export Activity Data</h3>
                <p>
                  Download your complete activity history for analysis or record
                  keeping.
                </p>
                <div className="export-options">
                  <button className="export-btn">
                    <Download size={16} />
                    CSV Format
                  </button>
                  <button className="export-btn">
                    <Download size={16} />
                    PDF Report
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="security-section">
              <div className="security-card">
                <div className="security-header">
                  <Key size={18} />
                  <h3>Change Password</h3>
                </div>
                <div className="password-form">
                  <div className="form-group">
                    <label>Current Password</label>
                    <div className="password-input">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="current"
                        value={passwordData.current}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                      />
                      <button
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <div className="password-input">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="new"
                        value={passwordData.new}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                      />
                      <div className="password-strength">
                        <div
                          className={`strength-bar ${
                            passwordData.new.length > 0 ? "weak" : ""
                          } ${passwordData.new.length > 8 ? "medium" : ""} ${
                            passwordData.new.length > 12 ? "strong" : ""
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <div className="password-input">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirm"
                        value={passwordData.confirm}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                      />
                    </div>
                    <button
                      onClick={handlePasswordSave}
                      className="save-password-btn"
                      disabled={
                        !passwordData.current ||
                        !passwordData.new ||
                        !passwordData.confirm ||
                        passwordLoading
                      }
                    >
                      {passwordLoading ? "Saving..." : "Change Password"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="security-card">
                <div className="security-header">
                  <Lock size={18} />
                  <h3>Active Sessions</h3>
                </div>
                {sessions.map((session) => (
                  <div
                    className={
                      "session-item" + (session.current ? " current" : "")
                    }
                    key={session.id}
                  >
                    <div className="session-info">
                      <div className="session-device">
                        <span className="device-icon">
                          {session.device.includes("iPhone") ? "📱" : "💻"}
                        </span>
                        {session.device}
                      </div>
                      <div className="session-details">
                        <span>{session.location}</span>
                        <span className="session-status">
                          {session.last_active}
                        </span>
                      </div>
                    </div>
                    <button
                      className="logout-btn"
                      onClick={handleLogout}
                      disabled={session.current}
                      title={
                        session.current
                          ? "This is your current session"
                          : "Logout session"
                      }
                    >
                      Log Out
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="notifications-section">
              <div className="notification-card">
                <div className="notification-header">
                  <Bell size={18} />
                  <h3>Notification Preferences</h3>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <div className="notification-icon">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4>Email Alerts</h4>
                      <p>Receive important system notifications via email</p>
                    </div>
                  </div>
                  <label className="toggle-switch large">
                    <input
                      type="checkbox"
                      checked={notifications.emailAlerts}
                      onChange={() => toggleNotification("emailAlerts")}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <div className="notification-icon">
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <h4>SMS Alerts</h4>
                      <p>Get critical alerts as text messages</p>
                    </div>
                  </div>
                  <label className="toggle-switch large">
                    <input
                      type="checkbox"
                      checked={notifications.smsAlerts}
                      onChange={() => toggleNotification("smsAlerts")}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <div className="notification-icon">
                      <Bell size={20} />
                    </div>
                    <div>
                      <h4>Push Notifications</h4>
                      <p>Instant alerts on your mobile devices</p>
                    </div>
                  </div>
                  <label className="toggle-switch large">
                    <input
                      type="checkbox"
                      checked={notifications.pushNotifications}
                      onChange={() => toggleNotification("pushNotifications")}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="notification-card">
                <div className="notification-header">
                  <AlertCircle size={18} />
                  <h3>Alert Preferences</h3>
                </div>
                <div className="alert-preference">
                  <h4>Critical Alerts</h4>
                  <p>Configure how you receive critical water quality alerts</p>
                  <div className="alert-options">
                    <label className="alert-option">
                      <input
                        type="radio"
                        name="critical-alerts"
                        checked={notifications.criticalAlerts === "all"}
                        onChange={() =>
                          setNotifications({
                            ...notifications,
                            criticalAlerts: "all",
                          })
                        }
                      />
                      <div className="option-content">
                        <h5>All critical alerts</h5>
                        <p>
                          Immediate notifications for all threshold violations
                        </p>
                      </div>
                    </label>
                    <label className="alert-option">
                      <input
                        type="radio"
                        name="critical-alerts"
                        checked={notifications.criticalAlerts === "working"}
                        onChange={() =>
                          setNotifications({
                            ...notifications,
                            criticalAlerts: "working",
                          })
                        }
                      />
                      <div className="option-content">
                        <h5>Only during working hours</h5>
                        <p>8:00 AM - 6:00 PM, Monday to Friday</p>
                      </div>
                    </label>
                    <label className="alert-option">
                      <input
                        type="radio"
                        name="critical-alerts"
                        checked={notifications.criticalAlerts === "custom"}
                        onChange={() =>
                          setNotifications({
                            ...notifications,
                            criticalAlerts: "custom",
                          })
                        }
                      />
                      <div className="option-content">
                        <h5>Custom schedule</h5>
                        <p>Set your own notification hours</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="settings-section">
              <div className="settings-card danger-zone">
                <h3>Danger Zone</h3>
                <div className="danger-item">
                  <div>
                    <h4>Delete Account</h4>
                    <p>
                      Permanently remove your account and all associated data
                    </p>
                  </div>
                  <button
                    className="danger-btn"
                    onClick={async () => {
                      // Delete user from DB
                      const { error } = await supabase
                        .from("users")
                        .delete()
                        .eq("id", user.id);
                      if (error) {
                        showToast("Failed to delete account", "error");
                        return;
                      }
                      localStorage.removeItem("authToken");
                      localStorage.removeItem("user");
                      showToast("Account deleted");
                      setTimeout(() => navigate("/"), 1500);
                    }}
                  >
                    Delete Account
                  </button>
                </div>
                <div className="danger-item">
                  <div>
                    <h4>Export All Data</h4>
                    <p>Download a copy of all your data before deletion</p>
                  </div>
                  <button
                    className="danger-btn outline"
                    onClick={() => {
                      // Download JSON user info (demo)
                      const dataStr =
                        "data:text/json;charset=utf-8," +
                        encodeURIComponent(JSON.stringify(user, null, 2));
                      const dlAnchorElem = document.createElement("a");
                      dlAnchorElem.setAttribute("href", dataStr);
                      dlAnchorElem.setAttribute(
                        "download",
                        `user_${user.id}_data.json`
                      );
                      document.body.appendChild(dlAnchorElem);
                      dlAnchorElem.click();
                      dlAnchorElem.remove();
                    }}
                  >
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Dark mode toggle for preferences
  function isDarkMode() {
    return document.body.classList.contains("dark-mode");
  }
  function toggleDark() {
    if (isDarkMode()) {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "false");
    } else {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "true");
    }
  }
};

export default Profile;
