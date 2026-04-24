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

  const totalEvents = events.length;
  const approvedEvents = events.filter((e) => e.status === "approved").length;
  const pendingEvents = events.filter((e) => e.status === "pending").length;

  if (loading) return <p style={{ padding: "20px" }}>Loading events...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Created Events</h2>
      <p style={{ color: "#666" }}>Manage all your created events</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <Card style={{ padding: "15px", flex: 1 }}>
          <small>Total Events</small>
          <h3>{totalEvents}</h3>
        </Card>

        <Card style={{ padding: "15px", flex: 1 }}>
          <small>Approved Events</small>
          <h3>{approvedEvents}</h3>
        </Card>

        <Card style={{ padding: "15px", flex: 1 }}>
          <small>Pending Events</small>
          <h3>{pendingEvents}</h3>
        </Card>
      </div>

      <h4>Created Events</h4>

      {events.length === 0 ? (
        <p>No created events yet.</p>
      ) : (
        events.map((event) => {
          const attending = Number(event.attendingCount || 0);
          const capacity = Number(event.capacity || 0);

          return (
            <Card
              key={event._id}
              style={{ padding: "20px", marginBottom: "20px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <h5>
                    {event.title}{" "}
                    <span
                      style={{
                        border: "1px solid #ccc",
                        padding: "3px 6px",
                        marginLeft: "10px"
                      }}
                    >
                      {event.category}
                    </span>
                  </h5>

                  <p>
                    {event.date
                      ? new Date(event.date).toLocaleDateString()
                      : "No date"}{" "}
                    • {event.location}
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
                <Button variant="light" onClick={() => openDetails(event)}>
                  Details
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => openEdit(event)}
                  disabled={event.status !== "pending"}
                >
                  Edit
                </Button>

                <Button variant="outline-danger" onClick={() => openDelete(event)}>
                  Delete
                </Button>
              </div>
            </Card>
          );
        })
      )}

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
              <p><strong>Status:</strong> {selectedEvent.status}</p>
              <p><strong>Created:</strong> {new Date(selectedEvent.createdAt).toLocaleString()}</p>
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

      {/* DELETE MODAL */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Event</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete this event? This will remove it from admin approvals too.
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* EDIT MODAL */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Club Name</Form.Label>
              <Form.Control
                name="clubName"
                value={editForm.clubName}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                name="category"
                value={editForm.category}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                name="location"
                value={editForm.location}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={editForm.date}
                min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={editForm.time}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                name="capacity"
                value={editForm.capacity}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                name="image"
                value={editForm.image}
                onChange={handleEditChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
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
          <Button variant="outline-secondary" onClick={() => setShowEdit(false)}>
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

export default MyCreatedEventsPage;