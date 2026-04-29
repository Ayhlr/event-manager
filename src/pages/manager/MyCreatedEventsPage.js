import { useEffect, useState } from "react";
import {
  ProgressBar,
  Button,
  Card,
  Badge,
  Modal,
  Form
} from "react-bootstrap";
import { apiRequest } from "../../api";

function MyCreatedEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [editForm, setEditForm] = useState({
    title: "",
    clubName: "",
    category: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
    image: "",
    description: ""
  });

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

  const fetchMyEvents = async () => {
    try {
      setError("");
      const data = await apiRequest("/events/my-events");
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const percent = (attending, capacity) => {
    if (!capacity || capacity === 0) return 0;
    return Math.round((attending / capacity) * 100);
  };

  const openDetails = (event) => {
    setSelectedEvent(event);
    setShowDetails(true);
  };

  const openDelete = (event) => {
    setSelectedEvent(event);
    setShowDelete(true);
  };

  const handleDelete = async () => {
    try {
      await apiRequest(`/events/${selectedEvent._id}`, "DELETE");
      setShowDelete(false);
      setSelectedEvent(null);
      fetchMyEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEdit = (event) => {
    if (!isUpcomingEvent(event)) {
      alert("Past events cannot be edited.");
      return;
    }

    if (event.status !== "pending") {
      alert("Only pending events can be edited.");
      return;
    }

    setSelectedEvent(event);
    setEditForm({
      title: event.title || "",
      clubName: event.clubName || "",
      category: event.category || "",
      date: event.date ? event.date.split("T")[0] : "",
      time: event.time || "",
      location: event.location || "",
      capacity: event.capacity || "",
      image: event.image || "",
      description: event.description || ""
    });

    setShowEdit(true);
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {
    try {
      await apiRequest(`/events/${selectedEvent._id}`, "PUT", {
        ...editForm,
        capacity: Number(editForm.capacity)
      });

      setShowEdit(false);
      setSelectedEvent(null);
      fetchMyEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  const upcomingEvents = events.filter((event) => isUpcomingEvent(event));
  const pastEvents = events.filter((event) => !isUpcomingEvent(event));

  const totalEvents = events.length;
  const approvedEvents = events.filter((e) => e.status === "approved").length;
  const pendingEvents = events.filter((e) => e.status === "pending").length;
  const pastEventsCount = pastEvents.length;

  const renderEventCard = (event, isPast) => {
    const attending = Number(event.attendingCount || 0);
    const capacity = Number(event.capacity || 0);

    return (
      <Card key={event._id} style={eventCard}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h5>
              {event.title} <span style={categoryStyle}>{event.category}</span>{" "}
              {isPast && <span style={pastStyle}>Past Event</span>}
            </h5>

            <p>
              {event.date ? new Date(event.date).toLocaleDateString() : "No date"}{" "}
              • {event.time || "No time"} • {event.location}
            </p>

            <Badge
              bg={
                event.status === "approved"
                  ? "success"
                  : event.status === "rejected"
                  ? "danger"
                  : "warning"
              }
            >
              {event.status}
            </Badge>
          </div>

          <div>
            {attending} / {capacity}
          </div>
        </div>

        <ProgressBar
          now={percent(attending, capacity)}
          style={{ margin: "10px 0" }}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <Button variant="dark" onClick={() => openDetails(event)}>
            Details
          </Button>

          <Button
            variant="outline-dark"
            onClick={() => openEdit(event)}
            disabled={isPast || event.status !== "pending"}
          >
            Edit
          </Button>

          <Button variant="outline-danger" onClick={() => openDelete(event)}>
            Delete
          </Button>
        </div>
      </Card>
    );
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading events...</p>;
  }

  return (
    <div style={pageStyle}>
      <h2>My Created Events</h2>
      <p style={{ color: "#666" }}>
        Manage your upcoming events and view your past created events
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={summaryContainer}>
        <Card style={summaryCard}>
          <small>Total Events</small>
          <h3>{totalEvents}</h3>
        </Card>

        <Card style={summaryCard}>
          <small>Approved Events</small>
          <h3>{approvedEvents}</h3>
        </Card>

        <Card style={summaryCard}>
          <small>Pending Events</small>
          <h3>{pendingEvents}</h3>
        </Card>

        <Card style={summaryCard}>
          <small>Past Events</small>
          <h3>{pastEventsCount}</h3>
        </Card>
      </div>

      <h4>Upcoming Created Events</h4>

      {upcomingEvents.length === 0 ? (
        <p>No upcoming created events.</p>
      ) : (
        upcomingEvents.map((event) => renderEventCard(event, false))
      )}

      <h4 style={{ marginTop: "30px" }}>Past Created Events</h4>

      {pastEvents.length === 0 ? (
        <p>No past created events.</p>
      ) : (
        pastEvents.map((event) => renderEventCard(event, true))
      )}

      <Modal show={showDetails} onHide={() => setShowDetails(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent?.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>{selectedEvent?.description || "No description available."}</p>
          <p>
            <strong>Date:</strong>{" "}
            {selectedEvent?.date
              ? new Date(selectedEvent.date).toLocaleDateString()
              : "No date"}
          </p>
          <p>
            <strong>Time:</strong> {selectedEvent?.time || "No time"}
          </p>
          <p>
            <strong>Location:</strong> {selectedEvent?.location || "No location"}
          </p>
          <p>
            <strong>Capacity:</strong> {selectedEvent?.capacity || 0}
          </p>
          <p>
            <strong>Status:</strong> {selectedEvent?.status}
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="dark" onClick={() => setShowDetails(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Event</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete <strong>{selectedEvent?.title}</strong>?
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Club Name</Form.Label>
              <Form.Control
                name="clubName"
                value={editForm.clubName}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                name="category"
                value={editForm.category}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={editForm.date}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Time</Form.Label>
              <Form.Control
                name="time"
                value={editForm.time}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Location</Form.Label>
              <Form.Control
                name="location"
                value={editForm.location}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                name="capacity"
                value={editForm.capacity}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                name="image"
                value={editForm.image}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>
            Cancel
          </Button>
          <Button variant="dark" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

const pageStyle = {
  padding: "30px",
  minHeight: "100vh",
  backgroundColor: "#d9d9d9",
  color: "#030817"
};

const summaryContainer = {
  display: "flex",
  gap: "20px",
  marginBottom: "30px",
  flexWrap: "wrap"
};

const summaryCard = {
  padding: "18px",
  flex: 1,
  minWidth: "160px",
  backgroundColor: "#f9f9f9",
  color: "#030817",
  border: "1.5px solid #1a2238",
  borderRadius: "16px",
  boxShadow: "0 6px 16px rgba(3, 8, 23, 0.08)"
};

const eventCard = {
  padding: "20px",
  marginBottom: "20px",
  backgroundColor: "#f9f9f9",
  color: "#030817",
  border: "1.5px solid #1a2238",
  borderRadius: "16px",
  boxShadow: "0 6px 16px rgba(3, 8, 23, 0.08)"
};

const categoryStyle = {
  border: "1px solid #1a2238",
  padding: "3px 8px",
  marginLeft: "10px",
  borderRadius: "20px",
  fontSize: "14px"
};

const pastStyle = {
  border: "1px solid #1a2238",
  padding: "3px 8px",
  marginLeft: "10px",
  borderRadius: "20px",
  fontSize: "14px",
  backgroundColor: "#1a2238",
  color: "#ffffff"
};

export default MyCreatedEventsPage;
