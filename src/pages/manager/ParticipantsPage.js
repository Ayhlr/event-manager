import { useEffect, useState } from "react";
import { Table, Card, Form, Button, Modal } from "react-bootstrap";
import { apiRequest } from "../../api";

function ParticipantsPage() {
  const [participants, setParticipants] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [isRevoking, setIsRevoking] = useState(false);
  const [modalError, setModalError] = useState("");

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

  const openRevokeModal = (participant) => {
    if (!participant.pointsHistoryId) {
      setModalError("No points record found for this organizer.");
      setSelectedParticipant(participant);
      setShowRevokeModal(true);
      return;
    }

    setModalError("");
    setSelectedParticipant(participant);
    setShowRevokeModal(true);
  };

  const closeRevokeModal = () => {
    if (isRevoking) return;

    setShowRevokeModal(false);
    setSelectedParticipant(null);
    setModalError("");
  };

  const confirmRevokePoints = async () => {
    try {
      if (!selectedParticipant?.pointsHistoryId) {
        setModalError("No points record found for this organizer.");
        return;
      }

      setIsRevoking(true);
      setModalError("");

      await apiRequest(
        `/points-history/${selectedParticipant.pointsHistoryId}/status`,
        "PUT",
        {
          status: "revoked"
        }
      );

      await fetchParticipants();
      closeRevokeModal();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setIsRevoking(false);
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
    const getEventDateTime = (participant) => {
  if (!participant.event?.date) return null;

  const eventDate = new Date(participant.event.date);

  if (Number.isNaN(eventDate.getTime())) return null;

  let hours = 23;
  let minutes = 59;

  if (participant.event.time) {
    const timeString = String(participant.event.time).trim();

    const match = timeString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);

    if (match) {
      hours = Number(match[1]);
      minutes = Number(match[2]);

      const period = match[3]?.toUpperCase();

      if (period === "PM" && hours !== 12) {
        hours += 12;
      }

      if (period === "AM" && hours === 12) {
        hours = 0;
      }
    }
  }

  eventDate.setHours(hours, minutes, 0, 0);
  return eventDate;
};

const hasEventFinished = (participant) => {
  const eventDateTime = getEventDateTime(participant);

  if (!eventDateTime) return false;

  return new Date() >= eventDateTime;
};

const canShowRevokeButton = (participant, pointsStatus) => {
  return (
    pointsStatus === "pending" &&
    participant.canRevokePoints === true &&
    hasEventFinished(participant)
  );
};
    return participant.event?.title || "Untitled Event";
  };
const getEventDateTime = (participant) => {
  if (!participant.event?.date) return null;

  const eventDate = new Date(participant.event.date);

  if (Number.isNaN(eventDate.getTime())) return null;

  let hours = 23;
  let minutes = 59;

  if (participant.event.time) {
    const timeString = String(participant.event.time).trim();

    const match = timeString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);

    if (match) {
      hours = Number(match[1]);
      minutes = Number(match[2]);

      const period = match[3]?.toUpperCase();

      if (period === "PM" && hours !== 12) {
        hours += 12;
      }

      if (period === "AM" && hours === 12) {
        hours = 0;
      }
    }
  }

  eventDate.setHours(hours, minutes, 0, 0);
  return eventDate;
};

const hasEventFinished = (participant) => {
  const eventDateTime = getEventDateTime(participant);

  if (!eventDateTime) return false;

  return new Date() >= eventDateTime;
};

const canShowRevokeButton = (participant, pointsStatus) => {
  return (
    pointsStatus === "pending" &&
    participant.canRevokePoints === true &&
    hasEventFinished(participant)
  );
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
    (p) => (p.pointsStatus || "").toLowerCase() === "pending"
  ).length;

  const totalCapacity = participants.reduce((total, participant) => {
    return total + Number(participant.event?.capacity || 0);
  }, 0);

  const handleExport = () => {
    if (participants.length === 0) {
      setModalError("No organizers to export.");
      setShowRevokeModal(true);
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
    link.download = "accepted-organizers.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <h2>Participants</h2>
        <p>Loading accepted organizers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageStyle}>
        <h2>Participants</h2>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <h2>Participants</h2>
      <p style={{ color: "#666" }}>
        View accepted organizers and manage their points
      </p>

      <div style={summaryContainer}>
        <Card style={summaryCard}>
          <small>Total Accepted Organizers</small>
          <h3>{participants.length}</h3>
          <small>of {totalCapacity} total capacity</small>
        </Card>

        <Card style={summaryCard}>
          <small>Confirmed</small>
          <h3>{confirmedCount}</h3>
        </Card>

        <Card style={summaryCard}>
          <small>Pending Points</small>
          <h3>{pendingPointsCount}</h3>
        </Card>
      </div>

      <div style={searchRow}>
        <Form.Control
          placeholder="Search by name, email, student ID, or event..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button style={exportButton} onClick={handleExport}>
          Export List
        </Button>
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: "#666" }}>No accepted organizers found.</p>
      ) : (
        <div style={tableWrapper}>
          <Table bordered responsive style={tableStyle}>
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
                const pointsStatus = (
                  participant.pointsStatus || "none"
                ).toLowerCase();

                return (
                  <tr key={participant._id}>
                    <td>{getName(participant)}</td>
                    <td>{getEmail(participant)}</td>
                    <td>{getStudentId(participant)}</td>
                    <td>{getEventName(participant)}</td>
                    <td>{getJoinedDate(participant)}</td>

                    <td>
                      <span
                        style={
                          status.toLowerCase() === "confirmed"
                            ? greenBadge
                            : normalBadge
                        }
                      >
                        {status.toUpperCase()}
                      </span>
                    </td>

                    <td>
                      {pointsStatus === "none"
                        ? 0
                        : participant.points || 50}
                    </td>

                    <td>
                      <span
                        style={
                          pointsStatus === "earned"
                            ? greenBadge
                            : pointsStatus === "revoked"
                            ? redBadge
                            : pointsStatus === "pending"
                            ? yellowBadge
                            : normalBadge
                        }
                      >
                        {pointsStatus.toUpperCase()}
                      </span>
                    </td>

                   <td>
  {canShowRevokeButton(participant, pointsStatus) ? (
    <Button
      size="sm"
      onClick={() => openRevokeModal(participant)}
      style={revokeButton}
    >
      Revoke Points
    </Button>
  ) : pointsStatus === "pending" && !hasEventFinished(participant) ? (
    <span style={{ color: "#777" }}>Available after event</span>
  ) : pointsStatus === "pending" && hasEventFinished(participant) ? (
    <span style={{ color: "#777" }}>Pending review</span>
  ) : (
    <span style={{ color: "#777" }}>No action</span>
  )}
</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={showRevokeModal} onHide={closeRevokeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedParticipant ? "Revoke Points" : "Notice"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {modalError && (
            <p style={{ color: "#842029", marginBottom: "12px" }}>
              {modalError}
            </p>
          )}

          {selectedParticipant && selectedParticipant.pointsHistoryId && (
            <>
              <p>
                Are you sure you want to revoke points for{" "}
                <strong>{getName(selectedParticipant)}</strong>?
              </p>

              <div style={modalInfoBox}>
                <p style={modalInfoText}>
                  <strong>Event:</strong> {getEventName(selectedParticipant)}
                </p>
                <p style={modalInfoText}>
                  <strong>Points:</strong> {selectedParticipant.points || 50}
                </p>
                <p style={modalInfoText}>
                  <strong>Current Status:</strong>{" "}
                  {(selectedParticipant.pointsStatus || "pending").toUpperCase()}
                </p>
              </div>

              <p style={{ color: "#666", marginBottom: 0 }}>
                This action is only allowed while the points are still pending.
              </p>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={closeRevokeModal}
            disabled={isRevoking}
          >
            Cancel
          </Button>

          {selectedParticipant?.pointsHistoryId && (
            <Button
              onClick={confirmRevokePoints}
              disabled={isRevoking}
              style={confirmButton}
            >
              {isRevoking ? "Revoking..." : "Yes, Revoke"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

const pageStyle = {
  padding: "30px",
  minHeight: "100vh",
  backgroundColor: "#d9d9d9",
  color: "#030817"
};

const summaryContainer = {
  display: "flex",
  gap: "20px",
  marginBottom: "25px"
};

const summaryCard = {
  padding: "18px",
  flex: 1,
  backgroundColor: "#f9f9f9",
  color: "#030817",
  border: "1.5px solid #1a22383b",
  borderRadius: "16px",
  boxShadow: "0 6px 16px rgba(3, 8, 23, 0.08)"
};

const searchRow = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px"
};

const exportButton = {
  backgroundColor: "#1a2238",
  color: "#ffffff",
  border: "1px solid #1a2238",
  whiteSpace: "nowrap"
};

const tableWrapper = {
  backgroundColor: "#f9f9f9",
  border: "1.5px solid #1a22383b",
  borderRadius: "16px",
  padding: "15px",
  boxShadow: "0 6px 16px rgba(3, 8, 23, 0.46)"
};

const tableStyle = {
  backgroundColor: "#ffffff",
  marginBottom: 0
};

const badgeBase = {
  padding: "5px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold",
  display: "inline-block"
};

const greenBadge = {
  ...badgeBase,
  color: "#0f5132",
  backgroundColor: "#d1e7dd",
  border: "1px solid #0f5132"
};

const yellowBadge = {
  ...badgeBase,
  color: "#664d03",
  backgroundColor: "#fff3cd",
  border: "1px solid #664d03"
};

const redBadge = {
  ...badgeBase,
  color: "#842029",
  backgroundColor: "#f8d7da",
  border: "1px solid #842029"
};

const normalBadge = {
  ...badgeBase,
  color: "#030817",
  backgroundColor: "#f9f9f9",
  border: "1px solid #1a2238"
};

const revokeButton = {
  backgroundColor: "#842029",
  color: "#ffffff",
  border: "1px solid #842029"
};

const confirmButton = {
  backgroundColor: "#030817",
  color: "#ffffff",
  border: "1px solid #030817"
};

const modalInfoBox = {
  backgroundColor: "#f8f9fa",
  border: "1px solid #dee2e6",
  borderRadius: "10px",
  padding: "12px",
  marginBottom: "12px"
};

const modalInfoText = {
  marginBottom: "6px"
};

export default ParticipantsPage;