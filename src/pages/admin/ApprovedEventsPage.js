import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { apiRequest } from "../../api";

function ApprovedEventsPage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchApprovedEvents = async () => {
    try {
      const data = await apiRequest("/events/admin/all");
      const approved = data.filter((e) => e.status === "approved");
      setEvents(approved);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedEvents();
  }, []);

  const openDeleteModal = (event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const handleRemove = async () => {
    try {
      await apiRequest(`/events/${selectedEvent._id}`, "DELETE");
      setShowDeleteModal(false);
      setSelectedEvent(null);
      fetchApprovedEvents();
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
      <h2>Approved Events</h2>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "10px", width: "300px", marginBottom: "20px" }}
      />

      <p>{filteredEvents.length} approved event(s)</p>

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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>{event.title}</h4>

            <button
              onClick={() => openDeleteModal(event)}
              style={{
                border: "1px solid #ddd",
                padding: "6px 12px",
                cursor: "pointer",
                background: "white"
              }}
            >
              🗑 Remove
            </button>
          </div>

          <p>{event.category} • ✓ Approved</p>

          <p>
            {event.date
              ? new Date(event.date).toLocaleDateString()
              : "No date"}{" "}
            • {event.location}
          </p>

          <p>Capacity: {event.capacity}</p>

          <p>
            <strong>Manager:</strong> {event.clubName}
          </p>

          <p>
            <strong>Approved on:</strong>{" "}
            {event.approvedAt
              ? new Date(event.approvedAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      ))}

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Remove Event</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to remove{" "}
          <strong>{selectedEvent?.title}</strong>? This will delete it from
          everywhere.
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>

          <Button variant="danger" onClick={handleRemove}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ApprovedEventsPage;