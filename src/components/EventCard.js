import { useState } from "react";

function EventCard({ event, onAttend, isJoined, isRequested }) {
  const [showDetails, setShowDetails] = useState(false);

  const attending = Number(event.attendingCount || event.attending || 0);
  const capacity = Number(event.capacity || 0);

  const spotsLeft = Math.max(capacity - attending, 0);
  const isFull = spotsLeft <= 0;

  const progress =
    capacity > 0 ? Math.min((attending / capacity) * 100, 100) : 0;

  const organizerName =
    event.organizer?.name ||
    event.organizer ||
    event.clubName ||
    "Event Manager";

  const eventDate = event.date
    ? new Date(event.date).toLocaleDateString()
    : "No date";

  const defaultImage =
    event.category === "Sports"
      ? "https://images.unsplash.com/photo-1461896836934-ffe607ba8211"
      : event.category === "Educational"
      ? "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b"
      : event.category === "Music"
      ? "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f"
      : "https://images.unsplash.com/photo-1511795409834-ef04bbd61622";

  return (
    <div
      style={{
        width: "320px",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #000000",
        background: "#030817",
        color: "#d9d9d9",
        boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
        margin: "15px"
      }}
    >
      <div style={{ position: "relative" }}>
        <img
          src={
            event.image && event.image.startsWith("http")
              ? event.image
              : defaultImage
          }
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
          alt={event.title}
          style={{
            width: "100%",
            height: "160px",
            objectFit: "cover",
            background: "#d9d9d9"
          }}
        />

        <span
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "#d9d9d9",
            color: "#030817",
            border: "1px solid #000000",
            padding: "4px 10px",
            borderRadius: "10px",
            fontSize: "12px"
          }}
        >
          {event.category}
        </span>
      </div>

      <div style={{ padding: "15px" }}>
        <h5 style={{ marginBottom: "5px", color: "#d9d9d9" }}>
          {event.title}
        </h5>

        <p style={{ fontSize: "13px", color: "#d9d9d9", marginBottom: "10px" }}>
          by {organizerName}
        </p>

        <p style={{ margin: "5px 0", color: "#d9d9d9" }}>📍 {event.location}</p>
        <p style={{ margin: "5px 0", color: "#d9d9d9" }}>📅 {eventDate}</p>
        <p style={{ margin: "5px 0", color: "#d9d9d9" }}>
          ⏰ {event.time || "No time"}
        </p>

        <p style={{ margin: "5px 0", color: "#d9d9d9" }}>
          👥 {attending} / {capacity} attending
        </p>

        <div style={{ marginTop: "10px" }}>
          <p style={{ fontSize: "12px", marginBottom: "5px", color: "#d9d9d9" }}>
            Capacity
          </p>

          <div
            style={{
              height: "6px",
              background: "#d9d9d9",
              borderRadius: "10px"
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#1a2238",
                borderRadius: "10px"
              }}
            ></div>
          </div>

          <p style={{ fontSize: "12px", textAlign: "right", color: "#d9d9d9" }}>
            {spotsLeft} spots left
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid #d9d9d9",
              background:
                "linear-gradient(135deg, #030817 0%, #1a2238 45%, #d9d9d9 100%)",
              color: "#d9d9d9",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            {showDetails ? "Hide Details" : "View Details"}
          </button>

          <button
            onClick={() => onAttend(event._id)}
            disabled={isJoined || isRequested || isFull}
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid #d9d9d9",
              background:
                isJoined || isRequested || isFull
                  ? "#1a2238"
                  : "linear-gradient(135deg, #030817 0%, #1a2238 45%, #d9d9d9 100%)",
              color: "#d9d9d9",
              borderRadius: "6px",
              cursor: isJoined || isRequested || isFull ? "not-allowed" : "pointer"
            }}
          >
            {isJoined
              ? "Joined"
              : isRequested
              ? "Request Sent"
              : isFull
              ? "Full"
              : "Attend"}
          </button>
        </div>

        {showDetails && (
          <div
            style={{
              marginTop: "12px",
              padding: "10px",
              background: "#d9d9d9",
              color: "#030817",
              border: "1px solid #000000",
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