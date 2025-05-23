import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignupClick = () => {
    navigate("/signupone");
  };

  return (
    <nav className="navbar">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
      <div className="navbar-logos">AquaGuardian</div>
      <div className="navbar-auth">
        <ul className="navbar-links">
          <li>
            <a href="#hero">Features</a>
          </li>
          <li>
            <a href="#monitor">How it works</a>
          </li>

          <li>
            <a href="#why">Contact</a>
          </li>
        </ul>
        <button className="login-btn" onClick={handleLoginClick}>
          Login
        </button>
        <button className="signup-btn" onClick={handleSignupClick}>
          Signup
        </button>
      </div>
    </nav>
  );
}
