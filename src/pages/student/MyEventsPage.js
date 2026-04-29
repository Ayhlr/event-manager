import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { apiRequest } from "../../api";

function MyEventsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [openEvent, setOpenEvent] = useState(null);
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [showUnenrollModal, setShowUnenrollModal] = useState(false);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/registrations/my-registrations");

      const myRegistrations = Array.isArray(data)
        ? data
        : data.registrations || data.myRegistrations || [];

      const validRegistrations = myRegistrations.filter((registration) => {
        const event = registration.event || registration.eventId;
        return event && typeof event === "object" && event._id && event.title;
      });

      const uniqueRegistrations = [];
      const seenEventIds = new Set();

      validRegistrations.forEach((registration) => {
        const event = registration.event || registration.eventId;
        const eventId = event._id;

        if (!seenEventIds.has(eventId)) {
          seenEventIds.add(eventId);
          uniqueRegistrations.push(registration);
        }
      });

      setRegistrations(uniqueRegistrations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const getEventFromRegistration = (registration) => {
    return registration.event || registration.eventId;
  };

  const getRegistrationId = (registration) => {
    return registration._id || registration.registrationId;
  };

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

  const handleToggleDetails = (registrationId) => {
    setOpenEvent(openEvent === registrationId ? null : registrationId);
  };

  const openUnenrollModal = (registration) => {
    const event = getEventFromRegistration(registration);

    if (!isUpcomingEvent(event)) {
      alert("You cannot unenroll from a past event.");
      return;
    }

    setSelectedRegistration(registration);
    setShowUnenrollModal(true);
  };

  const closeUnenrollModal = () => {
    setSelectedRegistration(null);
    setShowUnenrollModal(false);
  };

  const handleUnenroll = async () => {
    if (!selectedRegistration) return;

    const registrationId = getRegistrationId(selectedRegistration);

    try {
      setActionLoading(true);

      await apiRequest(`/registrations/${registrationId}`, "DELETE");

      await fetchMyEvents();

      setOpenEvent(null);
      closeUnenrollModal();
    } catch (err) {
      setError(err.message);
      closeUnenrollModal();
    } finally {
      setActionLoading(false);
    }
  };

  const upcomingRegistrations = registrations.filter((registration) => {
    const event = getEventFromRegistration(registration);
    return isUpcomingEvent(event);
  });

  const completedRegistrations = registrations.filter((registration) => {
    const event = getEventFromRegistration(registration);
    return !isUpcomingEvent(event);
  });

  if (loading) {
    return (
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={pageStyle}>
          <p>Loading your events...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={pageStyle}>
        <h2>My Events</h2>
        <p style={{ color: "#666" }}>
          Track the events you joined. Past events only show here if you joined them.
        </p>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={summaryBox}>
          <h4>Joined Events Summary</h4>

          <div style={{ display: "flex", gap: "50px", marginTop: "15px" }}>
            <p>Upcoming Events: {upcomingRegistrations.length}</p>
            <p>Past Events: {completedRegistrations.length}</p>
          </div>
        </div>

        <h4 style={{ marginTop: "30px" }}>Upcoming Events</h4>

        {upcomingRegistrations.length === 0 ? (
          <p style={{ color: "#666" }}>
            You have not joined any upcoming events yet.
          </p>
        ) : (
          upcomingRegistrations.map((registration) => {
            const event = getEventFromRegistration(registration);
            const registrationId = getRegistrationId(registration);

            const organizerName =
              event?.organizer?.name ||
              event?.organizer ||
              event?.clubName ||
              "Event Manager";

            const eventDate = event?.date
              ? new Date(event.date).toLocaleDateString()
              : "No date";

            return (
              <div key={registrationId}>
                <div style={cardStyle}>
                  <div>
                    <h5>{event.title}</h5>
                    <p>{organizerName}</p>

                    <p>
                      📅 {eventDate} | ⏰ {event.time || "No time"} | 📍{" "}
                      {event.location || "No location"}
                    </p>

                    <p style={{ color: "#888", fontSize: "14px" }}>
                      You joined as attendee
                    </p>

                    <p style={{ color: "#666", fontSize: "14px" }}>
                      Status: {registration.status || "confirmed"}
                    </p>
                  </div>

                  <Button
                    variant="outline-dark"
                    onClick={() => handleToggleDetails(registrationId)}
                  >
                    {openEvent === registrationId
                      ? "Hide Details"
                      : "View Details"}
                  </Button>
                </div>

                {openEvent === registrationId && (
                  <div style={detailsStyle}>
                    <p style={{ marginBottom: "10px" }}>
                      {event.description || "No description available."}
                    </p>

                    <Button
                      variant="danger"
                      onClick={() => openUnenrollModal(registration)}
                    >
                      Unenroll
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}

        <h4 style={{ marginTop: "30px" }}>Past Events I Attended</h4>

        {completedRegistrations.length === 0 ? (
          <p style={{ color: "#666" }}>No past attended events yet.</p>
        ) : (
          completedRegistrations.map((registration) => {
            const event = getEventFromRegistration(registration);
            const registrationId = getRegistrationId(registration);

            const organizerName =
              event?.organizer?.name ||
              event?.organizer ||
              event?.clubName ||
              "Event Manager";

            const eventDate = event?.date
              ? new Date(event.date).toLocaleDateString()
              : "No date";

            return (
              <div key={registrationId} style={cardStyle}>
                <div>
                  <h5>{event.title}</h5>
                  <p>{organizerName}</p>
                  <p>
                    📅 {eventDate} | ⏰ {event.time || "No time"} | 📍{" "}
                    {event.location || "No location"}
                  </p>
                  <p style={{ color: "#888", fontSize: "14px" }}>
                    You joined as attendee
                  </p>
                </div>

                <span style={completedBadge}>Past Event</span>
              </div>
            );
          })
        )}

        <Modal show={showUnenrollModal} onHide={closeUnenrollModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Unenroll from Event</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Are you sure you want to unenroll from this event?
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={closeUnenrollModal}
              disabled={actionLoading}
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              onClick={handleUnenroll}
              disabled={actionLoading}
            >
              {actionLoading ? "Unenrolling..." : "Unenroll"}
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

const summaryBox = {
  border: "1.5px solid #1a22383b",
  padding: "20px",
  borderRadius: "16px",
  marginTop: "20px",
  backgroundColor: "#f9f9f9",
  boxShadow: "0 6px 16px rgba(3, 8, 23, 0.46)"
};

const cardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "1.5px solid #1a22383b",
  padding: "20px",
  borderRadius: "16px",
  marginTop: "15px",
  backgroundColor: "#f9f9f9",
  boxShadow: "0 6px 16px rgba(3, 8, 23, 0.46)"
};

const detailsStyle = {
  border: "1.5px solid #1a22383b",
  borderTop: "none",
  padding: "20px",
  borderRadius: "0 0 16px 16px",
  backgroundColor: "#ffffff",
  marginBottom: "10px"
};

const completedBadge = {
  background: "#1a2238",
  color: "#ffffff",
  padding: "6px 12px",
  borderRadius: "20px",
  fontWeight: "bold"
};

export default MyEventsPage;
