import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "react-feather";
import { supabase } from "../utils/supabaseClient"; // Make sure this path is correct!
import "./login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({
    email: "",
    password: "",
    general: "",
  });

  const handleLogin = async () => {
    setError({
      email: "",
      password: "",
      general: "",
    });

    // Field validation
    let isValid = true;
    const newError = {};

    if (!email) {
      newError.email = "Email Address is required.";
      isValid = false;
    } else if (!email.includes("@")) {
      newError.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!password) {
      newError.password = "Password is required.";
      isValid = false;
    }

    if (!isValid) {
      setError(newError);
      return;
    }

    // Query Supabase users table for approved account
    const { data, error: dbError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password) // NOTE: For production, always hash passwords!
      .eq("review_status", "approved")
      .single();

    if (dbError || !data) {
      setError({
        email: "",
        password: "",
        general: "Invalid credentials or your account is not approved.",
      });
      return;
    }

    // Store user info in localStorage for session (optional)
    localStorage.setItem("user", JSON.stringify(data));

    // Navigate to dashboard
    navigate("/dashboard");
  };

  const handleSignup = () => {
    navigate("/signupone");
  };

  return (
    <div className="login">
      <div className="login__header">
        <h1 className="login__logo">AquaGuardian</h1>
        <p className="login__tagline">
          Ensure safe and efficient water usage in your educational facilities
          <br />
          with AquaTrack's comprehensive monitoring system. Real-time data,
          <br />
          advanced analytics, and actionable insights.
        </p>

        <div className="login__features">
          <div className="login__feature-buttons">
            <button className="login__btn-feature">Real-time Monitoring</button>
            <button className="login__btn-feature">Instant Alerts</button>
            <button className="login__btn-feature">Quality Analysis</button>
          </div>
          <div className="login__consumption-report">
            <button className="login__btn-feature">Consumption Reports</button>
          </div>
        </div>
      </div>
      <hr className="login__divider" />

      <div className="login__form-container">
        <div className="login__form-text">
          <h2 className="login__form-title">Login</h2>
          <p className="login__form-step">
            Enter your credentials to access your account
          </p>
        </div>

        <form className="login__form" onSubmit={(e) => e.preventDefault()}>
          <div className="login__form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="login__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error.email && (
              <p className="login__error-message">{error.email}</p>
            )}
          </div>

          <div className="login__form-group login__password-wrapper">
            <label htmlFor="password">Password</label>
            <div className="login__password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="login__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error.password && (
              <p className="login__error-message">{error.password}</p>
            )}
          </div>

          {error.general && (
            <p className="login__error-message">{error.general}</p>
          )}

          <button
            type="button"
            className="login__btn-submit"
            onClick={handleLogin}
          >
            Login
          </button>
        </form>

        <p className="login__signup-text">
          Don't have an account?{" "}
          <span className="login__signup-link" onClick={handleSignup}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
