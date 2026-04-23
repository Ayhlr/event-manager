import { useState } from "react";
import { Table, Card, Form, Button } from "react-bootstrap";

function ParticipantsPage() {
  const [search, setSearch] = useState("");

  const participants = [
    {
      name: "Ahmed Al-Mutairi",
      email: "ahmed.mutairi@ku.edu.kw",
      id: "2021450123",
      date: "2026-03-20",
      status: "Confirmed"
    },
    {
      name: "Sarah Al-Ahmad",
      email: "sarah.ahmad@ku.edu.kw",
      id: "2021450456",
      date: "2026-03-19",
      status: "Confirmed"
    },
    {
      name: "Mohammed Al-Salem",
      email: "mohammed.salem@ku.edu.kw",
      id: "2021450789",
      date: "2026-03-18",
      status: "Pending"
    }
  ];

  const filtered = participants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      
      <h2>Participants</h2>
      <p style={{ color: "#666" }}>View and manage event participants</p>

      {/* Stats */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <Card style={{ padding: "15px", flex: 1 }}>
          <small>Total Participants</small>
          <h3>3</h3>
          <small>of 500 capacity</small>
        </Card>

        <Card style={{ padding: "15px", flex: 1, background: "#e6f4ea" }}>
          <small>Confirmed</small>
          <h3>2</h3>
        </Card>

        <Card style={{ padding: "15px", flex: 1 }}>
          <small>Pending</small>
          <h3>1</h3>
        </Card>
      </div>

      {/* Search */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <Form.Control
          placeholder="Search by name, email, or student ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="light">Export List</Button>
      </div>

      {/* Table */}
      <Table bordered>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Student ID</th>
            <th>Joined Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((p, i) => (
            <tr key={i}>
              <td>{p.name}</td>
              <td>{p.email}</td>
              <td>{p.id}</td>
              <td>{p.date}</td>
              <td>
                <span style={{
                  padding: "5px 10px",
                  border: "1px solid",
                  color: p.status === "Confirmed" ? "green" : "black"
                }}>
                  {p.status.toUpperCase()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

    </div>
  );
}

export default ParticipantsPage;