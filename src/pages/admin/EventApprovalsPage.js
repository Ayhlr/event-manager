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

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Event Approvals</h2>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "10px", width: "300px", marginBottom: "20px" }}
      />

      <p>{filteredEvents.length} pending approval(s)</p>

      {filteredEvents.map((event) => (
        <div
          key={event._id}
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "15px",
            borderRadius: "8px"
          }}
        >
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
            <Button variant="light" onClick={() => {
              setSelectedEvent(event);
              setShowDetails(true);
            }}>
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
      ))}

      {/* DETAILS MODAL */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedEvent && (
            <>
              <p><strong>Title:</strong> {selectedEvent.title}</p>
              <p><strong>Club:</strong> {selectedEvent.clubName}</p>
              <p><strong>Category:</strong> {selectedEvent.category}</p>
              <p><strong>Location:</strong> {selectedEvent.location}</p>
              <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {selectedEvent.time}</p>
              <p><strong>Capacity:</strong> {selectedEvent.capacity}</p>
              <p><strong>Description:</strong> {selectedEvent.description}</p>
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

export default EventApprovalsPage;