import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bell, AlertTriangle, Info, Settings, Clock } from "lucide-react";
import { supabase } from "../../utils/supabaseClient"; // Adjust path as needed
import "../Navbar/AdminNavbar.css";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isNotificationDropdownVisible, setIsNotificationDropdownVisible] =
    useState(false);
  const [isProfileDropdownVisible, setIsProfileDropdownVisible] =
    useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [user, setUser] = useState(null);

  // Notifications will be dynamically loaded from pending verifications
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  // Fetch pending verifications from Supabase and show as notifications
  useEffect(() => {
    const fetchPending = async () => {
      // Fetch pending verifications (adjust table/fields as needed)
      const { data, error } = await supabase
        .from("users")
        .select("id,full_name,email,school_name,created_at")
        .eq("status", "pending");

      if (data && Array.isArray(data)) {
        const pendingNotifications = data.map((item) => ({
          id: item.id,
          type: "warning",
          title: "Pending Verification",
          message: `${item.full_name || item.email} (${
            item.school_name || "No School"
          }) requested verification.`,
          time: item.created_at
            ? timeAgo(new Date(item.created_at))
            : "A moment ago",
          read: false,
          action: "/userverification",
        }));
        setNotifications(pendingNotifications);
      }
    };

    fetchPending();
  }, []);

  // Helper: Time ago formatting
  function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".ad-profile-dropdown-wrapper") &&
        !event.target.closest(".ad-notification-dropdown")
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

    // Load user info from localStorage (must be set at login)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
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
    setIsProfileDropdownVisible(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownVisible((prev) => !prev);
    setIsNotificationDropdownVisible(false);
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
    <nav className={`ad-navbars ${isDarkMode ? "dark-mode" : ""}`}>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
      <div className="ad-navbar-inner">
        {/* LEFT: Logo */}
        <div className="ad-navbar-left">
          <Link to="/dashboard" className="ad-logo-link">
            <i className="fas fa-water ad-water-icon"></i>
            <span className="ad-title">AquaGuardian</span>
          </Link>
        </div>

        {/* RIGHT: Time, Dark Mode, Notification, Profile */}
        <div className="ad-navbar-right">
          <span className="ad-time">{currentTime.toLocaleTimeString()}</span>

          <button
            className="ad-theme-toggle"
            onClick={toggleDarkMode}
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <i className={isDarkMode ? "fas fa-sun" : "fas fa-moon"}></i>
          </button>

          {/* Notification Bell Icon */}
          <button
            className="ad-notification-button"
            onClick={toggleNotificationDropdown}
            aria-label="Notifications"
          >
            <Bell size={24} />
            {unreadNotifications > 0 && (
              <span className="ad-notification-badge">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationDropdownVisible && (
            <div className="ad-notification-dropdown">
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
                            <Link
                              to={notification.action}
                              className="notification-action"
                            >
                              View details
                            </Link>
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
          <div className="ad-profile-dropdown-wrapper">
            <button
              className="ad-profile-button"
              onClick={toggleProfileDropdown}
            >
              <div className="ad-profile-avatar">
                {user
                  ? getInitials(user.full_name || user.name || user.email)
                  : "A"}
              </div>
              <span className="ad-username">
                {user
                  ? user.full_name ||
                    user.name ||
                    user.username ||
                    (user.email ? user.email.split("@")[0] : "Admin")
                  : "Admin"}
              </span>
            </button>

            {/* Profile Dropdown */}
            {isProfileDropdownVisible && (
              <div className="ad-profile-dropdown">
                <div className="ad-user-details">
                  <div className="ad-profile-avatar">
                    {user
                      ? getInitials(user.full_name || user.name || user.email)
                      : "A"}
                  </div>
                  <div className="ad-nana">
                    <p className="ad-user-name">
                      {user
                        ? user.full_name ||
                          user.name ||
                          user.username ||
                          (user.email ? user.email.split("@")[0] : "Admin")
                        : "Admin"}
                    </p>
                    <p className="ad-user-position">
                      {user ? user.position || user.role || "Admin" : "Admin"}
                    </p>
                    <p className="ad-user-email">{user ? user.email : ""}</p>
                  </div>
                </div>
                <hr className="ad-dropdown-divider" />
                <button
                  onClick={handleLogout}
                  className="ad-dropdown-item logout"
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

export default AdminNavbar;
