import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "../../components/EventCard";
import HeroSection from "../../components/HeroSection";
import CategorySection from "../../components/CategorySection";
import SearchBar from "../../components/SearchBar";
import Sidebar from "../../components/Sidebar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { apiRequest } from "../../api";

function HomePage() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const viewMode = localStorage.getItem("viewMode");

  const showSidebar = token && role === "student" && viewMode === "student";

  const [events, setEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [requestedEvents, setRequestedEvents] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStadium, setSelectedStadium] = useState("All Stadiums");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [showAttendModal, setShowAttendModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [selectedEventId, setSelectedEventId] = useState(null);
  const [joinType, setJoinType] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  const fetchEvents = async () => {
    try {
      setError("");

      const data = await apiRequest("/events");

      const approvedUpcomingEvents = data.filter(
        (event) => event.status === "approved" && isUpcomingEvent(event)
      );

      setEvents(approvedUpcomingEvents);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchJoinedEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const viewMode = localStorage.getItem("viewMode");

      if (!token || role !== "student" || viewMode !== "student") {
        setJoinedEvents([]);
        return;
      }

      const data = await apiRequest("/registrations/my-registrations");

      const registrations = Array.isArray(data)
        ? data
        : data.registrations || data.myRegistrations || [];

      const joinedIds = registrations
        .map((registration) => {
          if (registration.event?._id) return registration.event._id;
          if (registration.eventId?._id) return registration.eventId._id;
          if (registration.event) return registration.event;
          if (registration.eventId) return registration.eventId;
          return null;
        })
        .filter(Boolean);

      setJoinedEvents(joinedIds);
    } catch (err) {
      console.log("Could not load joined events:", err.message);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const viewMode = localStorage.getItem("viewMode");

      if (!token || role !== "student" || viewMode !== "student") {
        setRequestedEvents([]);
        return;
      }

      const data = await apiRequest("/requests/my-requests");

      const requestIds = data
        .map((request) => {
          if (request.event?._id) return request.event._id;
          if (request.event) return request.event;
          return null;
        })
        .filter(Boolean);

      setRequestedEvents(requestIds);
    } catch (err) {
      console.log("Could not load organizer requests:", err.message);
    }
  };

  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        await fetchEvents();
        await fetchJoinedEvents();
        await fetchMyRequests();
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleAttendClick = (eventId) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const viewMode = localStorage.getItem("viewMode");

    if (!token) {
      navigate("/login");
      return;
    }

    if (role !== "student" || viewMode !== "student") {
      navigate("/login");
      return;
    }

    const selectedEvent = events.find((event) => event._id === eventId);

    if (!selectedEvent) {
      alert("Event not found.");
      return;
    }

    if (!isUpcomingEvent(selectedEvent)) {
      alert("This event has already passed.");
      return;
    }

    if (joinedEvents.includes(eventId)) {
      alert("You already joined this event.");
      return;
    }

    const attending = Number(
      selectedEvent.attendingCount || selectedEvent.attending || 0
    );

    const capacity = Number(selectedEvent.capacity || 0);
    const spotsLeft = Math.max(capacity - attending, 0);

    if (spotsLeft <= 0) {
      alert("This event is full.");
      return;
    }

    setSelectedEventId(eventId);
    setJoinType("");
    setRequestMessage("");
    setShowAttendModal(true);
  };

  const handleCloseModal = () => {
    setShowAttendModal(false);
    setSelectedEventId(null);
    setJoinType("");
    setRequestMessage("");
    setActionLoading(false);
  };

  const confirmAttend = async () => {
    if (!selectedEventId) return;

    try {
      setActionLoading(true);

      if (joinType === "attendee") {
        await apiRequest("/registrations", "POST", {
          eventId: selectedEventId,
          joinType: "attendee"
        });

        await fetchEvents();
        await fetchJoinedEvents();

        handleCloseModal();
        setSuccessMessage("You joined the event successfully.");
        setShowSuccessModal(true);
        return;
      }

      if (joinType === "organizer") {
        await apiRequest("/requests", "POST", {
          eventId: selectedEventId,
          message: requestMessage
        });

        await fetchMyRequests();

        handleCloseModal();
        setSuccessMessage(
          "Your organizer request has been sent to the event manager."
        );
        setShowSuccessModal(true);
      }
    } catch (err) {
      if (err.message.toLowerCase().includes("already joined")) {
        setJoinedEvents((prev) =>
          prev.includes(selectedEventId) ? prev : [...prev, selectedEventId]
        );
      }

      handleCloseModal();
      await fetchEvents();
      await fetchJoinedEvents();

      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const search = String(searchTerm || "").toLowerCase();

    const title = String(event?.title || "").toLowerCase();
    const location = String(event?.location || "").toLowerCase();
    const organizer = String(
      event?.organizer?.name || event?.organizer || event?.clubName || ""
    ).toLowerCase();

    const category = String(event?.category || "");
    const stadium = String(event?.stadium || event?.location || "");

    const matchesSearch =
      title.includes(search) ||
      location.includes(search) ||
      organizer.includes(search);

    const matchesCategory =
      selectedCategory === "All Categories" ||
      selectedCategory === "All" ||
      category === selectedCategory;

    const matchesStadium =
      selectedStadium === "All Stadiums" || stadium === selectedStadium;

    return matchesSearch && matchesCategory && matchesStadium;
  });

  if (loading) {
    return <p style={{ padding: "30px" }}>Loading events...</p>;
  }

  if (error) {
    return <p style={{ padding: "30px", color: "red" }}>{error}</p>;
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh"
      }}
    >
      {showSidebar && <Sidebar />}

      <div
  style={{
    marginLeft: showSidebar ? "250px" : "0",
    padding: "0",
    width: showSidebar ? "calc(100% - 250px)" : "100%",
    boxSizing: "border-box"
  }}
>
        <HeroSection />

        <CategorySection
          selectedCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
        />

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStadium={selectedStadium}
          setSelectedStadium={setSelectedStadium}
        />

        <h2 style={{ textAlign: "center", marginTop: "40px" }}>
          Upcoming Events
        </h2>

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 320px))",
            justifyContent: "center",
            gap: "30px",
            padding: "20px 0 40px"
          }}
        >
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onAttend={handleAttendClick}
                isJoined={joinedEvents.includes(event._id)}
                isRequested={requestedEvents.includes(event._id)}
              />
            ))
          ) : (
            <p
              style={{
                textAlign: "center",
                marginTop: "20px",
                gridColumn: "1 / -1"
              }}
            >
              No upcoming events found.
            </p>
          )}
        </div>

        <Modal show={showAttendModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Join Event</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Check
                type="radio"
                label="Join as Attendee"
                name="joinType"
                id="attendee-option"
                checked={joinType === "attendee"}
                onChange={() => setJoinType("attendee")}
                className="mb-3"
              />

              <Form.Check
                type="radio"
                label="Request to Help Organize"
                name="joinType"
                id="organizer-option"
                checked={joinType === "organizer"}
                onChange={() => setJoinType("organizer")}
                className="mb-3"
              />

              {joinType === "organizer" && (
                <Form.Group>
                  <Form.Label>Message to Event Manager</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Write your request here..."
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                  />
                </Form.Group>
              )}
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={handleCloseModal}
              disabled={actionLoading}
            >
              Cancel
            </Button>

            <Button
              variant="dark"
              onClick={confirmAttend}
              disabled={!joinType || actionLoading}
            >
              {actionLoading ? "Processing..." : "Confirm"}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showSuccessModal}
          onHide={() => setShowSuccessModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {successMessage.includes("organizer")
                ? "Request Sent"
                : "Joined Event"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>{successMessage}</Modal.Body>

          <Modal.Footer>
            <Button variant="dark" onClick={() => setShowSuccessModal(false)}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default HomePage;
