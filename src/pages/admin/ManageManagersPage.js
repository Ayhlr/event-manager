import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { apiRequest } from "../../api";

function ManageManagersPage() {
  const [search, setSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [managers, setManagers] = useState([]);
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [studentLoading, setStudentLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);

  const fetchManagers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/users/managers");

      const realManagers = Array.isArray(data) ? data : data.managers || [];

      setManagers(realManagers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const getName = (user) => {
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";

    return `${firstName} ${lastName}`.trim() || "Unknown User";
  };

  const getEmail = (user) => {
    return user.email || "No email";
  };

  const hasManagerAccess = (user) => {
    const roles = user.roles || [user.role];

    return user.role === "manager" || roles.includes("manager");
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    return new Date(dateValue).toLocaleDateString();
  };

  const getStatus = (manager) => {
    if (!manager.expiryDate) return "Active";

    const today = new Date();
    const expiry = new Date(manager.expiryDate);

    return expiry < today ? "Expired" : "Active";
  };

  const filteredManagers = managers.filter((manager) => {
    const searchValue = search.toLowerCase();

    return (
      getName(manager).toLowerCase().includes(searchValue) ||
      getEmail(manager).toLowerCase().includes(searchValue)
    );
  });

  const activeCount = filteredManagers.filter(
    (manager) => getStatus(manager) === "Active"
  ).length;

  const expiredCount = filteredManagers.filter(
    (manager) => getStatus(manager) === "Expired"
  ).length;

  const openRemoveModal = (manager) => {
    setSelectedManager(manager);
    setShowRemoveModal(true);
  };

  const closeRemoveModal = () => {
    setSelectedManager(null);
    setShowRemoveModal(false);
  };

  const handleSearchStudents = async () => {
    try {
      setStudentLoading(true);
      setError("");
      setSuccess("");

      const data = await apiRequest(
        `/users/students/search?search=${encodeURIComponent(studentSearch)}`
      );

      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      setStudents([]);
      setError(err.message);
    } finally {
      setStudentLoading(false);
    }
  };

  const handleGrantManager = async (studentId) => {
    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await apiRequest(`/users/${studentId}/grant-manager`, "PUT");

      setSuccess("Manager access granted successfully.");

      await fetchManagers();

      if (studentSearch.trim()) {
        const data = await apiRequest(
          `/users/students/search?search=${encodeURIComponent(studentSearch)}`
        );
        setStudents(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveManager = async () => {
    if (!selectedManager) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await apiRequest(`/users/${selectedManager._id}/remove-manager`, "PUT");

      await fetchManagers();

      setSuccess("Manager access removed successfully.");
      closeRemoveModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <h1>Manage Managers</h1>
        <p>Loading managers...</p>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: "38px", fontWeight: "700" }}>
          Manage Managers
        </h1>

        <p style={{ margin: "8px 0 0 0", color: "#6b7280", fontSize: "20px" }}>
          View managers and grant manager access to students
        </p>
      </div>

      <div style={{ maxWidth: "1150px", margin: "0 auto" }}>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Grant Manager Access</h2>

          <p style={sectionTextStyle}>
            Search for a student by email, name, or student ID, then give them
            manager access.
          </p>

          <div style={searchRowStyle}>
            <input
              type="text"
              placeholder="Search student by email..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchStudents();
                }
              }}
              style={inputStyle}
            />

            <button
              style={grantBtnStyle}
              onClick={handleSearchStudents}
              disabled={studentLoading}
            >
              {studentLoading ? "Searching..." : "Search"}
            </button>
          </div>

          <div style={tableWrapperStyle}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Student Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Student ID</th>
                  <th style={thStyle}>Current Access</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>

              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td style={tdStyle} colSpan="5">
                      No students searched yet.
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student._id}>
                      <td style={tdStyle}>
                        <strong>{getName(student)}</strong>
                      </td>

                      <td style={tdStyle}>{getEmail(student)}</td>

                      <td style={tdStyle}>{student.studentId || "N/A"}</td>

                      <td style={tdStyle}>
                        {hasManagerAccess(student)
                          ? "Student + Manager"
                          : "Student"}
                      </td>

                      <td style={tdStyle}>
                        {hasManagerAccess(student) ? (
                          <span style={statusStyle}>Already Manager</span>
                        ) : (
                          <button
                            style={grantBtnStyle}
                            onClick={() => handleGrantManager(student._id)}
                            disabled={actionLoading}
                          >
                            {actionLoading ? "Saving..." : "Make Manager"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginBottom: "10px", fontWeight: "600" }}>
          Search Managers
        </div>

        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "22px",
            flexWrap: "wrap"
          }}
        >
          <div style={statBoxStyle}>
            <strong>{filteredManagers.length}</strong> total manager(s)
          </div>

          <div style={statBoxStyle}>
            <strong>{activeCount}</strong> active
          </div>

          <div style={statBoxStyle}>
            <strong>{expiredCount}</strong> expired
          </div>
        </div>

        <div style={tableWrapperStyle}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Manager Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Approval Date</th>
                <th style={thStyle}>Duration</th>
                <th style={thStyle}>Expiry Date</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredManagers.length === 0 ? (
                <tr>
                  <td style={tdStyle} colSpan="7">
                    No managers found.
                  </td>
                </tr>
              ) : (
                filteredManagers.map((manager) => {
                  const status = getStatus(manager);

                  return (
                    <tr key={manager._id}>
                      <td style={tdStyle}>
                        <strong>{getName(manager)}</strong>
                      </td>

                      <td style={tdStyle}>{getEmail(manager)}</td>

                      <td style={tdStyle}>
                        {formatDate(manager.approvalDate || manager.updatedAt)}
                      </td>

                      <td style={tdStyle}>{manager.duration || "No expiry"}</td>

                      <td style={tdStyle}>{formatDate(manager.expiryDate)}</td>

                      <td style={tdStyle}>
                        <span
                          style={{
                            ...statusStyle,
                            color: status === "Active" ? "green" : "red"
                          }}
                        >
                          {status}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <button
                          style={removeBtnStyle}
                          onClick={() => openRemoveModal(manager)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={showRemoveModal} onHide={closeRemoveModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Remove Manager</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to remove{" "}
          <strong>{selectedManager ? getName(selectedManager) : ""}</strong> as
          a manager? They will still stay as a student.
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={closeRemoveModal}
            disabled={actionLoading}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={handleRemoveManager}
            disabled={actionLoading}
          >
            {actionLoading ? "Removing..." : "Remove Manager"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

const pageStyle = {
  padding: "30px",
  backgroundColor: "#d9d9d9",
  color: "#030817",
  minHeight: "100vh"
};

const headerStyle = {
  marginBottom: "30px",
  borderBottom: "1.5px solid #1a2238",
  paddingBottom: "16px"
};

const sectionStyle = {
  border: "1.5px solid #1a22383b",
  backgroundColor: "#f9f9f9",
  padding: "22px",
  borderRadius: "16px",
  marginBottom: "34px",
  boxShadow: "0 6px 16px rgba(3, 8, 23, 0.08)"
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "26px",
  fontWeight: "700"
};

const sectionTextStyle = {
  marginTop: "8px",
  color: "#4b5563",
  fontSize: "16px"
};

const searchRowStyle = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap"
};

const inputStyle = {
  width: "100%",
  maxWidth: "620px",
  padding: "12px 14px",
  border: "1.5px solid #1a22383b",
  borderRadius: "12px",
  fontSize: "16px",
  outline: "none",
  backgroundColor: "#f9f9f9"
};

const statBoxStyle = {
  flex: 1,
  border: "1.5px solid #1a22383b",
  backgroundColor: "#f9f9f9",
  padding: "18px",
  borderRadius: "16px",
  fontSize: "18px",
  minWidth: "220px",
  boxShadow: "0 6px 16px rgba(3, 8, 23, 0.08)"
};

const tableWrapperStyle = {
  marginTop: "22px",
  border: "1.5px solid #1a22383b",
  borderRadius: "16px",
  overflow: "hidden",
  backgroundColor: "#f9f9f9",
  boxShadow: "0 6px 16px rgba(3, 8, 23, 0.08)"
};

const thStyle = {
  padding: "16px 14px",
  textAlign: "left",
  fontSize: "16px",
  borderBottom: "1.5px solid #1a2238",
  backgroundColor: "#f9f9f9"
};

const tdStyle = {
  padding: "20px 14px",
  textAlign: "left",
  borderBottom: "1px solid #b9beca",
  fontSize: "16px",
  backgroundColor: "#ffffff"
};

const statusStyle = {
  border: "1.5px solid #1a22383b",
  padding: "6px 14px",
  display: "inline-block",
  backgroundColor: "#ffffff",
  color: "#030817",
  borderRadius: "20px",
  fontWeight: "600"
};

const removeBtnStyle = {
  backgroundColor: "#ffffff",
  color: "#030817",
  border: "1.5px solid #1a22383b",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600"
};

const grantBtnStyle = {
  backgroundColor: "#030817",
  color: "#ffffff",
  border: "1.5px solid #030817",
  padding: "12px 18px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600"
};

export default ManageManagersPage;