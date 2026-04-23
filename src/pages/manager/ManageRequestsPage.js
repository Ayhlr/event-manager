import { useState } from "react";
import { Card, Button } from "react-bootstrap";

function ManageRequestsPage() {
  const [filter, setFilter] = useState("All");

  const requests = [
    {
      name: "Ahmed Al-Mutairi",
      email: "ahmed.mutairi@ku.edu.kw",
      event: "Spring Music Festival",
      message: "I would like to perform at this event. I play the guitar...",
      status: "Pending",
      date: "2026-03-20"
    },
    {
      name: "Sarah Al-Ahmad",
      email: "sarah.ahmad@ku.edu.kw",
      event: "Spring Music Festival",
      message: "Can I help with organizing the sound equipment?",
      status: "Pending",
      date: "2026-03-19"
    },
    {
      name: "Fatima Al-Rashid",
      email: "fatima.rashid@ku.edu.kw",
      event: "Art Workshop",
      message: "Can I bring my photography collection to display?",
      status: "Rejected",
      date: "2026-03-15"
    }
  ];

  const filtered =
    filter === "All" ? requests : requests.filter(r => r.status === filter);

  return (
    <div style={{ padding: "20px" }}>
      
      <h2>Manage Requests</h2>
      <p style={{ color: "#666" }}>
        Review and respond to student requests for your events
      </p>

      {/* Stats */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <Card style={{ padding: "15px", flex: 1 }}>
          <small>Total Requests</small>
          <h3>4</h3>
        </Card>
        <Card style={{ padding: "15px", flex: 1 }}>
          <small>Pending</small>
          <h3>2</h3>
        </Card>
        <Card style={{ padding: "15px", flex: 1, background: "#e6f4ea" }}>
          <small>Approved</small>
          <h3>1</h3>
        </Card>
        <Card style={{ padding: "15px", flex: 1, background: "#fdecea" }}>
          <small>Rejected</small>
          <h3>1</h3>
        </Card>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {["All", "Pending", "Approved", "Rejected"].map(f => (
          <Button
            key={f}
            variant={filter === f ? "dark" : "light"}
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      {/* Requests List */}
      {filtered.map((r, i) => (
        <Card key={i} style={{ padding: "20px", marginBottom: "20px" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h5>
                {r.name}{" "}
                <span style={{
                  border: "1px solid #ccc",
                  padding: "3px 6px",
                  marginLeft: "10px"
                }}>
                  {r.status.toUpperCase()}
                </span>
              </h5>

              <p style={{ margin: 0 }}>{r.email}</p>
              <p><b>Event:</b> {r.event}</p>
            </div>

            <div>{r.date}</div>
          </div>

          <div style={{
            border: "1px solid #ddd",
            padding: "10px",
            margin: "10px 0"
          }}>
            {r.message}
          </div>

          {r.status === "Pending" && (
            <div style={{ display: "flex", gap: "10px" }}>
              <Button variant="dark">Approve</Button>
              <Button variant="outline-danger">Reject</Button>
            </div>
          )}
        </Card>
      ))}

    </div>
  );
}

export default ManageRequestsPage;