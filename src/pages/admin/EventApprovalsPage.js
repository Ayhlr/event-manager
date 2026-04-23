import { useState } from "react";

function EventApprovalsPage() {
  const [search, setSearch] = useState("");

  const events = [
    {
      title: "Spring Music Festival",
      category: "Music",
      eventDate: "2026-04-15",
      location: "Main Stadium",
      capacity: 500,
      manager: "Ahmed Khan",
      email: "a.khan@ku.edu.kw",
      submitted: "2026-03-26"
    },
    {
      title: "Tech Innovation Summit",
      category: "Educational",
      eventDate: "2026-04-20",
      location: "Conference Hall",
      capacity: 200,
      manager: "Layla Saleh",
      email: "l.saleh@ku.edu.kw",
      submitted: "2026-03-25"
    },
    {
      title: "Football Tournament Finals",
      category: "Sports",
      eventDate: "2026-04-24",
      location: "University Field",
      capacity: 800,
      manager: "Omar Yousef",
      email: "o.yousef@ku.edu.kw",
      submitted: "2026-03-24"
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
    padding: "22px",
    marginBottom: "18px"
  };

  const tagStyle = {
    display: "inline-block",
    border: "1px solid #d9d9d9",
    backgroundColor: "#fff",
    padding: "6px 12px",
    borderRadius: "4px",
    marginTop: "10px",
    marginBottom: "18px",
    fontWeight: "500"
  };

  const detailsBoxStyle = {
    border: "1px solid #d9d9d9",
    backgroundColor: "#fff",
    padding: "16px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "20px",
    marginBottom: "18px"
  };

  const approveBtnStyle = {
    backgroundColor: "#000",
    color: "#fff",
    border: "1px solid #000",
    padding: "12px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
    marginRight: "10px"
  };

  const rejectBtnStyle = {
    backgroundColor: "#fff",
    color: "#111",
    border: "1px solid #d9d9d9",
    padding: "12px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600"
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: "38px", fontWeight: "700" }}>
          Event Approvals
        </h1>
        <p style={{ margin: "8px 0 0 0", color: "#6b7280", fontSize: "20px" }}>
          Review and approve event submissions
        </p>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ marginBottom: "10px", fontWeight: "600" }}>
          Search Events
        </div>

        <input
          type="text"
          placeholder="Search by event title or manager name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <div style={countBoxStyle}>
          <strong>{filteredEvents.length}</strong> pending approval(s)
        </div>

        {filteredEvents.map((event, index) => (
          <div key={index} style={cardStyle}>
            <div style={{ fontSize: "20px", fontWeight: "700" }}>
              {event.title}
            </div>

            <div style={tagStyle}>{event.category}</div>

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
                paddingTop: "16px",
                marginBottom: "18px",
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "10px"
              }}
            >
              <div style={{ color: "#6b7280", fontSize: "17px" }}>
                <strong>Manager:</strong> {event.manager}
                <br />
                <span style={{ display: "inline-block", marginTop: "10px" }}>
                  <strong>Submitted:</strong> {event.submitted}
                </span>
              </div>

              <div style={{ color: "#6b7280", fontSize: "17px" }}>
                <strong>Email:</strong> {event.email}
              </div>
            </div>

            <div>
              <button style={approveBtnStyle}>◔ Approve Event</button>
              <button style={rejectBtnStyle}>⊗ Reject Event</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventApprovalsPage;