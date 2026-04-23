import { ProgressBar, Button, Card } from "react-bootstrap";

function MyCreatedEventsPage() {
  const events = [
    {
      title: "Spring Music Festival",
      category: "Music",
      date: "2026-04-15",
      location: "Main Auditorium",
      attendees: 342,
      capacity: 500
    },
    {
      title: "Art Workshop",
      category: "Performance",
      date: "2026-04-25",
      location: "Gallery Hall",
      attendees: 76,
      capacity: 100
    }
  ];

  const percent = (a, c) => Math.round((a / c) * 100);

  return (
    <div style={{ padding: "20px" }}>
      
      <h2>My Created Events</h2>
      <p style={{ color: "#666" }}>Manage all your created events</p>

      {/* Stats */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <Card style={{ padding: "15px", flex: 1 }}>
          <small>Total Events</small>
          <h3>3</h3>
        </Card>
        <Card style={{ padding: "15px", flex: 1 }}>
          <small>Active Events</small>
          <h3>2</h3>
        </Card>
        <Card style={{ padding: "15px", flex: 1 }}>
          <small>Completed Events</small>
          <h3>1</h3>
        </Card>
      </div>

      <h4>Active Events</h4>

      {events.map((e, i) => (
        <Card key={i} style={{ padding: "20px", marginBottom: "20px" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h5>{e.title} <span style={{ border: "1px solid #ccc", padding: "3px 6px", marginLeft: "10px" }}>{e.category}</span></h5>
              <p>{e.date} • {e.location}</p>
            </div>

            <div>
              {e.attendees} / {e.capacity}
            </div>
          </div>

          <ProgressBar
            now={percent(e.attendees, e.capacity)}
            style={{ margin: "10px 0" }}
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <Button variant="light">View</Button>
            <Button variant="secondary">Edit</Button>
            <Button variant="outline-danger">Delete</Button>
          </div>

        </Card>
      ))}

    </div>
  );
}

export default MyCreatedEventsPage;