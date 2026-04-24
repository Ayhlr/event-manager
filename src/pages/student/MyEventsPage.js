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

  const handleToggleDetails = (registrationId) => {
    if (openEvent === registrationId) {
      setOpenEvent(null);
    } else {
      setOpenEvent(registrationId);
    }
  };

  const openUnenrollModal = (registration) => {
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
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const upcomingRegistrations = registrations.filter((registration) => {
    const event = getEventFromRegistration(registration);

    if (!event?.date) return true;

    const eventDate = new Date(event.date);
    const today = new Date();

    return eventDate >= today;
  });

  const completedRegistrations = registrations.filter((registration) => {
    const event = getEventFromRegistration(registration);

    if (!event?.date) return false;

    const eventDate = new Date(event.date);
    const today = new Date();

    return eventDate < today;
  });

  const totalPoints = registrations.reduce((total, registration) => {
    const event = getEventFromRegistration(registration);

    const points =
      Number(registration.pointsEarned) ||
      Number(event?.points) ||
      0;

    return total + points;
  }, 0);

  if (loading) {
    return (
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ marginLeft: "250px", padding: "30px", width: "100%" }}>
          <p>Loading your events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ marginLeft: "250px", padding: "30px", width: "100%" }}>
          <p style={{ color: "red" }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div
        style={{
          marginLeft: "250px",
          padding: "30px",
          width: "100%"
        }}
      >
        <h2>My Events</h2>
        <p style={{ color: "#666" }}>Track your joined and completed events</p>

        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "10px",
            marginTop: "20px"
          }}
        >
          <h4>Total Points Earned</h4>
          <h2>{totalPoints}</h2>

          <div style={{ display: "flex", gap: "50px" }}>
            <p>Upcoming Events: {upcomingRegistrations.length}</p>
            <p>Completed Events: {completedRegistrations.length}</p>
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

                    <p>
                      ⭐ {registration.pointsEarned || event.points || 0} Points
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

        <h4 style={{ marginTop: "30px" }}>Completed Events</h4>

        {completedRegistrations.length === 0 ? (
          <p style={{ color: "#666" }}>No completed events yet.</p>
        ) : (
          completedRegistrations.map((registration) => {
            const event = getEventFromRegistration(registration);
            const registrationId = getRegistrationId(registration);

            const organizerName =
              event?.organizer?.name ||
              event?.organizer ||
              event?.clubName ||
              "Event Manager";

            return (
              <div key={registrationId} style={cardStyle}>
                <div>
                  <h5>{event.title}</h5>
                  <p>{organizerName}</p>
                </div>

                <span
                  style={{
                    background: "black",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "5px"
                  }}
                >
                  Completed
                </span>
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

const cardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "1px solid #ddd",
  padding: "20px",
  borderRadius: "10px",
  marginTop: "15px"
};

const detailsStyle = {
  border: "1px solid #ddd",
  borderTop: "none",
  padding: "20px",
  borderRadius: "0 0 10px 10px",
  backgroundColor: "#f9f9f9",
  marginBottom: "10px"
};

export default MyEventsPage;