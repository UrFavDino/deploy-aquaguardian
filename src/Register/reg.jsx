import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./reg.css";

const Signup = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleNext = () => {
    setError({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    let isValid = true;
    const newError = {};

    if (!fullName) {
      newError.fullName = "Full Name is required.";
      isValid = false;
    } else if (fullName.trim().length < 2) {
      newError.fullName = "Full Name must be at least two characters.";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(fullName)) {
      newError.fullName = "Full Name must contain only letters and spaces.";
      isValid = false;
    } else {
      const nameParts = fullName.trim().split(/\s+/);
      if (nameParts.length < 2) {
        newError.fullName =
          "Please enter your full name (first and last name).";
        isValid = false;
      }
    }

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
    } else if (password.length < 6) {
      newError.password = "Password must be at least 6 characters.";
      isValid = false;
    } else if (!/[A-Z]/.test(password)) {
      newError.password =
        "Password must contain at least one uppercase letter.";
      isValid = false;
    }

    if (!confirmPassword) {
      newError.confirmPassword = "Confirm Password is required.";
      isValid = false;
    } else if (password !== confirmPassword) {
      newError.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    if (!isValid) {
      setError(newError);
      return;
    }

    // Pass data to next step using state
    navigate("/signuptwo", {
      state: {
        fullName,
        email,
        password,
      },
    });
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="signup">
      <div className="signup__header">
        <h1 className="signup__logo">AquaGuardian</h1>
        <p className="signup__tagline">
          Ensure safe and efficient water usage in your educational facilities
          <br />
          with AquaTrack's comprehensive monitoring system. Real-time data,
          <br />
          advanced analytics, and actionable insights.
        </p>

        <div className="signup__features">
          <div className="signup__feature-buttons">
            <button className="signup__btn-feature">
              Real-time Monitoring
            </button>
            <button className="signup__btn-feature">Instant Alerts</button>
            <button className="signup__btn-feature">Quality Analysis</button>
          </div>
          <div className="signup__consumption-report">
            <button className="signup__btn-feature">Consumption Reports</button>
          </div>
        </div>
      </div>
      <hr className="signup__divider" />

      <div className="signup__form-container">
        <div className="signup__form-text">
          <h2 className="signup__form-title">Create Your Account</h2>
          <p className="signup__form-step">Step 1 of 2: Basic Information</p>
        </div>

        <form className="signup__form" onSubmit={(e) => e.preventDefault()}>
          <div className="signup__form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              className="signup__input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {error.fullName && (
              <p className="signup__error-message">{error.fullName}</p>
            )}
          </div>

          <div className="signup__form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="signup__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error.email && (
              <p className="signup__error-message">{error.email}</p>
            )}
          </div>

          <div className="signup__form-group signup__password-wrapper">
            <label htmlFor="password">Password</label>
            <div className="signup__password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className="signup__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            {error.password && (
              <p className="signup__error-message">{error.password}</p>
            )}
          </div>

          <div className="signup__form-group signup__password-wrapper">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="signup__password-input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                className="signup__input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? "🙈" : "👁"}
              </button>
            </div>
            {error.confirmPassword && (
              <p className="signup__error-message">{error.confirmPassword}</p>
            )}
          </div>
          <button
            type="button"
            className="signup__btn-submit"
            onClick={handleNext}
          >
            Next
          </button>
        </form>

        <p className="signup__login-text">
          Already have an account?{" "}
          <span className="signup__login-link" onClick={handleLogin}>
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
