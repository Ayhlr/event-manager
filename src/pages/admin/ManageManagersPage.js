import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { apiRequest } from "../../api";

function ManageManagersPage() {
  const [search, setSearch] = useState("");
  const [managers, setManagers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);

  const fetchManagers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/manager-requests/approved-managers");

      const realManagers = Array.isArray(data)
        ? data
        : data.managers || data.requests || [];

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

  const getName = (manager) => {
    if (manager.name) return manager.name;

    const firstName = manager.user?.firstName || "";
    const lastName = manager.user?.lastName || "";

    return `${firstName} ${lastName}`.trim() || "Unknown Manager";
  };

  const getEmail = (manager) => {
    return manager.email || manager.user?.email || "No email";
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

  const handleRemoveManager = async () => {
    if (!selectedManager) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await apiRequest(
        `/manager-requests/${selectedManager._id}/remove-manager`,
        "PUT"
      );

      await fetchManagers();

      setSuccess("Manager removed successfully.");
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
          View and manage approved event managers
        </p>
      </div>

      <div style={{ maxWidth: "1150px", margin: "0 auto" }}>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

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

                      <td style={tdStyle}>{manager.duration || "6 months"}</td>

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
                          🗑 Remove
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
          a manager? Their role will change back to student.
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
  padding: "10px 20px 30px 20px",
  backgroundColor: "#f6f7f9",
  minHeight: "100vh"
};

const headerStyle = {
  marginBottom: "30px",
  borderBottom: "1px solid #d9d9d9",
  paddingBottom: "16px"
};

const inputStyle = {
  width: "100%",
  maxWidth: "620px",
  padding: "12px 14px",
  border: "1px solid #d9d9d9",
  borderRadius: "8px",
  fontSize: "16px",
  outline: "none",
  backgroundColor: "#fff"
};

const statBoxStyle = {
  flex: 1,
  border: "1px solid #d9d9d9",
  backgroundColor: "#fff",
  padding: "18px",
  borderRadius: "8px",
  fontSize: "18px",
  minWidth: "220px"
};

const tableWrapperStyle = {
  marginTop: "22px",
  border: "1px solid #d9d9d9",
  borderRadius: "8px",
  overflow: "hidden",
  backgroundColor: "#fff"
};

const thStyle = {
  padding: "16px 14px",
  textAlign: "left",
  fontSize: "16px",
  borderBottom: "1px solid #d9d9d9"
};

const tdStyle = {
  padding: "20px 14px",
  textAlign: "left",
  borderBottom: "1px solid #d9d9d9",
  fontSize: "16px"
};

const statusStyle = {
  border: "1px solid #d9d9d9",
  padding: "6px 14px",
  display: "inline-block",
  backgroundColor: "#fff",
  borderRadius: "4px",
  fontWeight: "600"
};

const removeBtnStyle = {
  backgroundColor: "#fff",
  color: "#111",
  border: "1px solid #d9d9d9",
  padding: "10px 16px",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "600"
};

export default ManageManagersPage;