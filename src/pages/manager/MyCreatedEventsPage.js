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

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading events...</p>;
  }

  return (
    <div style={pageStyle}>
      <h2>My Created Events</h2>
      <p style={{ color: "#666" }}>Manage all your created events</p>

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
      </div>

      <h4>Created Events</h4>

      {events.length === 0 ? (
        <p>No created events yet.</p>
      ) : (
        events.map((event) => {
          const attending = Number(event.attendingCount || 0);
          const capacity = Number(event.capacity || 0);

          return (
            <Card key={event._id} style={eventCard}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <h5>
                    {event.title}{" "}
                    <span style={categoryStyle}>{event.category}</span>
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
                <Button variant="dark" onClick={() => openDetails(event)}>
                  Details
                </Button>

                <Button
                  variant="outline-dark"
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

      {/* keep all your modals the same here */}
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
  marginBottom: "30px"
};

const summaryCard = {
  padding: "18px",
  flex: 1,
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

export default MyCreatedEventsPage;