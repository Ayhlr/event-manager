import { useEffect, useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { apiRequest } from "../../api";

function ManageRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [studentProfile, setStudentProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/requests/manager");

      const realRequests = Array.isArray(data)
        ? data
        : data.requests || [];

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

  const openStudentProfile = async (studentId) => {
    if (!studentId) return;

    try {
      setProfileLoading(true);
      setStudentProfile(null);
      setShowProfileModal(true);

      const data = await apiRequest(`/users/${studentId}/profile-summary`);
      setStudentProfile(data);
    } catch (err) {
      setError(err.message);
      setShowProfileModal(false);
    } finally {
      setProfileLoading(false);
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Pending";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const formatDate = (date) => {
    if (!date) return "No date";
    return new Date(date).toLocaleDateString();
  };

  const counts = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length
  };

  const filteredRequests =
    filter === "All"
      ? requests
      : requests.filter((r) => formatStatus(r.status) === filter);

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

      await apiRequest(`/requests/${selectedRequest._id}/status`, "PUT", {
        status: selectedStatus
      });

      await fetchRequests();
      closeConfirmModal();
    } catch (err) {
      setError(err.message);
      closeConfirmModal();
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Manage Requests</h2>
        <p>Loading organizer requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Manage Requests</h2>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Requests</h2>

      <p style={{ color: "#666" }}>
        Review and respond to student organizer requests for your events
      </p>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <Card style={{ padding: "15px", flex: 1 }}>
          <small>Total Requests</small>
          <h3>{counts.total}</h3>
        </Card>

        <Card style={{ padding: "15px", flex: 1 }}>
          <small>Pending</small>
          <h3>{counts.pending}</h3>
        </Card>

        <Card style={{ padding: "15px", flex: 1, background: "#e6f4ea" }}>
          <small>Approved</small>
          <h3>{counts.approved}</h3>
        </Card>

        <Card style={{ padding: "15px", flex: 1, background: "#fdecea" }}>
          <small>Rejected</small>
          <h3>{counts.rejected}</h3>
        </Card>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {["All", "Pending", "Approved", "Rejected"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "dark" : "light"}
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      {filteredRequests.length === 0 ? (
        <p style={{ color: "#666" }}>No organizer requests found.</p>
      ) : (
        filteredRequests.map((request) => {
          const status = formatStatus(request.status);

          const studentName =
            request.name ||
            `${request.user?.firstName || ""} ${
              request.user?.lastName || ""
            }`.trim() ||
            "Unknown Student";

          const studentEmail =
            request.email || request.user?.email || "No email";

          const studentId = request.user?._id || request.user;

          const eventTitle =
            request.eventName || request.event?.title || "Untitled Event";

          const clubName =
            request.clubName || request.event?.clubName || "No club";

          return (
            <Card
              key={request._id}
              style={{ padding: "20px", marginBottom: "20px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <h5>
                    <button
                      type="button"
                      onClick={() => openStudentProfile(studentId)}
                      style={nameButtonStyle}
                    >
                      {studentName}
                    </button>{" "}

                    <span style={statusBadgeStyle}>
                      {status.toUpperCase()}
                    </span>
                  </h5>

                  <p style={{ margin: 0 }}>{studentEmail}</p>

                  <p style={{ marginBottom: "5px" }}>
                    <b>Event:</b> {eventTitle}
                  </p>

                  <p style={{ marginBottom: "5px", color: "#666" }}>
                    <b>Club:</b> {clubName}
                  </p>
                </div>

                <div>{formatDate(request.date || request.createdAt)}</div>
              </div>

              <div style={messageBoxStyle}>
                {request.message || "No message provided."}
              </div>

              {request.status === "pending" && (
                <div style={{ display: "flex", gap: "10px" }}>
                  <Button
                    variant="dark"
                    onClick={() => openConfirmModal(request, "approved")}
                  >
                    Approve
                  </Button>

                  <Button
                    variant="outline-danger"
                    onClick={() => openConfirmModal(request, "rejected")}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </Card>
          );
        })
      )}

      <Modal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Student Profile</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {profileLoading ? (
            <p>Loading profile...</p>
          ) : studentProfile ? (
            <>
              <p>
                <b>Name:</b> {studentProfile.firstName}{" "}
                {studentProfile.lastName}
              </p>

              <p>
                <b>Email:</b> {studentProfile.email || "No email"}
              </p>

              <p>
                <b>Student ID:</b>{" "}
                {studentProfile.studentId || "Not available"}
              </p>

              <p>
                <b>Phone Number:</b>{" "}
                {studentProfile.phoneNumber || "Not available"}
              </p>

              <p>
                <b>Organizer Points:</b> {studentProfile.organizerPoints}
              </p>

              <p>
                <b>Events Joined:</b> {studentProfile.eventsJoined}
              </p>

              <p>
                <b>Bio:</b> {studentProfile.bio || "No bio added."}
              </p>
            </>
          ) : (
            <p>No profile found.</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="dark" onClick={() => setShowProfileModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal} onHide={closeConfirmModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedStatus === "approved"
              ? "Approve Request"
              : "Reject Request"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to {selectedStatus} this organizer request?
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

const nameButtonStyle = {
  background: "none",
  border: "none",
  padding: 0,
  fontWeight: "bold",
  fontSize: "20px",
  cursor: "pointer",
  textDecoration: "underline"
};

const statusBadgeStyle = {
  border: "1px solid #ccc",
  padding: "3px 6px",
  marginLeft: "10px",
  fontSize: "14px"
};

const messageBoxStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  margin: "10px 0"
};

export default ManageRequestsPage;