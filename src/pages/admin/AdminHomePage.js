import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../api";

function AdminDashboardPage() {
  const navigate = useNavigate();

  const [managerRequests, setManagerRequests] = useState([]);
  const [events, setEvents] = useState([]);
  const [approvedManagers, setApprovedManagers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const managerRequestsData = await apiRequest("/manager-requests");
      const eventsData = await apiRequest("/events/admin/all");
      const approvedManagersData = await apiRequest(
        "/manager-requests/approved-managers"
      );

      setManagerRequests(Array.isArray(managerRequestsData) ? managerRequestsData : []);
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setApprovedManagers(
        Array.isArray(approvedManagersData) ? approvedManagersData : []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const pendingManagerRequests = managerRequests.filter(
    (request) => request.status === "pending"
  );

  const pendingEvents = events.filter((event) => event.status === "pending");
  const approvedEvents = events.filter((event) => event.status === "approved");

  const recentManagerRequests = pendingManagerRequests.slice(0, 3);
  const recentPendingEvents = pendingEvents.slice(0, 3);
  const recentManagers = approvedManagers.slice(0, 3);

  const formatDate = (dateValue) => {
    if (!dateValue) return "No date";
    return new Date(dateValue).toLocaleDateString();
  };

  const getManagerName = (manager) => {
    if (manager.name) return manager.name;

    const firstName = manager.user?.firstName || "";
    const lastName = manager.user?.lastName || "";

    return `${firstName} ${lastName}`.trim() || "Unknown Manager";
  };

  const getManagerEmail = (manager) => {
    return manager.email || manager.user?.email || "No email";
  };

  const getEventCreator = (event) => {
    if (event.user?.firstName || event.user?.lastName) {
      return `${event.user?.firstName || ""} ${event.user?.lastName || ""}`.trim();
    }

    return event.clubName || "Event Manager";
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <h2>Admin Dashboard</h2>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageStyle}>
        <h2>Admin Dashboard</h2>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: "34px", fontWeight: "700" }}>
          Admin Dashboard
        </h1>

        <p style={{ margin: "8px 0 0", color: "#6b7280" }}>
          Overview of Event-it platform
        </p>
      </div>

      <div style={{ maxWidth: "1150px", margin: "0 auto" }}>
        <h3 style={{ marginBottom: "15px" }}>System Overview</h3>

        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <div style={statTopStyle}>
              <span style={{ fontSize: "22px" }}>📄</span>
              <strong>{pendingManagerRequests.length}</strong>
            </div>
            <p style={statTitleStyle}>Pending Manager Requests</p>
            <small style={mutedStyle}>Awaiting approval</small>
          </div>

          <div style={statCardStyle}>
            <div style={statTopStyle}>
              <span style={{ fontSize: "22px" }}>👥</span>
              <strong>{approvedManagers.length}</strong>
            </div>
            <p style={statTitleStyle}>Active Managers</p>
            <small style={mutedStyle}>Currently approved</small>
          </div>

          <div style={statCardStyle}>
            <div style={statTopStyle}>
              <span style={{ fontSize: "22px" }}>🗓️</span>
              <strong>{pendingEvents.length}</strong>
            </div>
            <p style={statTitleStyle}>Pending Event Approvals</p>
            <small style={mutedStyle}>Awaiting review</small>
          </div>

          <div style={statCardStyle}>
            <div style={statTopStyle}>
              <span style={{ fontSize: "22px" }}>✅</span>
              <strong>{approvedEvents.length}</strong>
            </div>
            <p style={statTitleStyle}>Approved Events</p>
            <small style={mutedStyle}>Published events</small>
          </div>
        </div>

        <h3 style={{ marginTop: "30px", marginBottom: "15px" }}>
          Recent Activity
        </h3>

        <div style={activityGridStyle}>
          <div style={sectionCardStyle}>
            <div style={sectionHeaderStyle}>
              <strong>Manager Requests</strong>
              <small style={mutedStyle}>Latest signup requests</small>
            </div>

            <div style={sectionBodyStyle}>
              {recentManagerRequests.length === 0 ? (
                <p style={mutedStyle}>No pending manager requests.</p>
              ) : (
                recentManagerRequests.map((request) => (
                  <div key={request._id} style={listItemStyle}>
                    <div>
                      <strong>{getManagerName(request)}</strong>
                      <br />
                      <small style={mutedStyle}>{getManagerEmail(request)}</small>
                    </div>

                    <small>{formatDate(request.date || request.createdAt)}</small>
                  </div>
                ))
              )}

              <button
                style={wideButtonStyle}
                onClick={() => navigate("/admin/manager-requests")}
              >
                View All Requests →
              </button>
            </div>
          </div>

          <div style={sectionCardStyle}>
            <div style={sectionHeaderStyle}>
              <strong>Event Approvals</strong>
              <small style={mutedStyle}>Latest event submissions</small>
            </div>

            <div style={sectionBodyStyle}>
              {recentPendingEvents.length === 0 ? (
                <p style={mutedStyle}>No pending event approvals.</p>
              ) : (
                recentPendingEvents.map((event) => (
                  <div key={event._id} style={listItemStyle}>
                    <div>
                      <strong>{event.title}</strong>
                      <br />
                      <small style={mutedStyle}>by {getEventCreator(event)}</small>
                    </div>

                    <small>{formatDate(event.submittedAt || event.createdAt)}</small>
                  </div>
                ))
              )}

              <button
                style={wideButtonStyle}
                onClick={() => navigate("/admin/event-approvals")}
              >
                View All Pending Events →
              </button>
            </div>
          </div>
        </div>

        <h3 style={{ marginTop: "30px", marginBottom: "15px" }}>
          Active Managers
        </h3>

        <div style={sectionCardStyle}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Approval Date</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentManagers.length === 0 ? (
                <tr>
                  <td style={tdStyle} colSpan="4">
                    No active managers found.
                  </td>
                </tr>
              ) : (
                recentManagers.map((manager) => (
                  <tr key={manager._id}>
                    <td style={tdStyle}>{getManagerName(manager)}</td>
                    <td style={tdStyle}>{getManagerEmail(manager)}</td>
                    <td style={tdStyle}>
                      {formatDate(manager.approvalDate || manager.updatedAt)}
                    </td>
                    <td style={tdStyle}>
                      <span style={statusStyle}>Active</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <button
            style={wideButtonStyle}
            onClick={() => navigate("/admin/managers")}
          >
            View All Managers →
          </button>
        </div>
      </div>
    </div>
  );
}

const pageStyle = {
  padding: "10px 20px 30px 20px",
  backgroundColor: "#f6f7f9",
  minHeight: "100vh"
};

const headerStyle = {
  marginBottom: "24px",
  borderBottom: "1px solid #d9d9d9",
  paddingBottom: "16px"
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px"
};

const statCardStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  backgroundColor: "white",
  padding: "18px"
};

const statTopStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px"
};

const statTitleStyle = {
  margin: "0 0 5px",
  fontWeight: "600"
};

const mutedStyle = {
  color: "#6b7280"
};

const activityGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
  gap: "20px"
};

const sectionCardStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  backgroundColor: "white",
  overflow: "hidden"
};

const sectionHeaderStyle = {
  padding: "16px",
  borderBottom: "1px solid #ddd",
  display: "flex",
  flexDirection: "column",
  gap: "5px"
};

const sectionBodyStyle = {
  padding: "16px"
};

const listItemStyle = {
  border: "1px solid #ddd",
  borderRadius: "6px",
  padding: "12px",
  marginBottom: "10px",
  display: "flex",
  justifyContent: "space-between",
  gap: "15px"
};

const wideButtonStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #111",
  borderRadius: "6px",
  backgroundColor: "white",
  cursor: "pointer",
  fontWeight: "600",
  marginTop: "10px"
};

const thStyle = {
  textAlign: "left",
  padding: "14px",
  borderBottom: "1px solid #ddd"
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #eee"
};

const statusStyle = {
  border: "1px solid #ddd",
  padding: "5px 12px",
  borderRadius: "5px",
  backgroundColor: "white"
};

export default AdminDashboardPage;