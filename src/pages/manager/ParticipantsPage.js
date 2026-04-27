import { useEffect, useState } from "react";
import { Table, Card, Form, Button } from "react-bootstrap";
import { apiRequest } from "../../api";

function ParticipantsPage() {
  const [participants, setParticipants] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/registrations/manager-participants");

      const realParticipants = Array.isArray(data)
        ? data
        : data.participants || [];

      setParticipants(realParticipants);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const handleRevokePoints = async (participant) => {
    try {
      if (!participant.pointsHistoryId) {
        alert("No points record found for this participant.");
        return;
      }

      const confirmAction = window.confirm(
        "Are you sure you want to revoke this student's points?"
      );

      if (!confirmAction) return;

      await apiRequest(`/points-history/${participant.pointsHistoryId}/status`, "PUT", {
        status: "revoked"
      });

      alert("Points revoked successfully.");
      fetchParticipants();
    } catch (err) {
      alert(err.message);
    }
  };

  const getName = (participant) => {
    return (
      participant.name ||
      `${participant.user?.firstName || ""} ${participant.user?.lastName || ""}`.trim() ||
      "Unknown Student"
    );
  };

  const getEmail = (participant) => {
    return participant.email || participant.user?.email || "No email";
  };

  const getStudentId = (participant) => {
    return participant.studentId || participant.user?.studentId || "No ID";
  };

  const getJoinedDate = (participant) => {
    const dateValue = participant.joinedAt || participant.createdAt;

    if (!dateValue) return "No date";

    return new Date(dateValue).toLocaleDateString();
  };

  const getStatus = (participant) => {
    if (!participant.status) return "confirmed";
    return participant.status;
  };

  const getEventName = (participant) => {
    return participant.event?.title || "Untitled Event";
  };

  const filtered = participants.filter((participant) => {
    const searchValue = search.toLowerCase();

    const name = getName(participant).toLowerCase();
    const email = getEmail(participant).toLowerCase();
    const studentId = getStudentId(participant).toLowerCase();
    const eventName = getEventName(participant).toLowerCase();

    return (
      name.includes(searchValue) ||
      email.includes(searchValue) ||
      studentId.includes(searchValue) ||
      eventName.includes(searchValue)
    );
  });

  const confirmedCount = participants.filter(
    (p) => getStatus(p).toLowerCase() === "confirmed"
  ).length;

  const pendingPointsCount = participants.filter(
    (p) => p.pointsStatus === "pending"
  ).length;

  const totalCapacity = participants.reduce((total, participant) => {
    return total + Number(participant.event?.capacity || 0);
  }, 0);

  const handleExport = () => {
    if (participants.length === 0) {
      alert("No participants to export.");
      return;
    }

    const header =
      "Name,Email,Student ID,Event,Joined Date,Status,Points Status,Points\n";

    const rows = participants
      .map((participant) => {
        return [
          getName(participant),
          getEmail(participant),
          getStudentId(participant),
          getEventName(participant),
          getJoinedDate(participant),
          getStatus(participant),
          participant.pointsStatus || "none",
          participant.points || 0
        ].join(",");
      })
      .join("\n");

    const csvContent = header + rows;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "participants.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Participants</h2>
        <p>Loading participants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Participants</h2>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Participants</h2>
      <p style={{ color: "#666" }}>View and manage event participants</p>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <Card style={{ padding: "15px", flex: 1 }}>
          <small>Total Participants</small>
          <h3>{participants.length}</h3>
          <small>of {totalCapacity} total capacity</small>
        </Card>

        <Card style={{ padding: "15px", flex: 1, background: "#e6f4ea" }}>
          <small>Confirmed</small>
          <h3>{confirmedCount}</h3>
        </Card>

        <Card style={{ padding: "15px", flex: 1 }}>
          <small>Pending Points</small>
          <h3>{pendingPointsCount}</h3>
        </Card>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <Form.Control
          placeholder="Search by name, email, student ID, or event..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button variant="light" onClick={handleExport}>
          Export List
        </Button>
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: "#666" }}>No participants found.</p>
      ) : (
        <Table bordered responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Student ID</th>
              <th>Event</th>
              <th>Joined Date</th>
              <th>Status</th>
              <th>Points</th>
              <th>Points Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((participant) => {
              const status = getStatus(participant);
              const pointsStatus = participant.pointsStatus || "none";

              return (
                <tr key={participant._id}>
                  <td>{getName(participant)}</td>
                  <td>{getEmail(participant)}</td>
                  <td>{getStudentId(participant)}</td>
                  <td>{getEventName(participant)}</td>
                  <td>{getJoinedDate(participant)}</td>

                  <td>
                    <span
                      style={{
                        padding: "5px 10px",
                        border: "1px solid",
                        color:
                          status.toLowerCase() === "confirmed"
                            ? "green"
                            : "black"
                      }}
                    >
                      {status.toUpperCase()}
                    </span>
                  </td>

                  <td>{participant.points || 0}</td>

                  <td>
                    <span
                      style={{
                        padding: "5px 10px",
                        border: "1px solid",
                        color:
                          pointsStatus === "pending"
                            ? "#888"
                            : pointsStatus === "earned"
                            ? "green"
                            : pointsStatus === "revoked"
                            ? "red"
                            : "black"
                      }}
                    >
                      {pointsStatus.toUpperCase()}
                    </span>
                  </td>

                  <td>
                    {pointsStatus === "pending" ? (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRevokePoints(participant)}
                      >
                        Revoke Points
                      </Button>
                    ) : (
                      <span style={{ color: "#777" }}>No action</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default ParticipantsPage;