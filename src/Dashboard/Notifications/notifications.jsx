import React from "react";
import { useNavigate } from "react-router-dom";
import phIcon from "../../assets/ph_icon.png";
import turbidityIcon from "../../assets/turbidity_icon.png";
import criticalIcon from "../../assets/critical_icon.png";
import "./notifications.css"; // You can style as needed

const NotificationsPage = () => {
  const navigate = useNavigate();

  const notifications = {
    Today: [
      {
        title: "pH Level Alert",
        value: "9.2",
        time: "11:00 PM",
        icon: phIcon,
      },
    ],
    Yesterday: [
      {
        title: "Turbidity Alert",
        value: "7.5 NTU",
        time: "10:30 PM",
        icon: turbidityIcon,
      },
    ],
    Wednesday: [
      {
        title: "Critical Alert",
        value: "Water flow shut off",
        time: "8:15 AM",
        icon: criticalIcon,
      },
    ],
    Tuesday: [
      {
        title: "pH Level Alert",
        value: "9.2",
        time: "11:00 PM",
        icon: phIcon,
      },
      {
        title: "pH Level Alert",
        value: "9.2",
        time: "11:00 PM",
        icon: phIcon,
      },
    ],
    Monday: [
      {
        title: "Turbidity Alert",
        value: "7.5 NTU",
        time: "10:30 PM",
        icon: turbidityIcon,
      },
    ],
  };

  return (
    <div
      className="notifications-page"
      style={{ backgroundColor: "white", minHeight: "100vh" }}
    >
      <div
        className="app-bar"
        style={{ display: "flex", alignItems: "center", padding: "20px" }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: "#fff",
            borderRadius: "50%",
            border: "none",
            width: "40px",
            height: "40px",
            marginRight: "16px",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: "20px", color: "#3CC7F5" }}>{"←"}</span>
        </button>
        <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>Notifications</h1>
      </div>

      <div style={{ padding: "16px" }}>
        {Object.keys(notifications).map((day) => (
          <div key={day}>
            <div
              style={{
                backgroundColor: "#f3f3f3",
                padding: "8px 12px",
                borderRadius: "8px",
                width: "fit-content",
                fontWeight: "700",
              }}
            >
              {day}
            </div>
            <div style={{ marginTop: "8px", marginBottom: "16px" }}>
              {notifications[day].map((note, index) => (
                <NotificationCard
                  key={index}
                  title={note.title}
                  value={note.value}
                  time={note.time}
                  icon={note.icon}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const NotificationCard = ({ title, value, time, icon }) => {
  const isCritical = title === "Critical Alert";

  return (
    <div
      className="notification-card"
      style={{
        backgroundColor: "#f3f3f3",
        borderRadius: "15px",
        padding: "12px",
        marginBottom: "10px",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <img
        src={icon}
        alt={title}
        style={{ width: "40px", marginRight: "12px" }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: "bold" }}>{title}</div>
        <div style={{ fontSize: "12px" }}>
          {isCritical ? (
            <span style={{ color: "red" }}>{value}</span>
          ) : (
            <>
              Out of range: <span style={{ color: "red" }}>{value}</span>.
              Please investigate.
            </>
          )}
        </div>
      </div>
      <div style={{ color: "#666", fontSize: "12px" }}>{time}</div>
    </div>
  );
};

export default NotificationsPage;
