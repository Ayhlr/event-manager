import { useState } from "react";

function EventCard({ event, onAttend, isJoined }) {
  const [showDetails, setShowDetails] = useState(false);

  const progress =
    event.capacity > 0 ? (event.attending / event.capacity) * 100 : 0;

  return (
    <div
      style={{
        width: "320px",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #ddd",
        background: "white",
        margin: "15px"
      }}
    >
      <div style={{ position: "relative" }}>
        <img
          src={event.image}
          alt={event.title}
          style={{
            width: "100%",
            height: "160px",
            objectFit: "cover",
            background: "#ccc"
          }}
        />

        <span
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "white",
            border: "1px solid black",
            padding: "4px 10px",
            borderRadius: "10px",
            fontSize: "12px"
          }}
        >
          {event.category}
        </span>
      </div>

      <div style={{ padding: "15px" }}>
        <h5 style={{ marginBottom: "5px" }}>{event.title}</h5>

        <p style={{ fontSize: "13px", color: "#777", marginBottom: "10px" }}>
          by {event.organizer}
        </p>

        <p style={{ margin: "5px 0" }}>📍 {event.location}</p>
        <p style={{ margin: "5px 0" }}>📅 {event.date}</p>
        <p style={{ margin: "5px 0" }}>⏰ {event.time}</p>
        <p style={{ margin: "5px 0" }}>
          👥 {event.attending} / {event.capacity} attending
        </p>

        <div style={{ marginTop: "10px" }}>
          <p style={{ fontSize: "12px", marginBottom: "5px" }}>Capacity</p>

          <div
            style={{
              height: "6px",
              background: "#eee",
              borderRadius: "10px"
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "black",
                borderRadius: "10px"
              }}
            ></div>
          </div>

          <p style={{ fontSize: "12px", textAlign: "right" }}>
            {event.capacity - event.attending} spots left
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid #ccc",
              background: "white",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            {showDetails ? "Hide Details" : "View Details"}
          </button>

          <button
            onClick={() => onAttend(event.id)}
            disabled={isJoined}
            style={{
              flex: 1,
              padding: "8px",
              border: "none",
              background: isJoined ? "#777" : "black",
              color: "white",
              borderRadius: "6px",
              cursor: isJoined ? "not-allowed" : "pointer"
            }}
          >
            {isJoined ? "Joined" : "Attend"}
          </button>
        </div>

        {showDetails && (
          <div
            style={{
              marginTop: "12px",
              padding: "10px",
              background: "#f8f8f8",
              borderRadius: "8px",
              fontSize: "14px"
            }}
          >
            {event.description}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventCard;