import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { apiRequest } from "../../api";

function EventApprovalsPage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchEvents = async () => {
    try {
      const data = await apiRequest("/events/admin/all");
      const pending = data.filter((e) => e.status === "pending");
      setEvents(pending);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await apiRequest(`/events/${id}/status`, "PUT", { status });
      fetchEvents();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.clubName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={pageStyle}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0 }}>Event Approvals</h2>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          Review pending event submissions
        </p>
      </div>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={inputStyle}
      />

      <div style={countBoxStyle}>
        <strong>{filteredEvents.length}</strong> pending approval(s)
      </div>

      {filteredEvents.length === 0 ? (
        <div style={emptyStyle}>No pending event approvals found.</div>
      ) : (
        filteredEvents.map((event) => (
          <div key={event._id} style={cardStyle}>
            <h4>{event.title}</h4>
            <p>{event.category}</p>

            <p>
              {event.date
                ? new Date(event.date).toLocaleDateString()
                : "No date"}{" "}
              • {event.location}
            </p>

            <p>Capacity: {event.capacity}</p>

            <p>
              <strong>Club:</strong> {event.clubName}
            </p>

            <p>
              <strong>Submitted:</strong>{" "}
              {new Date(event.createdAt).toLocaleDateString()}
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                variant="outline-dark"
                onClick={() => {
                  setSelectedEvent(event);
                  setShowDetails(true);
                }}
              >
                Details
              </Button>

              <Button
                variant="dark"
                onClick={() => handleStatus(event._id, "approved")}
              >
                Approve
              </Button>

              <Button
                variant="outline-danger"
                onClick={() => handleStatus(event._id, "rejected")}
              >
                Reject
              </Button>
            </div>
          </div>
        ))
      )}

      <Modal show={showDetails} onHide={() => setShowDetails(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedEvent && (
            <>
              <p>
                <strong>Title:</strong> {selectedEvent.title}
              </p>
              <p>
                <strong>Club:</strong> {selectedEvent.clubName}
              </p>
              <p>
                <strong>Category:</strong> {selectedEvent.category}
              </p>
              <p>
                <strong>Location:</strong> {selectedEvent.location}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedEvent.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {selectedEvent.time}
              </p>
              <p>
                <strong>Capacity:</strong> {selectedEvent.capacity}
              </p>
              <p>
                <strong>Description:</strong> {selectedEvent.description}
              </p>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="dark" onClick={() => setShowDetails(false)}>
            Close
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
  marginBottom: "25px",
  borderBottom: "1.5px solid #1a2238",
  paddingBottom: "16px"
};

const inputStyle = {
  padding: "12px 14px",
  width: "320px",
  marginBottom: "20px",
  border: "1.5px solid #1a22383b",
  borderRadius: "12px",
  backgroundColor: "#f9f9f9",
  outline: "none"
};

const countBoxStyle = {
   border: "1.5px solid #1a22383b",
  backgroundColor: "#f9f9f9",
  padding: "18px",
  borderRadius: "16px",
  marginBottom: "20px",
  boxShadow: "0 6px 16px rgba(3, 8, 23, 0.08)"
};

const cardStyle = {
   border: "1.5px solid #1a22383b",
  backgroundColor: "#f9f9f9",
  padding: "20px",
  marginBottom: "15px",
  borderRadius: "16px",
  boxShadow: "0 6px 16px rgba(3, 8, 23, 0.08)"
};

const emptyStyle = {
   border: "1.5px solid #1a22383b",
  backgroundColor: "#f9f9f9",
  borderRadius: "16px",
  padding: "24px",
  color: "#6b7280",
  boxShadow: "0 6px 16px rgba(3, 8, 23, 0.08)"
};

export default EventApprovalsPage;