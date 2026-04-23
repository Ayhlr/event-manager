import { useState } from "react";
import initialEvents from "../../data/events";
import EventCard from "../../components/EventCard";
import HeroSection from "../../components/HeroSection";
import CategorySection from "../../components/CategorySection";
import SearchBar from "../../components/SearchBar";
import Sidebar from "../../components/Sidebar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function HomePage() {
  const [events, setEvents] = useState(initialEvents);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStadium, setSelectedStadium] = useState("All Stadiums");

  const [showAttendModal, setShowAttendModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [joinType, setJoinType] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleAttendClick = (eventId) => {
    if (joinedEvents.includes(eventId)) {
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
  };

  const confirmAttend = () => {
    if (!selectedEventId) return;

    if (joinType === "attendee") {
      setJoinedEvents((prev) => [...prev, selectedEventId]);

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEventId &&
          Number(event.attending || 0) < Number(event.capacity || 0)
            ? { ...event, attending: Number(event.attending || 0) + 1 }
            : event
        )
      );

      handleCloseModal();
      return;
    }

    if (joinType === "organizer") {
      handleCloseModal();
      setShowSuccessModal(true);
    }
  };

  const filteredEvents = events.filter((event) => {
    const search = String(searchTerm || "").toLowerCase();

    const title = String(event?.title || "").toLowerCase();
    const location = String(event?.location || "").toLowerCase();
    const organizer = String(event?.organizer || "").toLowerCase();
    const category = String(event?.category || "");
    const stadium = String(event?.stadium || "");

    const matchesSearch =
      title.includes(search) ||
      location.includes(search) ||
      organizer.includes(search);

    const matchesCategory =
      selectedCategory === "All Categories" ||
      selectedCategory === "All" ||
      category === selectedCategory;

    const matchesStadium =
      selectedStadium === "All Stadiums" ||
      stadium === selectedStadium;

    return matchesSearch && matchesCategory && matchesStadium;
  });

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div
        style={{
          marginLeft: "250px",
          padding: "20px",
          width: "100%"
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
                key={event.id}
                event={event}
                onAttend={handleAttendClick}
                isJoined={joinedEvents.includes(event.id)}
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
              No events found.
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
            <Button variant="outline-secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="dark" onClick={confirmAttend} disabled={!joinType}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showSuccessModal}
          onHide={() => setShowSuccessModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Request Sent</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Your organizer request has been sent to the event manager.
          </Modal.Body>

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