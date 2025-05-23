import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Bell,
  Check,
  AlertTriangle,
  Info,
  Settings,
  Clock,
  Download,
} from "lucide-react";
import "../Navbar/dh_navbar.css";

const DhNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isNotificationDropdownVisible, setIsNotificationDropdownVisible] =
    useState(false);
  const [isProfileDropdownVisible, setIsProfileDropdownVisible] =
    useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "critical",
      title: "pH Level Alert",
      message: "pH level exceeded threshold (8.6) at Location A",
      time: "2 minutes ago",
      read: false,
      action: "/location/A",
    },
    {
      id: 2,
      type: "warning",
      title: "Sensor Maintenance Due",
      message: "Turbidity sensor at Location B requires calibration",
      time: "1 hour ago",
      read: false,
      action: "/sensors/B",
    },
    {
      id: 3,
      type: "info",
      title: "Weekly Report Generated",
      message: "Your weekly water quality report is ready",
      time: "5 hours ago",
      read: true,
      action: "/reports/weekly",
    },
    {
      id: 4,
      type: "system",
      title: "System Update Available",
      message: "New version v2.3.1 is ready to install",
      time: "1 day ago",
      read: true,
      action: "/settings/updates",
    },
  ]);
  const [activeFilter, setActiveFilter] = useState("all");

  // User info from localStorage
  const [user, setUser] = useState({
    full_name: "",
    email: "",
  });

  useEffect(() => {
    // Fetch user info from localStorage (set at login)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        setUser({
          full_name:
            userObj.full_name ||
            userObj.name ||
            userObj.username ||
            userObj.email?.split("@")[0] ||
            "",
          email: userObj.email || "",
        });
      } catch {
        setUser({ full_name: "", email: "" });
      }
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".dh-profile-dropdown-wrapper") &&
        !event.target.closest(".dh-notification-dropdown")
      ) {
        setIsProfileDropdownVisible(false);
        setIsNotificationDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    const storedDarkMode = localStorage.getItem("darkMode") === "true";
    if (storedDarkMode) {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    }

    return () => {
      clearInterval(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUnreadNotifications = () => {
      const unreadCount = notifications.filter((n) => !n.read).length;
      setUnreadNotifications(unreadCount);
    };

    fetchUnreadNotifications();
    const interval = setInterval(fetchUnreadNotifications, 30000);
    return () => clearInterval(interval);
  }, [notifications]);

  const toggleNotificationDropdown = () => {
    setIsNotificationDropdownVisible((prev) => !prev);
    setIsProfileDropdownVisible(false); // Close profile dropdown when opening notification dropdown
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownVisible((prev) => !prev);
    setIsNotificationDropdownVisible(false); // Close notification dropdown when opening profile dropdown
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "critical":
        return <AlertTriangle size={18} className="text-red-500" />;
      case "warning":
        return <AlertTriangle size={18} className="text-yellow-500" />;
      case "info":
        return <Info size={18} className="text-blue-500" />;
      case "system":
        return <Settings size={18} className="text-purple-500" />;
      default:
        return <Info size={18} className="text-gray-500" />;
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !notification.read;
    return notification.type === activeFilter;
  });

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", newMode);
  };

  // Helper for avatar initials
  function getInitials(nameOrEmail) {
    if (!nameOrEmail) return "A";
    const words = nameOrEmail.trim().split(" ");
    if (words.length === 1) {
      if (nameOrEmail.includes("@")) return nameOrEmail[0].toUpperCase();
      return nameOrEmail.slice(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  return (
    <nav className={`dh-navbars ${isDarkMode ? "dark-mode" : ""}`}>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
      <div className="dh-navbar-inner">
        {/* LEFT: Logo */}
        <div className="dh-navbar-left">
          <Link to="/dashboard" className="dh-logo-link">
            <i className="fas fa-water dh-water-icon"></i>
            <span className="dh-title">AquaGuardian</span>
          </Link>
        </div>

        {/* CENTER: Navigation Links */}
        <div className="dh-navbar-center">
          <Link
            to="/dashboard"
            className={`dh-nav-link ${
              location.pathname === "/dashboard" ? "active" : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/history"
            className={`dh-nav-link ${
              location.pathname === "/history" ? "active" : ""
            }`}
          >
            History
          </Link>
          <Link
            to="/reports"
            className={`dh-nav-link ${
              location.pathname === "/reports" ? "active" : ""
            }`}
          >
            Reports
          </Link>
        </div>

        {/* RIGHT: Time, Dark Mode, Notification, Profile */}
        <div className="dh-navbar-right">
          <span className="dh-time">{currentTime.toLocaleTimeString()}</span>

          <button
            className="dh-theme-toggle"
            onClick={toggleDarkMode}
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <i className={isDarkMode ? "fas fa-sun" : "fas fa-moon"}></i>
          </button>

          {/* Notification Bell Icon */}
          <button
            className="dh-notification-button"
            onClick={toggleNotificationDropdown}
            aria-label="Notifications"
          >
            <Bell size={24} />
            {unreadNotifications > 0 && (
              <span className="dh-notification-badge">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationDropdownVisible && (
            <div className="dh-notification-dropdown">
              <div className="notifications-header">
                <h2>Notifications</h2>
                <div className="notification-actions">
                  <button
                    onClick={markAllAsRead}
                    className="mark-all-read"
                    disabled={notifications.every((n) => n.read)}
                  >
                    Mark all as read
                  </button>
                </div>
              </div>

              <div className="notification-filters">
                <button
                  className={`filter-btn ${
                    activeFilter === "all" ? "active" : ""
                  }`}
                  onClick={() => setActiveFilter("all")}
                >
                  All
                </button>
                <button
                  className={`filter-btn ${
                    activeFilter === "unread" ? "active" : ""
                  }`}
                  onClick={() => setActiveFilter("unread")}
                >
                  Unread
                </button>
                <button
                  className={`filter-btn ${
                    activeFilter === "critical" ? "active" : ""
                  }`}
                  onClick={() => setActiveFilter("critical")}
                >
                  Critical
                </button>
                <button
                  className={`filter-btn ${
                    activeFilter === "warning" ? "active" : ""
                  }`}
                  onClick={() => setActiveFilter("warning")}
                >
                  Warnings
                </button>
              </div>

              <div className="notifications-list">
                {filteredNotifications.length === 0 ? (
                  <div className="empty-notifications">
                    <Bell size={32} className="text-gray-400" />
                    <p>
                      No {activeFilter === "all" ? "" : activeFilter}{" "}
                      notifications
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${
                        !notification.read ? "unread" : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="notification-icon">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="notification-content">
                        <h4>{notification.title}</h4>
                        <p>{notification.message}</p>
                        <div className="notification-meta">
                          <span className="notification-time">
                            <Clock size={14} /> {notification.time}
                          </span>
                          {notification.action && (
                            <a
                              href={notification.action}
                              className="notification-action"
                            >
                              View details
                            </a>
                          )}
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="notification-status">
                          <span className="unread-dot"></span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Profile Button */}
          <div className="dh-profile-dropdown-wrapper">
            <button
              className="dh-profile-button"
              onClick={toggleProfileDropdown}
            >
              <div className="dh-profile-avatar">
                {getInitials(user.full_name || user.email)}
              </div>
              <span className="dh-username">
                {user.full_name || user.email || "User"}
              </span>
            </button>

            {/* Profile Dropdown */}
            {isProfileDropdownVisible && (
              <div className="dh-profile-dropdown">
                <div className="dh-user-details">
                  <div className="dh-profile-avatar">
                    {getInitials(user.full_name || user.email)}
                  </div>
                  <div className="dh-nana">
                    <p className="dh-user-name">
                      {user.full_name || user.email || "User"}
                    </p>
                    <p className="dh-user-email">{user.email}</p>
                  </div>
                </div>
                <hr className="dh-dropdown-divider" />
                <Link to="/profile" className="dh-dropdown-item">
                  <i className="fas fa-user"></i> Profile
                </Link>
                <Link to="/setting" className="dh-dropdown-item">
                  <i className="fas fa-cog"></i> Settings
                </Link>
                <Link to="/help" className="dh-dropdown-item">
                  <i className="fas fa-question-circle"></i> Help & Support
                </Link>
                <hr className="dh-dropdown-divider" />
                <button
                  onClick={handleLogout}
                  className="dh-dropdown-item logout"
                >
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DhNavbar;
