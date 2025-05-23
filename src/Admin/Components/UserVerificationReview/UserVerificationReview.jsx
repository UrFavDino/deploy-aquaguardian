import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../../../utils/supabaseClient";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Download,
  Eye,
  UserCheck,
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./UserVerificationReview.css";
import AdminNavbar from "../../Navbar/AdminNavbar";

const filterOptions = [
  { id: "high-priority", label: "High Priority", category: "priority" },
  { id: "medium-priority", label: "Medium Priority", category: "priority" },
  { id: "low-priority", label: "Low Priority", category: "priority" },
  { id: "principal", label: "Principal", category: "position" },
  { id: "teacher", label: "Teacher", category: "position" },
  { id: "administrator", label: "Administrator", category: "position" },
  { id: "this-week", label: "This Week", category: "date" },
  { id: "last-week", label: "Last Week", category: "date" },
];

const UserVerificationReview = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [reviewNote, setReviewNote] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null,
    id: null,
  });

  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [reviewedSubmissions, setReviewedSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Supabase on mount
  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    let { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("Failed to fetch user submissions: " + error.message);
      setLoading(false);
      return;
    }

    const mapped = data.map((user) => ({
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      schoolName: user.school_name,
      address: user.school_address,
      position: user.position,
      submissionDate: user.created_at?.split("T")[0],
      schoolId: user.school_id_url ? "Uploaded" : "N/A",
      idPictureUrl: user.school_id_url,
      status: user.review_status || "pending",
      reviewDate: user.reviewed_at ? user.reviewed_at.split("T")[0] : "",
      reviewedBy: user.reviewed_by || "",
      rejectionReason: user.rejection_reason || "",
      priority: "medium",
    }));

    setPendingSubmissions(mapped.filter((u) => u.status === "pending"));
    setReviewedSubmissions(mapped.filter((u) => u.status !== "pending"));
    setLoading(false);
  };

  // Search & filter logic
  const getFilteredSubmissions = useMemo(() => {
    const submissions =
      activeTab === "pending" ? pendingSubmissions : reviewedSubmissions;

    let result = submissions.filter((sub) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        (sub.fullName || "").toLowerCase().includes(q) ||
        (sub.email || "").toLowerCase().includes(q) ||
        (sub.schoolName || "").toLowerCase().includes(q) ||
        (sub.id || "").toLowerCase().includes(q) ||
        (sub.schoolId || "").toLowerCase().includes(q)
      );
    });

    if (selectedFilters.length > 0) {
      result = result.filter((sub) => {
        let keep = true;
        if (
          selectedFilters.includes("high-priority") ||
          selectedFilters.includes("medium-priority") ||
          selectedFilters.includes("low-priority")
        ) {
          if (!selectedFilters.includes(`${sub.priority}-priority`)) {
            keep = false;
          }
        }
        if (
          selectedFilters.includes("principal") ||
          selectedFilters.includes("teacher") ||
          selectedFilters.includes("administrator")
        ) {
          let posMatch = false;
          if (
            selectedFilters.includes("principal") &&
            (sub.position || "").toLowerCase().includes("principal")
          )
            posMatch = true;
          if (
            selectedFilters.includes("teacher") &&
            (sub.position || "").toLowerCase().includes("teacher")
          )
            posMatch = true;
          if (
            selectedFilters.includes("administrator") &&
            (sub.position || "").toLowerCase().includes("admin")
          )
            posMatch = true;
          if (
            selectedFilters.filter((f) =>
              ["principal", "teacher", "administrator"].includes(f)
            ).length > 0 &&
            !posMatch
          )
            keep = false;
        }
        if (
          selectedFilters.includes("this-week") ||
          selectedFilters.includes("last-week")
        ) {
          const today = new Date();
          const monday = new Date(today);
          monday.setDate(today.getDate() - today.getDay() + 1);
          const sunday = new Date(monday);
          sunday.setDate(monday.getDate() + 6);

          const subDate = new Date(sub.submissionDate);
          let weekMatch = false;
          if (
            selectedFilters.includes("this-week") &&
            subDate >= monday &&
            subDate <= sunday
          )
            weekMatch = true;
          if (selectedFilters.includes("last-week")) {
            const lastMonday = new Date(monday);
            lastMonday.setDate(monday.getDate() - 7);
            const lastSunday = new Date(lastMonday);
            lastSunday.setDate(lastMonday.getDate() + 6);
            if (subDate >= lastMonday && subDate <= lastSunday)
              weekMatch = true;
          }
          if (
            selectedFilters.filter((f) =>
              ["this-week", "last-week"].includes(f)
            ).length > 0 &&
            !weekMatch
          )
            keep = false;
        }
        return keep;
      });
    }
    return result;
  }, [
    activeTab,
    pendingSubmissions,
    reviewedSubmissions,
    searchQuery,
    selectedFilters,
  ]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setViewMode("list");
    setCurrentSubmission(null);
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const toggleFilter = (filterId) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const viewSubmissionDetails = (submission) => {
    setCurrentSubmission(submission);
    setViewMode("detail");
    setReviewNote("");
  };

  const backToList = () => {
    setViewMode("list");
    setCurrentSubmission(null);
  };

  const handleApprove = (id) => {
    setConfirmDialog({ open: true, action: "approve", id });
  };

  const handleReject = (id) => {
    setConfirmDialog({ open: true, action: "reject", id });
  };

  const confirmAction = async () => {
    const { action, id } = confirmDialog;
    if (!id) return;
    let review_status = action === "approve" ? "approved" : "rejected";
    let updateObj = { review_status };
    if (action === "reject") {
      updateObj.rejection_reason = reviewNote;
    }
    updateObj.reviewed_by = "CurrentAdmin";
    updateObj.reviewed_at = new Date().toISOString();

    // Debug
    console.log("Updating user:", id, updateObj);

    const { error } = await supabase
      .from("users")
      .update(updateObj)
      .eq("id", id);

    if (error) {
      alert("Failed to update user: " + error.message);
      return;
    }
    setConfirmDialog({ open: false, action: null, id: null });
    setCurrentSubmission(null);
    setViewMode("list");
    fetchSubmissions();
  };

  const cancelAction = () => {
    setConfirmDialog({ open: false, action: null, id: null });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      case "pending":
        return "status-pending";
      default:
        return "";
    }
  };

  // PDF Download Function (async + robust)
  const handleDownloadPDF = async (submission) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("User Verification Report", 14, 16);

    doc.setFontSize(12);

    const fields = [
      ["ID", submission.id],
      ["Full Name", submission.fullName],
      ["Email", submission.email],
      ["School Name", submission.schoolName],
      ["School Address", submission.address],
      ["Position", submission.position],
      ["Submission Date", submission.submissionDate],
      ["Status", submission.status],
      ["Review Date", submission.reviewDate || ""],
      ["Reviewed By", submission.reviewedBy || ""],
      ["Rejection Reason", submission.rejectionReason || ""],
    ];

    doc.autoTable({
      startY: 22,
      head: [["Field", "Value"]],
      body: fields,
      styles: { fontSize: 11, cellPadding: 2, overflow: "linebreak" },
      headStyles: { fillColor: [59, 130, 246] },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 120 },
      },
    });

    if (submission.idPictureUrl) {
      try {
        const res = await fetch(submission.idPictureUrl, { mode: "cors" });
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = function () {
          const imgData = reader.result;
          doc.addPage();
          doc.setFontSize(16);
          doc.text("ID Picture", 14, 20);
          doc.addImage(imgData, "JPEG", 14, 30, 60, 60);
          doc.save(
            `${submission.id}_${submission.fullName?.replace(/\s+/g, "_")}.pdf`
          );
        };
        reader.onerror = function () {
          doc.save(
            `${submission.id}_${submission.fullName?.replace(/\s+/g, "_")}.pdf`
          );
        };
        reader.readAsDataURL(blob);
        return; // Wait for reader
      } catch (e) {
        doc.save(
          `${submission.id}_${submission.fullName?.replace(/\s+/g, "_")}.pdf`
        );
        return;
      }
    } else {
      doc.save(
        `${submission.id}_${submission.fullName?.replace(/\s+/g, "_")}.pdf`
      );
    }
  };

  const renderListView = () => {
    const submissions = getFilteredSubmissions;
    return (
      <div className="submissions-list">
        <table className="submissions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>School Name</th>
              <th>Address</th>
              <th>Position</th>
              <th>Date</th>
              <th>School ID</th>
              <th>ID Picture</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td colSpan="10" className="no-submissions">
                  No submissions found
                </td>
              </tr>
            ) : (
              submissions.map((submission) => (
                <tr key={submission.id}>
                  <td>{submission.id}</td>
                  <td>{submission.fullName}</td>
                  <td>{submission.email}</td>
                  <td>{submission.schoolName}</td>
                  <td>{submission.address}</td>
                  <td>{submission.position}</td>
                  <td>
                    {activeTab === "pending"
                      ? submission.submissionDate
                      : `${submission.reviewDate} (Reviewed)`}
                  </td>
                  <td>{submission.schoolId}</td>
                  <td>
                    {submission.idPictureUrl ? (
                      <img
                        src={submission.idPictureUrl}
                        alt="ID"
                        style={{
                          height: "48px",
                          width: "48px",
                          borderRadius: "0.5rem",
                          objectFit: "cover",
                          border: "1px solid #e2e8f0",
                        }}
                      />
                    ) : (
                      <span>N/A</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-button view"
                        type="button"
                        onClick={() => viewSubmissionDetails(submission)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      {activeTab === "pending" && (
                        <>
                          <button
                            className="action-button approve"
                            type="button"
                            onClick={() => handleApprove(submission.id)}
                            title="Approve"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            className="action-button reject"
                            type="button"
                            onClick={() => handleReject(submission.id)}
                            title="Reject"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      {activeTab === "reviewed" && (
                        <button
                          className="action-button download"
                          title="Download PDF Report"
                          type="button"
                          onClick={() => handleDownloadPDF(submission)}
                        >
                          <Download size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="pagination">
          <button className="pagination-button" disabled>
            <ChevronLeft size={16} />
          </button>
          <span className="pagination-info">Page 1 of 1</span>
          <button className="pagination-button" disabled>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  const renderDetailView = () => {
    if (!currentSubmission) return null;
    return (
      <div className="submission-detail">
        <div className="detail-header">
          <button className="back-button" type="button" onClick={backToList}>
            <ChevronLeft size={16} />
            Back to List
          </button>
          <h2 className="detail-title">
            Submission Details: {currentSubmission.id}
          </h2>
          <div className="detail-actions">
            {currentSubmission.status === "pending" && (
              <>
                <button
                  className="detail-action-button approve"
                  type="button"
                  onClick={() => handleApprove(currentSubmission.id)}
                >
                  <CheckCircle size={18} />
                  Approve
                </button>
                <button
                  className="detail-action-button reject"
                  type="button"
                  onClick={() => handleReject(currentSubmission.id)}
                >
                  <XCircle size={18} />
                  Reject
                </button>
              </>
            )}
            <button
              className="detail-action-button download"
              type="button"
              onClick={() => handleDownloadPDF(currentSubmission)}
            >
              <Download size={18} />
              Download
            </button>
          </div>
        </div>
        <div className="detail-content">
          <div className="detail-section applicant-info">
            <h3 className="section-title">Applicant Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Full Name:</span>
                <span className="info-value">{currentSubmission.fullName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{currentSubmission.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">School Name:</span>
                <span className="info-value">
                  {currentSubmission.schoolName}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">School Address:</span>
                <span className="info-value">{currentSubmission.address}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Position:</span>
                <span className="info-value">{currentSubmission.position}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Submission Date:</span>
                <span className="info-value">
                  {currentSubmission.submissionDate}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">School ID:</span>
                <span className="info-value">{currentSubmission.schoolId}</span>
              </div>
              <div className="info-item full-width">
                <span className="info-label">ID Picture:</span>
                <span className="info-value">
                  {currentSubmission.idPictureUrl ? (
                    <img
                      src={currentSubmission.idPictureUrl}
                      alt="ID"
                      style={{
                        height: "120px",
                        borderRadius: "0.5rem",
                        marginTop: "0.5rem",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                  ) : (
                    <span>N/A</span>
                  )}
                </span>
              </div>
              {currentSubmission.status !== "pending" && (
                <>
                  <div className="info-item">
                    <span className="info-label">Review Date:</span>
                    <span className="info-value">
                      {currentSubmission.reviewDate}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Reviewed By:</span>
                    <span className="info-value">
                      {currentSubmission.reviewedBy}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status:</span>
                    <span
                      className={`info-value status-text ${getStatusClass(
                        currentSubmission.status
                      )}`}
                    >
                      {currentSubmission.status.charAt(0).toUpperCase() +
                        currentSubmission.status.slice(1)}
                    </span>
                  </div>
                  {currentSubmission.status === "rejected" && (
                    <div className="info-item full-width">
                      <span className="info-label">Rejection Reason:</span>
                      <span className="info-value">
                        {currentSubmission.rejectionReason}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          {currentSubmission.status === "pending" && (
            <div className="detail-section review-notes">
              <h3 className="section-title">Review Notes</h3>
              <textarea
                className="review-textarea"
                placeholder="Add notes about your decision here..."
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
              ></textarea>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Loading user submissions...</div>;
  }

  return (
    <div className="user-verification-container">
      <AdminNavbar />
      <div className="verification-content">
        <div className="verification-header">
          <div className="header-left">
            <h1 className="verification-title">
              <UserCheck size={24} className="title-icon" />
              User Verification Review
            </h1>
            <p className="verification-subtitle">
              Review and process user verification requests
            </p>
          </div>
          <div className="header-right">
            <div className="search-container">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search by name, school, email, or ID..."
                className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="filter-container">
              <button
                className="filter-button"
                type="button"
                onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              >
                <Filter size={18} />
                Filter
                {selectedFilters.length > 0 && (
                  <span className="filter-badge">{selectedFilters.length}</span>
                )}
              </button>
              {filterMenuOpen && (
                <div className="filter-dropdown">
                  <h3 className="filter-title">Filter Submissions</h3>
                  <div className="filter-groups">
                    <div className="filter-group">
                      <h4 className="filter-group-title">Priority</h4>
                      <div className="filter-options">
                        {filterOptions
                          .filter((option) => option.category === "priority")
                          .map((option) => (
                            <label className="filter-option" key={option.id}>
                              <input
                                type="checkbox"
                                checked={selectedFilters.includes(option.id)}
                                onChange={() => toggleFilter(option.id)}
                              />
                              <span className="filter-label">
                                {option.label}
                              </span>
                            </label>
                          ))}
                      </div>
                    </div>
                    <div className="filter-group">
                      <h4 className="filter-group-title">Position</h4>
                      <div className="filter-options">
                        {filterOptions
                          .filter((option) => option.category === "position")
                          .map((option) => (
                            <label className="filter-option" key={option.id}>
                              <input
                                type="checkbox"
                                checked={selectedFilters.includes(option.id)}
                                onChange={() => toggleFilter(option.id)}
                              />
                              <span className="filter-label">
                                {option.label}
                              </span>
                            </label>
                          ))}
                      </div>
                    </div>
                    <div className="filter-group">
                      <h4 className="filter-group-title">Date</h4>
                      <div className="filter-options">
                        {filterOptions
                          .filter((option) => option.category === "date")
                          .map((option) => (
                            <label className="filter-option" key={option.id}>
                              <input
                                type="checkbox"
                                checked={selectedFilters.includes(option.id)}
                                onChange={() => toggleFilter(option.id)}
                              />
                              <span className="filter-label">
                                {option.label}
                              </span>
                            </label>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="filter-actions">
                    <button
                      className="filter-action clear"
                      type="button"
                      onClick={() => setSelectedFilters([])}
                    >
                      Clear All
                    </button>
                    <button
                      className="filter-action apply"
                      type="button"
                      onClick={() => setFilterMenuOpen(false)}
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="verification-tabs">
          <button
            className={`tab ${activeTab === "pending" ? "active" : ""}`}
            type="button"
            onClick={() => handleTabChange("pending")}
          >
            <AlertTriangle size={18} className="tab-icon" />
            Pending Review
            <span className="tab-count">{pendingSubmissions.length}</span>
          </button>
          <button
            className={`tab ${activeTab === "reviewed" ? "active" : ""}`}
            type="button"
            onClick={() => handleTabChange("reviewed")}
          >
            <CheckCircle size={18} className="tab-icon" />
            Reviewed
            <span className="tab-count">{reviewedSubmissions.length}</span>
          </button>
        </div>
        <div className="verification-main">
          {viewMode === "list" ? renderListView() : renderDetailView()}
        </div>
      </div>
      {confirmDialog.open && (
        <div className="confirmation-dialog-overlay">
          <div className="confirmation-dialog">
            <h3 className="confirmation-title">
              {confirmDialog.action === "approve"
                ? "Approve Submission"
                : "Reject Submission"}
            </h3>
            <p className="confirmation-message">
              {confirmDialog.action === "approve"
                ? "Are you sure you want to approve this submission? This will grant access to the system."
                : "Are you sure you want to reject this submission? The applicant will be notified."}
            </p>
            <div className="confirmation-actions">
              <button
                className="confirmation-button cancel"
                type="button"
                onClick={cancelAction}
              >
                Cancel
              </button>
              <button
                className={`confirmation-button ${
                  confirmDialog.action === "approve" ? "approve" : "reject"
                }`}
                type="button"
                onClick={confirmAction}
              >
                {confirmDialog.action === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserVerificationReview;
