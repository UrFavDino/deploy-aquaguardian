import React, { useState, useEffect } from "react";
import { Edit, Trash2, Save, XCircle, Search, Users } from "lucide-react";
import "./ManageSchools.css";
import AdminNavbar from "../../Navbar/AdminNavbar";
import { supabase } from "../../../utils/supabaseClient";

const ManageSchools = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("active"); // "active" or "reviewed"
  const [loading, setLoading] = useState(true);

  // For user edit modal
  const [userEditModalOpen, setUserEditModalOpen] = useState(false);
  const [userEditForm, setUserEditForm] = useState({ id: "", email: "" });

  // For modal: users of the selected school
  const [currentSchool, setCurrentSchool] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      alert("Failed to fetch users: " + error.message);
      setUsers([]);
      setLoading(false);
      return;
    }
    setUsers(data || []);
    setLoading(false);
  }

  // Compute unique schools (by school_name)
  // Group users by school_name
  const schoolList = Array.from(
    Object.values(
      users.reduce((acc, u) => {
        if (!u.school_name) return acc;
        if (!acc[u.school_name])
          acc[u.school_name] = { school_name: u.school_name, users: [] };
        acc[u.school_name].users.push(u);
        return acc;
      }, {})
    )
  ).map((schoolGroup) => {
    // Find the principal
    const principalUser = schoolGroup.users.find(
      (user) =>
        (user.position && user.position.toLowerCase() === "principal") ||
        (user.role && user.role.toLowerCase() === "principal")
    );
    return {
      school_name: schoolGroup.school_name,
      school_address: schoolGroup.users[0]?.school_address || "",
      principal: principalUser
        ? principalUser.full_name || principalUser.name
        : schoolGroup.users[0]?.full_name || schoolGroup.users[0]?.name || "",
      email: principalUser
        ? principalUser.email
        : schoolGroup.users[0]?.email || "",
      status: principalUser
        ? principalUser.review_status || "pending"
        : schoolGroup.users[0]?.review_status || "pending",
      users: schoolGroup.users,
    };
  });

  // Filter by tab and search
  const filteredSchools = schoolList.filter((school) => {
    if (
      (activeTab === "active" &&
        school.status !== "approved" &&
        school.status !== "pending") ||
      (activeTab === "reviewed" &&
        school.status !== "rejected" &&
        school.status !== "approved")
    ) {
      return false;
    }
    const q = search.toLowerCase();
    return (
      school.school_name?.toLowerCase().includes(q) ||
      school.school_address?.toLowerCase().includes(q) ||
      school.email?.toLowerCase().includes(q)
    );
  });

  const openManageUsers = (school) => {
    setCurrentSchool(school);
  };

  const closeManageUsers = () => {
    setCurrentSchool(null);
  };

  // User email edit modal
  const openEditUser = (user) => {
    setUserEditForm({ id: user.id, email: user.email });
    setUserEditModalOpen(true);
  };
  const handleUserEmailChange = (e) => {
    setUserEditForm((prev) => ({ ...prev, email: e.target.value }));
  };
  const handleUserEmailSubmit = async (e) => {
    e.preventDefault();
    const { id, email } = userEditForm;
    const { error } = await supabase
      .from("users")
      .update({ email })
      .eq("id", id);
    if (error) {
      alert("Failed to update user email: " + error.message);
      return;
    }
    setUserEditModalOpen(false);
    fetchUsers();
    // If manage users modal open, refresh user list
    if (currentSchool) openManageUsers(currentSchool);
  };

  // Delete user (optional)
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const { error } = await supabase.from("users").delete().eq("id", userId);
    if (error) {
      alert("Failed to delete user: " + error.message);
      return;
    }
    fetchUsers();
  };

  return (
    <div className="manage-schools-container">
      <AdminNavbar />
      <div className="manage-schools-content">
        <div className="schools-header">
          <div>
            <h1
              className="verification-title"
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <Users size={28} className="title-icon" />
              Manage School Accounts
            </h1>
            <p className="verification-subtitle">
              View and manage schools and their users
            </p>
          </div>
        </div>
        {/* Tabs */}
        <div className="verification-tabs" style={{ marginBottom: "1.7rem" }}>
          <button
            className={`tab ${activeTab === "active" ? "active" : ""}`}
            type="button"
            onClick={() => setActiveTab("active")}
          >
            Active
            <span className="tab-count">
              {
                schoolList.filter(
                  (s) => s.status === "pending" || s.status === "approved"
                ).length
              }
            </span>
          </button>
          <button
            className={`tab ${activeTab === "reviewed" ? "active" : ""}`}
            type="button"
            onClick={() => setActiveTab("reviewed")}
          >
            Reviewed
            <span className="tab-count">
              {
                schoolList.filter(
                  (s) => s.status === "rejected" || s.status === "approved"
                ).length
              }
            </span>
          </button>
        </div>
        {/* Search */}
        <div className="schools-searchbar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search schools by name, address, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Schools Table */}
        <div className="schools-table-wrapper">
          <table className="schools-table">
            <thead>
              <tr>
                <th>School Name</th>
                <th>Address</th>
                <th>Email</th>
                <th>Principal</th>
                <th>Status</th>
                <th>Users</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="no-data">
                    Loading...
                  </td>
                </tr>
              ) : filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={7} className="no-data">
                    No schools found
                  </td>
                </tr>
              ) : (
                filteredSchools.map((school, idx) => (
                  <tr key={school.school_name}>
                    <td>{school.school_name}</td>
                    <td>{school.school_address}</td>
                    <td>{school.email}</td>
                    <td>{school.principal}</td>
                    <td>
                      <span className={`status-badge ${school.status}`}>
                        {school.status.charAt(0).toUpperCase() +
                          school.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      {
                        users.filter(
                          (u) => u.school_name === school.school_name
                        ).length
                      }
                    </td>
                    <td>
                      <button
                        className="manage-users-btn"
                        type="button"
                        onClick={() => openManageUsers(school)}
                        title="Manage Users"
                      >
                        <Users size={16} /> Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Users Modal */}
      {currentSchool && (
        <div className="modal-overlay">
          <div className="modal user-modal">
            <div className="modal-header">
              <h2>
                <Users
                  size={20}
                  style={{ marginRight: 6, verticalAlign: -2 }}
                />
                Users for:{" "}
                <span style={{ color: "#3b82f6" }}>
                  {currentSchool.school_name}
                </span>
              </h2>
              <button
                type="button"
                className="modal-close"
                onClick={closeManageUsers}
                title="Close"
              >
                <XCircle size={20} />
              </button>
            </div>
            <div className="modal-body">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((u) => u.school_name === currentSchool.school_name)
                    .map((user) => (
                      <tr key={user.id}>
                        <td>{user.full_name || user.name}</td>
                        <td>{user.role || user.position}</td>
                        <td>{user.email}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              user.review_status || "pending"
                            }`}
                          >
                            {(user.review_status || "pending")
                              .charAt(0)
                              .toUpperCase() +
                              (user.review_status || "pending").slice(1)}
                          </span>
                        </td>
                        <td>
                          <button
                            className="action-icon"
                            type="button"
                            onClick={() => openEditUser(user)}
                            title="Edit Email"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            className="action-icon danger"
                            type="button"
                            onClick={() => handleDeleteUser(user.id)}
                            title="Delete User"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Edit User Email Modal */}
      {userEditModalOpen && (
        <div className="modal-overlay">
          <form className="modal" onSubmit={handleUserEmailSubmit}>
            <div className="modal-header">
              <h2>
                <Edit size={20} style={{ marginRight: 6, verticalAlign: -2 }} />
                Edit User Email
              </h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => setUserEditModalOpen(false)}
                title="Close"
              >
                <XCircle size={20} />
              </button>
            </div>
            <div className="modal-body">
              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={userEditForm.email}
                  onChange={handleUserEmailChange}
                  required
                />
              </label>
            </div>
            <div className="modal-actions">
              <button className="modal-btn save" type="submit">
                <Save size={16} /> Save
              </button>
              <button
                className="modal-btn cancel"
                type="button"
                onClick={() => setUserEditModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageSchools;
