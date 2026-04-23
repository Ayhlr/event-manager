import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Button from "react-bootstrap/Button";

function MyEventsPage() {
  const [openEvent, setOpenEvent] = useState(null);

  const handleToggleDetails = (eventName) => {
    if (openEvent === eventName) {
      setOpenEvent(null);
    } else {
      setOpenEvent(eventName);
    }
  };

  const handleUnsignUp = (eventName) => {
    alert(`You have unsigned up from ${eventName}`);
    setOpenEvent(null);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div
        style={{
          marginLeft: "250px",
          padding: "30px",
          width: "100%",
        }}
      >
        <h2>My Events</h2>
        <p style={{ color: "#666" }}>Track your joined and completed events</p>

        {/* Stats */}
        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "10px",
            marginTop: "20px",
          }}
        >
          <h4>Total Points Earned</h4>
          <h2>225</h2>

          <div style={{ display: "flex", gap: "50px" }}>
            <p>Upcoming Events: 2</p>
            <p>Completed Events: 2</p>
          </div>
        </div>

        <h4 style={{ marginTop: "30px" }}>Upcoming Events</h4>

        {/* Event 1 */}
        <div>
          <div style={cardStyle}>
            <div>
              <h5>Spring Music Festival</h5>
              <p>KU Music Club</p>
              <p>📅 2026-04-15 | ⏰ 18:00 | 📍 Main Auditorium</p>
              <p>⭐ 50 Points</p>
            </div>

            <Button
              variant="outline-dark"
              onClick={() => handleToggleDetails("Spring Music Festival")}
            >
              View Details
            </Button>
          </div>

          {openEvent === "Spring Music Festival" && (
            <div style={detailsStyle}>
              <p style={{ marginBottom: "10px", fontWeight: "500" }}>
                Are you sure you want to unsign up from this event?
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  variant="danger"
                  onClick={() => handleUnsignUp("Spring Music Festival")}
                >
                  Unsign Up
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setOpenEvent(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Event 2 */}
        <div>
          <div style={cardStyle}>
            <div>
              <h5>Tech Innovation Workshop</h5>
              <p>Computer Science Society</p>
              <p>📅 2026-04-20 | ⏰ 14:00 | 📍 Engineering Building</p>
              <p>⭐ 75 Points</p>
            </div>

            <Button
              variant="outline-dark"
              onClick={() => handleToggleDetails("Tech Innovation Workshop")}
            >
              View Details
            </Button>
          </div>

          {openEvent === "Tech Innovation Workshop" && (
            <div style={detailsStyle}>
              <p style={{ marginBottom: "10px", fontWeight: "500" }}>
                Are you sure you want to unsign up from this event?
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  variant="danger"
                  onClick={() => handleUnsignUp("Tech Innovation Workshop")}
                >
                  Unsign Up
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setOpenEvent(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Completed */}
        <h4 style={{ marginTop: "30px" }}>Completed Events</h4>

        <div style={cardStyle}>
          <div>
            <h5>Winter Art Exhibition</h5>
            <p>Arts Club</p>
          </div>

          <span
            style={{
              background: "black",
              color: "white",
              padding: "5px 10px",
              borderRadius: "5px",
            }}
          >
            Completed
          </span>
        </div>
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
  marginTop: "15px",
};

const detailsStyle = {
  border: "1px solid #ddd",
  borderTop: "none",
  padding: "20px",
  borderRadius: "0 0 10px 10px",
  backgroundColor: "#f9f9f9",
  marginBottom: "10px",
};

export default MyEventsPage;