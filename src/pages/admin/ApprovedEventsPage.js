import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { apiRequest } from "../../api";

function ApprovedEventsPage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getEventDateTime = (event) => {
    if (!event?.date) return null;

    const date = new Date(event.date);

    if (Number.isNaN(date.getTime())) return null;

    if (event.time) {
      const timeText = String(event.time).trim();
      const timeMatch = timeText.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);

      if (timeMatch) {
        let hours = Number(timeMatch[1]);
        const minutes = Number(timeMatch[2] || 0);
        const period = timeMatch[3]?.toUpperCase();

        if (period === "PM" && hours < 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        date.setHours(hours, minutes, 0, 0);
      } else {
        date.setHours(23, 59, 59, 999);
      }
    } else {
      date.setHours(23, 59, 59, 999);
    }

    return date;
  };

  const isUpcomingEvent = (event) => {
    const eventDateTime = getEventDateTime(event);
    if (!eventDateTime) return true;
    return eventDateTime >= new Date();
  };

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

  const filteredEvents = events.filter((event) => {
    const title = String(event.title || "").toLowerCase();
    const clubName = String(event.clubName || event.organizer || "").toLowerCase();
    const searchText = search.toLowerCase();

    return title.includes(searchText) || clubName.includes(searchText);
  });

  const upcomingEvents = filteredEvents.filter((event) => isUpcomingEvent(event));
  const pastEvents = filteredEvents.filter((event) => !isUpcomingEvent(event));

  const renderEventCard = (event, isPast) => (
    <div key={event._id} style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4>
          {event.title} {isPast && <span style={pastBadge}>Past Event</span>}
        </h4>

        <button onClick={() => openDeleteModal(event)} style={removeBtnStyle}>
          Remove
        </button>
      </div>

      <p>
        <span style={categoryStyle}>{event.category}</span>{" "}
        <span style={approvedBadge}>Approved</span>
      </p>

      <p>
        {event.date ? new Date(event.date).toLocaleDateString() : "No date"}{" "}
        • {event.time || "No time"} • {event.location}
      </p>

      <p>Capacity: {event.capacity}</p>

      <p>
        <strong>Manager:</strong> {event.clubName || event.organizer || "N/A"}
      </p>

      <p>
        <strong>Approved on:</strong>{" "}
        {event.approvedAt
          ? new Date(event.approvedAt).toLocaleDateString()
          : "N/A"}
      </p>
    </div>
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
        <h2 style={{ margin: 0 }}>Approved Events</h2>
        <p style={{ color: "#6b7280", marginTop: "8px" }}>
          View upcoming approved events and past approved events
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
        <strong>{filteredEvents.length}</strong> approved event(s) |{" "}
        <strong>{upcomingEvents.length}</strong> upcoming |{" "}
        <strong>{pastEvents.length}</strong> past
      </div>

      <h3>Upcoming Approved Events</h3>

      {upcomingEvents.length === 0 ? (
        <div style={emptyStyle}>No upcoming approved events found.</div>
      ) : (
        upcomingEvents.map((event) => renderEventCard(event, false))
      )}

      <h3 style={{ marginTop: "30px" }}>Past Approved Events</h3>

      {pastEvents.length === 0 ? (
        <div style={emptyStyle}>No past approved events found.</div>
      ) : (
        pastEvents.map((event) => renderEventCard(event, true))
      )}

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Remove Event</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to remove <strong>{selectedEvent?.title}</strong>?
          This will delete it from everywhere.
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
  boxShadow: "0 6px 16px rgba(3, 8, 23, 0.08)",
  marginBottom: "15px"
};

const removeBtnStyle = {
  border: "1.5px solid #1a22383b",
  padding: "8px 14px",
  cursor: "pointer",
  backgroundColor: "#ffffff",
  color: "#030817",
  borderRadius: "10px",
  fontWeight: "600"
};

const categoryStyle = {
  border: "1.5px solid #1a22383b",
  padding: "4px 10px",
  borderRadius: "20px",
  backgroundColor: "#ffffff"
};

const approvedBadge = {
  backgroundColor: "#d1e7dd",
  color: "#0f5132",
  border: "1.5px solid #1a22383b",
  padding: "4px 10px",
  borderRadius: "20px",
  fontWeight: "600"
};

const pastBadge = {
  backgroundColor: "#1a2238",
  color: "#ffffff",
  border: "1.5px solid #1a22383b",
  padding: "4px 10px",
  borderRadius: "20px",
  fontWeight: "600",
  fontSize: "13px"
};

export default ApprovedEventsPage;
