import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";
import "./reg2.css";

const Signup2 = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get data from step 1
  const { fullName, email, password } = location.state || {};

  const [schoolName, setSchoolName] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [position, setPosition] = useState("");
  const [schoolIdFile, setSchoolIdFile] = useState(null);

  const [schoolNameError, setSchoolNameError] = useState("");
  const [schoolAddressError, setSchoolAddressError] = useState("");
  const [positionError, setPositionError] = useState("");
  const [schoolIdError, setSchoolIdError] = useState("");
  const [supabaseError, setSupabaseError] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);

  if (!fullName || !email || !password) {
    // If no state, redirect to signup
    navigate("/signup");
    return null;
  }

  const handleSignup = async () => {
    let valid = true;

    setSchoolNameError("");
    setSchoolAddressError("");
    setPositionError("");
    setSchoolIdError("");
    setSupabaseError("");

    if (!schoolName.trim()) {
      setSchoolNameError("School name is required.");
      valid = false;
    } else if (schoolName.trim().length < 2) {
      setSchoolNameError("School name must be at least two characters.");
      valid = false;
    } else if (!/^[a-zA-Z0-9\s&'-.]+$/.test(schoolName)) {
      setSchoolNameError(
        "School name can only contain letters, numbers, spaces, and these symbols: & ' - ."
      );
      valid = false;
    }

    if (!schoolAddress.trim()) {
      setSchoolAddressError("School address is required.");
      valid = false;
    } else if (schoolAddress.trim().length < 2) {
      setSchoolAddressError("School address must be at least two characters.");
      valid = false;
    } else if (!/^[a-zA-Z0-9\s,'#-.]+$/.test(schoolAddress)) {
      setSchoolAddressError(
        "School address can only contain letters, numbers, spaces, and these symbols: , ' # - ."
      );
      valid = false;
    }

    if (!position) {
      setPositionError("Please select a position.");
      valid = false;
    }
    if (!schoolIdFile) {
      setSchoolIdError("Please attach your School ID.");
      valid = false;
    }

    if (!valid) return;

    setLoading(true);

    // 1. Upload file to Supabase Storage
    let schoolIdUrl = null;
    if (schoolIdFile) {
      const { data: fileData, error: fileError } = await supabase.storage
        .from("school-ids")
        .upload(`pending_${Date.now()}_${schoolIdFile.name}`, schoolIdFile);

      if (fileError) {
        setSupabaseError("Failed to upload file: " + fileError.message);
        setLoading(false);
        return;
      } else {
        const { data: urlData } = supabase.storage
          .from("school-ids")
          .getPublicUrl(fileData.path);
        schoolIdUrl = urlData.publicUrl;
      }
    }

    // 2. Insert into users table (pending status)
    const { error: dbError } = await supabase.from("users").insert([
      {
        full_name: fullName,
        email,
        password, // Store encrypted or hashed in production!
        position,
        school_name: schoolName,
        school_address: schoolAddress,
        school_id_url: schoolIdUrl,
        review_status: "pending",
      },
    ]);

    if (dbError) {
      setSupabaseError("Failed to save profile: " + dbError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setShowModal(true); // Show modal instead of navigating directly to login
  };

  const handleFileChange = (e) => {
    setSchoolIdFile(e.target.files[0]);
  };

  const closeModal = () => {
    setShowModal(false);
    navigate("/login");
  };

  return (
    <div className="signup2">
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
      <hr className="signup2__divider" />
      <div className="signup2__form-container">
        <div className="signup2__form-text">
          <h2 className="signup2__form-title">Create Your Account</h2>
          <p className="signup2__form-step">Step 2 of 2: School Information</p>
        </div>
        <form className="signup2__form" onSubmit={(e) => e.preventDefault()}>
          <div className="signup2__form-group">
            <label htmlFor="schoolName">School Name</label>
            <input
              type="text"
              id="schoolName"
              placeholder="Enter your school name"
              className="signup2__input"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
            />
            {schoolNameError && (
              <p className="signup2__error-message">{schoolNameError}</p>
            )}
          </div>
          <div className="signup2__form-group">
            <label htmlFor="schoolAddress">School Address</label>
            <input
              type="text"
              id="schoolAddress"
              placeholder="Enter your school address"
              className="signup2__input"
              value={schoolAddress}
              onChange={(e) => setSchoolAddress(e.target.value)}
            />
            {schoolAddressError && (
              <p className="signup2__error-message">{schoolAddressError}</p>
            )}
          </div>
          <div className="signup2__form-group">
            <label htmlFor="position">Select Position</label>
            <select
              id="position"
              className="signup2__input__select"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            >
              <option value="">-- Select Position --</option>
              <option value="Administrator">Administrator</option>
              <option value="Canteen Staff">Canteen Staff</option>
              <option value="Janitor">Janitor</option>
              <option value="Maintenance Staff">Maintenance Staff</option>
            </select>
            {positionError && (
              <p className="signup2__error-message">{positionError}</p>
            )}
          </div>
          <div className="signup2__form-group">
            <label htmlFor="schoolId">Attach Your School ID</label>
            <input
              type="file"
              id="schoolId"
              accept=".jpg, .jpeg, .png, .pdf"
              className="signup2__file-input"
              onChange={handleFileChange}
            />
            {schoolIdFile && (
              <p className="signup2__file-name">
                Selected file: {schoolIdFile.name}
              </p>
            )}
            {schoolIdError && (
              <p className="signup2__error-message">{schoolIdError}</p>
            )}
          </div>
          {supabaseError && (
            <p className="signup2__error-message">{supabaseError}</p>
          )}

          <button
            type="button"
            className="signup2__btn-submit"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </form>
        <p className="signup2__login-text">
          Already have an account?{" "}
          <span
            className="signup2__login-link"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 380 }}>
            <h2
              style={{
                marginBottom: "10px",
                color: "#2563eb",
                textAlign: "center",
              }}
            >
              Your account is under review
            </h2>
            <p style={{ textAlign: "center", marginBottom: "20px" }}>
              You can attempt to log in again later.
              <br />
              Thank you for registering!
            </p>
            <button
              className="signup2__btn-submit"
              onClick={closeModal}
              style={{ margin: "0 auto", display: "block" }}
            >
              OK
            </button>
          </div>
          <style>
            {`
            .modal-overlay {
              position: fixed;
              top: 0; left: 0; right: 0; bottom: 0;
              background: rgba(30, 41, 59, 0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 9999;
            }
            .modal {
              background: #fff;
              border-radius: 1em;
              padding: 2em 2em 1.4em 2em;
              box-shadow: 0 8px 32px #0000001f;
              max-width: 90vw;
              animation: pop-in 0.12s;
            }
            @keyframes pop-in {
              from { opacity: 0; transform: scale(0.92);}
              to { opacity: 1; transform: scale(1);}
            }
            `}
          </style>
        </div>
      )}
    </div>
  );
};

export default Signup2;
