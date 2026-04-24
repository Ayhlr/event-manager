import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { apiRequest } from "../../api";

function ManagerRequestsPage() {
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/manager-requests");

      const realRequests = Array.isArray(data)
        ? data
        : data.requests || data.managerRequests || [];

      setRequests(realRequests);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getName = (request) => {
    if (request.name) return request.name;

    const firstName = request.user?.firstName || "";
    const lastName = request.user?.lastName || "";

    return `${firstName} ${lastName}`.trim() || "Unknown User";
  };

  const getEmail = (request) => {
    return request.email || request.user?.email || "No email";
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "No date";
    return new Date(dateValue).toLocaleDateString();
  };

  const pendingRequests = requests.filter(
    (request) => request.status === "pending"
  );

  const filteredRequests = pendingRequests.filter((request) => {
    const searchValue = search.toLowerCase();

    return (
      getName(request).toLowerCase().includes(searchValue) ||
      getEmail(request).toLowerCase().includes(searchValue)
    );
  });

  const openConfirmModal = (request, status) => {
    setSelectedRequest(request);
    setSelectedStatus(status);
    setShowModal(true);
  };

  const closeConfirmModal = () => {
    setSelectedRequest(null);
    setSelectedStatus("");
    setShowModal(false);
  };

  const handleUpdateStatus = async () => {
    if (!selectedRequest || !selectedStatus) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await apiRequest(`/manager-requests/${selectedRequest._id}/status`, "PUT", {
        status: selectedStatus,
        duration: "6 months"
      });

      await fetchRequests();

      setSuccess(
        selectedStatus === "approved"
          ? "Manager request approved successfully."
          : "Manager request rejected successfully."
      );

      closeConfirmModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <h1>Manager Requests</h1>
        <p>Loading manager requests...</p>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: "38px", fontWeight: "700" }}>
          Manager Requests
        </h1>

        <p style={{ margin: "8px 0 0 0", color: "#6b7280", fontSize: "20px" }}>
          Review and approve manager applications
        </p>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <div style={{ marginBottom: "10px", fontWeight: "600" }}>
          Search Requests
        </div>

        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <div style={countBoxStyle}>
          <strong>{filteredRequests.length}</strong> pending request(s)
        </div>

        {filteredRequests.length === 0 ? (
          <div style={emptyStyle}>No pending manager requests found.</div>
        ) : (
          filteredRequests.map((request) => (
            <div key={request._id} style={cardStyle}>
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    marginBottom: "12px"
                  }}
                >
                  {getName(request)}
                </div>

                <div
                  style={{
                    color: "#6b7280",
                    marginBottom: "10px",
                    fontSize: "17px"
                  }}
                >
                  <strong style={{ color: "#6b7280" }}>Email:</strong>{" "}
                  {getEmail(request)}
                </div>

                <div style={{ color: "#6b7280", fontSize: "17px" }}>
                  <strong style={{ color: "#6b7280" }}>Requested:</strong>{" "}
                  {formatDate(request.date || request.createdAt)}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <button
                  style={approveBtnStyle}
                  onClick={() => openConfirmModal(request, "approved")}
                >
                  ◔ Approve
                </button>

                <button
                  style={rejectBtnStyle}
                  onClick={() => openConfirmModal(request, "rejected")}
                >
                  ⊗ Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal show={showModal} onHide={closeConfirmModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedStatus === "approved"
              ? "Approve Manager Request"
              : "Reject Manager Request"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to {selectedStatus}{" "}
          <strong>{selectedRequest ? getName(selectedRequest) : ""}</strong>?
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={closeConfirmModal}
            disabled={actionLoading}
          >
            Cancel
          </Button>

          <Button
            variant={selectedStatus === "approved" ? "dark" : "danger"}
            onClick={handleUpdateStatus}
            disabled={actionLoading}
          >
            {actionLoading ? "Saving..." : "Confirm"}
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

const countBoxStyle = {
  border: "1px solid #d9d9d9",
  backgroundColor: "#fff",
  padding: "18px",
  borderRadius: "8px",
  marginTop: "18px",
  marginBottom: "20px",
  fontSize: "18px"
};

const cardStyle = {
  border: "1px solid #d9d9d9",
  backgroundColor: "#fff",
  borderRadius: "8px",
  padding: "24px",
  marginBottom: "16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px"
};

const emptyStyle = {
  border: "1px solid #d9d9d9",
  backgroundColor: "#fff",
  borderRadius: "8px",
  padding: "24px",
  color: "#6b7280"
};

const approveBtnStyle = {
  backgroundColor: "#000",
  color: "#fff",
  border: "1px solid #000",
  padding: "12px 22px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
  marginRight: "10px"
};

const rejectBtnStyle = {
  backgroundColor: "#fff",
  color: "#111",
  border: "1px solid #d9d9d9",
  padding: "12px 22px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600"
};

export default ManagerRequestsPage;