import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { apiRequest } from "../../api";

function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDetailsRequest, setSelectedDetailsRequest] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/requests/my-requests");

      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Could not load requests:", err.message);
      setRequests([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const isEventPassed = (request) => {
    const event = request.event || request.eventId;

    if (!event?.date) return false;

    const eventDate = new Date(event.date);

    if (event.time) {
      const [hours, minutes] = event.time.split(":");
      eventDate.setHours(Number(hours));
      eventDate.setMinutes(Number(minutes));
      eventDate.setSeconds(0);
      eventDate.setMilliseconds(0);
    } else {
      eventDate.setHours(23, 59, 0, 0);
    }

    return eventDate < new Date();
  };

  const openCancelModal = (request) => {
    setSelectedRequest(request);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setSelectedRequest(null);
    setShowCancelModal(false);
  };

  const openDetailsModal = (request) => {
    setSelectedDetailsRequest(request);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setSelectedDetailsRequest(null);
    setShowDetailsModal(false);
  };

  const handleCancelRequest = async () => {
    if (!selectedRequest) return;

    try {
      setActionLoading(true);
      setError("");

      await apiRequest(`/requests/${selectedRequest._id}`, "DELETE");

      await fetchRequests();
      closeCancelModal();
    } catch (err) {
      setError(err.message);
      closeCancelModal();
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "approved") {
      return {
        color: "green",
        border: "1px solid green"
      };
    }

    if (status === "rejected") {
      return {
        color: "red",
        border: "1px solid red"
      };
    }

    return {
      color: "#856404",
      border: "1px solid #856404"
    };
  };

  const getEvent = (request) => {
    return request.event || request.eventId || {};
  };

  const getEventTitle = (request) => {
    const event = getEvent(request);
    return event.title || request.eventName || "Untitled Event";
  };

  const getClubName = (request) => {
    const event = getEvent(request);
    return event.clubName || request.clubName || "No club";
  };

  const getEventCategory = (request) => {
    const event = getEvent(request);
    return event.category || "No category";
  };

  const getEventLocation = (request) => {
    const event = getEvent(request);
    return event.location || "No location";
  };

  const getEventDate = (request) => {
    const event = getEvent(request);
    return event.date ? formatDate(event.date) : "No date";
  };

  const getEventTime = (request) => {
    const event = getEvent(request);
    return event.time || "No time";
  };

  const getEventPoints = () => {
  return 50;
};
  const formatDate = (date) => {
    if (!date) return "No date";
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={pageStyle}>
          <p>Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={pageStyle}>
        <h2>Requests</h2>
        <p style={{ color: "#666" }}>
          Track your organizer requests and their status
        </p>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={historyBox}>
          <h4 style={{ padding: "20px", margin: 0 }}>Request History</h4>

          {requests.length === 0 ? (
            <p style={{ padding: "20px", color: "#666" }}>
              No organizer requests found.
            </p>
          ) : (
            requests.map((request) => {
              const eventPassed = isEventPassed(request);

              return (
                <div key={request._id} style={requestCard}>
                  <div>
                    <h5>{getEventTitle(request)}</h5>
                    <p>{getClubName(request)}</p>

                    <p>"{request.message || "No message provided."}"</p>

                    <small>Sent on {formatDate(request.createdAt)}</small>

                    {eventPassed && (
                      <p style={{ color: "#777", marginTop: "8px" }}>
                        Event has passed
                      </p>
                    )}
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span
                      style={{
                        ...statusBadge,
                        ...getStatusStyle(request.status)
                      }}
                    >
                      {(request.status || "pending").toUpperCase()}
                    </span>

                    <div
                      style={{
                        marginTop: "8px",
                        display: "flex",
                        gap: "8px",
                        justifyContent: "flex-end"
                      }}
                    >
                      <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={() => openDetailsModal(request)}
                      >
                        Details
                      </Button>

                      {!eventPassed && request.status !== "rejected" && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => openCancelModal(request)}
                        >
                          Cancel Request
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Cancel Request Modal */}
        <Modal show={showCancelModal} onHide={closeCancelModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Cancel Request</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Are you sure you want to cancel this organizer request?
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={closeCancelModal}
              disabled={actionLoading}
            >
              Keep Request
            </Button>

            <Button
              variant="danger"
              onClick={handleCancelRequest}
              disabled={actionLoading}
            >
              {actionLoading ? "Cancelling..." : "Cancel Request"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Event Details Modal */}
        <Modal show={showDetailsModal} onHide={closeDetailsModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Event Details</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {selectedDetailsRequest ? (
              <>
                <p>
                  <strong>Event:</strong> {getEventTitle(selectedDetailsRequest)}
                </p>

                <p>
                  <strong>Club:</strong> {getClubName(selectedDetailsRequest)}
                </p>

                <p>
                  <strong>Category:</strong>{" "}
                  {getEventCategory(selectedDetailsRequest)}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {getEventLocation(selectedDetailsRequest)}
                </p>

                <p>
                  <strong>Date:</strong> {getEventDate(selectedDetailsRequest)}
                </p>

                <p>
                  <strong>Time:</strong> {getEventTime(selectedDetailsRequest)}
                </p>

                <p>
                  <strong>Points:</strong>{" "}
                  {getEventPoints(selectedDetailsRequest)}
                </p>

                <p>
                  <strong>Your Message:</strong>{" "}
                  {selectedDetailsRequest.message || "No message provided."}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {(selectedDetailsRequest.status || "pending").toUpperCase()}
                </p>
              </>
            ) : (
              <p>No event selected.</p>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="dark" onClick={closeDetailsModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

const pageStyle = {
  marginLeft: "250px",
  padding: "30px",
  width: "100%",
  minHeight: "100vh",
  backgroundColor: "#d9d9d9",
  color: "#030817"
};

const historyBox = {
  border: "1.5px solid #1a22383b",
  borderRadius: "16px",
  marginTop: "20px",
  backgroundColor: "#f9f9f9",
  boxShadow: "0 6px 16px rgba(3, 8, 23, 0.46)",
  overflow: "hidden"
};

const requestCard = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "1.5px solid #1a2238",
  borderRadius: "16px",
  padding: "18px",
  margin: "15px 20px",
  backgroundColor: "#ffffff"
};

const statusBadge = {
  padding: "6px 12px",
  fontSize: "12px",
  fontWeight: "bold",
  borderRadius: "20px",
  backgroundColor: "#f9f9f9"
};

export default RequestsPage;