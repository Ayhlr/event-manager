import { useState } from "react";

function ApprovedEventsPage() {
  const [search, setSearch] = useState("");

  const events = [
    {
      title: "Annual Cultural Night",
      category: "Entertainment",
      eventDate: "2026-04-10",
      location: "Main Stadium",
      capacity: 500,
      manager: "Ahmed Khan",
      approvedOn: "2026-03-15"
    },
    {
      title: "Startup Pitch Competition",
      category: "Educational",
      eventDate: "2026-04-12",
      location: "Conference Hall",
      capacity: 150,
      manager: "Layla Saleh",
      approvedOn: "2026-03-18"
    },
    {
      title: "Basketball Championship",
      category: "Sports",
      eventDate: "2026-04-18",
      location: "Sports Complex",
      capacity: 800,
      manager: "Omar Yousef",
      approvedOn: "2026-03-20"
    }
  ];

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.manager.toLowerCase().includes(search.toLowerCase())
  );

  const pageStyle = {
    padding: "10px 20px 30px 20px",
    backgroundColor: "#f6f7f9",
    minHeight: "100vh"
  };

  const headerStyle = {
    marginBottom: "30px",
    borderBottom: "1px solid #d9d9d9",
    paddingBottom: "16px"
  };

  const inputStyle = {
    width: "100%",
    maxWidth: "620px",
    padding: "12px 14px",
    border: "1px solid #d9d9d9",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
    backgroundColor: "#fff"
  };

  const countBoxStyle = {
    border: "1px solid #d9d9d9",
    backgroundColor: "#fff",
    padding: "18px",
    borderRadius: "8px",
    marginTop: "18px",
    marginBottom: "20px",
    fontSize: "18px"
  };

  const cardStyle = {
    border: "1px solid #d9d9d9",
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "18px",
    marginBottom: "16px"
  };

  const tagStyle = {
    display: "inline-block",
    border: "1px solid #d9d9d9",
    backgroundColor: "#fff",
    padding: "6px 12px",
    borderRadius: "4px",
    marginRight: "10px",
    fontWeight: "500"
  };

  const approvedTagStyle = {
    display: "inline-block",
    border: "1px solid #d9d9d9",
    backgroundColor: "#fff",
    padding: "6px 12px",
    borderRadius: "4px",
    fontWeight: "600"
  };

  const detailsBoxStyle = {
    border: "1px solid #d9d9d9",
    backgroundColor: "#fff",
    padding: "16px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "20px",
    marginTop: "14px",
    marginBottom: "14px"
  };

  const removeBtnStyle = {
    backgroundColor: "#fff",
    color: "#111",
    border: "1px solid #d9d9d9",
    padding: "10px 18px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600"
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: "38px", fontWeight: "700" }}>
          Approved Events
        </h1>
        <p style={{ margin: "8px 0 0 0", color: "#6b7280", fontSize: "20px" }}>
          View and manage approved events
        </p>
      </div>

      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        <div style={{ marginBottom: "10px", fontWeight: "600" }}>
          Search Events
        </div>

        <input
          type="text"
          placeholder="Search by event title or manager..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <div style={countBoxStyle}>
          <strong>{filteredEvents.length}</strong> approved event(s)
        </div>

        {filteredEvents.map((event, index) => (
          <div key={index} style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "16px"
              }}
            >
              <div style={{ fontSize: "20px", fontWeight: "700" }}>
                {event.title}
              </div>

              <button style={removeBtnStyle}>🗑 Remove</button>
            </div>

            <div style={{ marginTop: "14px" }}>
              <span style={tagStyle}>{event.category}</span>
              <span style={approvedTagStyle}>✓ Approved</span>
            </div>

            <div style={detailsBoxStyle}>
              <div>
                <div style={{ color: "#6b7280", marginBottom: "8px", fontWeight: "600" }}>
                  Event Date
                </div>
                <div style={{ fontSize: "18px" }}>{event.eventDate}</div>
              </div>

              <div>
                <div style={{ color: "#6b7280", marginBottom: "8px", fontWeight: "600" }}>
                  Stadium
                </div>
                <div style={{ fontSize: "18px" }}>{event.location}</div>
              </div>

              <div>
                <div style={{ color: "#6b7280", marginBottom: "8px", fontWeight: "600" }}>
                  Capacity
                </div>
                <div style={{ fontSize: "18px" }}>{event.capacity}</div>
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid #e5e7eb",
                paddingTop: "14px",
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "10px",
                color: "#6b7280",
                fontSize: "17px"
              }}
            >
              <div>
                <strong>Manager:</strong> {event.manager}
              </div>
              <div>
                <strong>Approved on:</strong> {event.approvedOn}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApprovedEventsPage;