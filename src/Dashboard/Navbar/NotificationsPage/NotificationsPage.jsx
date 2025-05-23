import React, { useState, useEffect } from "react";
import {
  Bell,
  Check,
  AlertTriangle,
  Info,
  Settings,
  Clock,
  Download,
} from "lucide-react";
import "./NotificationsPage.css";

const NotificationsPage = () => {
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

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  // Mark single notification as read
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Filter notifications based on active filter
  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !notification.read;
    return notification.type === activeFilter;
  });

  // Get icon based on notification type
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

  return (
    <div className="notifications-container">
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
          className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          All
        </button>
        <button
          className={`filter-btn ${activeFilter === "unread" ? "active" : ""}`}
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
          className={`filter-btn ${activeFilter === "warning" ? "active" : ""}`}
          onClick={() => setActiveFilter("warning")}
        >
          Warnings
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-notifications">
            <Bell size={32} className="text-gray-400" />
            <p>No {activeFilter === "all" ? "" : activeFilter} notifications</p>
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
  );
};

export default NotificationsPage;
