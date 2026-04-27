import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { apiRequest } from "../../api";

function PointsHistoryPage() {
  const [pointsHistory, setPointsHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPointsHistory = async () => {
    try {
      setLoading(true);

      const data = await apiRequest("/points-history/my-points");

      const history = Array.isArray(data)
        ? data
        : data.pointsHistory || data.history || [];

      setPointsHistory(history);
    } catch (err) {
      console.log("Could not load points history:", err.message);
      setPointsHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPointsHistory();
  }, []);

  const earnedPoints = pointsHistory
    .filter((item) => item.status === "earned")
    .reduce((total, item) => total + Number(item.points || 0), 0);

  const pendingPoints = pointsHistory
    .filter((item) => item.status === "pending")
    .reduce((total, item) => total + Number(item.points || 0), 0);

  const completedEvents = pointsHistory.filter(
    (item) => item.status === "earned"
  ).length;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={pageStyle}>
        <h2>Points History</h2>
        <p style={{ color: "#666" }}>
          Track your organizer points and their current status
        </p>

        <div style={summaryContainer}>
          <div style={boxStyle}>
            <p>Total Points Gained</p>
            <h2>{earnedPoints}</h2>
          </div>

          <div style={boxStyle}>
            <p>Pending Points</p>
            <h2>{pendingPoints}</h2>
          </div>

          <div style={boxStyle}>
            <p>Completed Organizer Events</p>
            <h2>{completedEvents}</h2>
          </div>
        </div>

        <div style={historyBox}>
          <h4 style={{ padding: "15px", margin: 0 }}>Points Records</h4>

          {loading ? (
            <p style={emptyText}>Loading points...</p>
          ) : pointsHistory.length === 0 ? (
            <p style={emptyText}>No points history found.</p>
          ) : (
            pointsHistory.map((item) => (
              <PointRow key={item._id} item={item} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function PointRow({ item }) {
  const eventTitle =
    item.event?.title || item.eventId?.title || item.eventTitle || "Event";

  const date = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString()
    : "No date";

  const statusInfo = getStatusInfo(item.status);

  return (
    <div style={rowStyle}>
      <div>
        <h5 style={{ marginBottom: "5px" }}>{eventTitle}</h5>
        <small style={{ color: "#666" }}>{date}</small>
      </div>

      <div style={{ textAlign: "right" }}>
        <h5 style={{ marginBottom: "8px" }}>
          {Number(item.points || 0)} points
        </h5>

        <span
          style={{
            ...badgeStyle,
            backgroundColor: statusInfo.bg,
            color: statusInfo.color
          }}
        >
          {statusInfo.text}
        </span>

        {item.status === "pending" && (
          <small style={{ display: "block", marginTop: "6px", color: "#666" }}>
            {formatTimeLeft(item.timeLeftMs)} left
          </small>
        )}
      </div>
    </div>
  );
}
function getStatusInfo(status) {
  if (status === "earned") {
    return {
      text: "Gained",
      bg: "#d1e7dd",
      color: "#0f5132"
    };
  }

  if (status === "pending") {
    return {
      text: "Pending",
      bg: "#fff3cd",
      color: "#664d03"
    };
  }

  return {
    text: "Rejected",
    bg: "#f8d7da",
    color: "#842029"
  };
}


function formatTimeLeft(ms) {
  if (!ms || ms <= 0) {
    return "Almost done";
  }

  const totalMinutes = Math.ceil(ms / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

const pageStyle = {
  marginLeft: "250px",
  padding: "30px",
  width: "100%"
};

const summaryContainer = {
  display: "flex",
  gap: "20px",
  marginTop: "20px"
};

const boxStyle = {
  flex: 1,
  border: "1px solid #ddd",
  padding: "20px",
  borderRadius: "10px",
  backgroundColor: "white"
};

const historyBox = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  marginTop: "30px",
  backgroundColor: "white",
  overflow: "hidden"
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "18px 15px",
  borderTop: "1px solid #eee"
};

const badgeStyle = {
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "bold"
};

const emptyText = {
  padding: "15px",
  color: "#777",
  borderTop: "1px solid #eee"
};

export default PointsHistoryPage;