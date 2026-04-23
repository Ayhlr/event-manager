function AdminHomePage() {
  const managerRequests = [
    { name: "Sarah Ahmed", email: "sarah.ahmed@ku.edu.kw", date: "2026-03-25" },
    { name: "Mohammed Ali", email: "m.ali@ku.edu.kw", date: "2026-03-24" },
    { name: "Fatima Hassan", email: "f.hassan@ku.edu.kw", date: "2026-03-23" }
  ];

  const eventApprovals = [
    { title: "Spring Music Festival", manager: "Ahmed Khan", date: "2026-03-26" },
    { title: "Tech Innovation Summit", manager: "Layla Saleh", date: "2026-03-25" },
    { title: "Football Tournament Finals", manager: "Omar Yousef", date: "2026-03-24" }
  ];

  const activeManagers = [
    { name: "Ahmed Khan", email: "a.khan@ku.edu.kw", events: 8, status: "Active" },
    { name: "Layla Saleh", email: "l.saleh@ku.edu.kw", events: 12, status: "Active" },
    { name: "Omar Yousef", email: "o.yousef@ku.edu.kw", events: 5, status: "Active" }
  ];

  const statCardStyle = {
    flex: 1,
    minWidth: "220px",
    border: "1px solid #d9d9d9",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px"
  };

  const sectionBoxStyle = {
    flex: 1,
    border: "1px solid #d9d9d9",
    backgroundColor: "#fff",
    borderRadius: "8px"
  };

  const itemBoxStyle = {
    border: "1px solid #d9d9d9",
    padding: "14px 16px",
    marginBottom: "12px",
    backgroundColor: "#fff",
    borderRadius: "6px"
  };

  const actionButtonStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #d9d9d9",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontWeight: "500",
    borderRadius: "6px"
  };

  const tableCellStyle = {
    borderTop: "1px solid #d9d9d9",
    padding: "14px 12px",
    textAlign: "left"
  };

  const statusStyle = {
    border: "1px solid #d9d9d9",
    padding: "4px 12px",
    display: "inline-block",
    backgroundColor: "#fff",
    borderRadius: "6px"
  };

  return (
    <div style={{ padding: "10px 20px 30px 20px", backgroundColor: "#f6f7f9", minHeight: "100vh" }}>
      <div style={{ marginBottom: "30px", borderBottom: "1px solid #d9d9d9", paddingBottom: "16px" }}>
        <h1 style={{ margin: 0, fontSize: "38px", fontWeight: "700" }}>Admin Dashboard</h1>
        <p style={{ margin: "8px 0 0 0", color: "#6b7280", fontSize: "20px" }}>
          Overview of Event-it platform
        </p>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h3 style={{ marginBottom: "16px" }}>System Overview</h3>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "36px" }}>
          <div style={statCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontSize: "32px" }}>📄</div>
              <div style={{ fontSize: "24px", fontWeight: "700" }}>5</div>
            </div>
            <div style={{ marginTop: "16px", fontWeight: "600" }}>Pending Manager Requests</div>
            <div style={{ color: "#6b7280", marginTop: "6px" }}>Awaiting approval</div>
          </div>

          <div style={statCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontSize: "32px" }}>👥</div>
              <div style={{ fontSize: "24px", fontWeight: "700" }}>12</div>
            </div>
            <div style={{ marginTop: "16px", fontWeight: "600" }}>Active Managers</div>
            <div style={{ color: "#6b7280", marginTop: "6px" }}>Currently approved</div>
          </div>

          <div style={statCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontSize: "32px" }}>📅</div>
              <div style={{ fontSize: "24px", fontWeight: "700" }}>8</div>
            </div>
            <div style={{ marginTop: "16px", fontWeight: "600" }}>Pending Event Approvals</div>
            <div style={{ color: "#6b7280", marginTop: "6px" }}>Awaiting review</div>
          </div>

          <div style={statCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontSize: "32px" }}>✅</div>
              <div style={{ fontSize: "24px", fontWeight: "700" }}>45</div>
            </div>
            <div style={{ marginTop: "16px", fontWeight: "600" }}>Approved Events</div>
            <div style={{ color: "#6b7280", marginTop: "6px" }}>Published events</div>
          </div>
        </div>

        <h3 style={{ marginBottom: "16px" }}>Recent Activity</h3>

        <div style={{ display: "flex", gap: "18px", flexWrap: "wrap", marginBottom: "36px" }}>
          <div style={sectionBoxStyle}>
            <div style={{ padding: "18px", borderBottom: "1px solid #d9d9d9" }}>
              <div style={{ fontWeight: "700", fontSize: "20px" }}>Manager Requests</div>
              <div style={{ color: "#6b7280", marginTop: "6px" }}>Latest signup requests</div>
            </div>

            <div style={{ padding: "18px" }}>
              {managerRequests.map((request, index) => (
                <div key={index} style={itemBoxStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "18px" }}>{request.name}</div>
                      <div style={{ color: "#6b7280", marginTop: "6px" }}>{request.email}</div>
                    </div>
                    <div style={{ color: "#6b7280", fontWeight: "500" }}>{request.date}</div>
                  </div>
                </div>
              ))}
              <button style={actionButtonStyle}>View All Requests →</button>
            </div>
          </div>

          <div style={sectionBoxStyle}>
            <div style={{ padding: "18px", borderBottom: "1px solid #d9d9d9" }}>
              <div style={{ fontWeight: "700", fontSize: "20px" }}>Event Approvals</div>
              <div style={{ color: "#6b7280", marginTop: "6px" }}>Latest event submissions</div>
            </div>

            <div style={{ padding: "18px" }}>
              {eventApprovals.map((event, index) => (
                <div key={index} style={itemBoxStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "18px" }}>{event.title}</div>
                      <div style={{ color: "#6b7280", marginTop: "6px" }}>by {event.manager}</div>
                    </div>
                    <div style={{ color: "#6b7280", fontWeight: "500" }}>{event.date}</div>
                  </div>
                </div>
              ))}
              <button style={actionButtonStyle}>View All Pending Events →</button>
            </div>
          </div>
        </div>

        <h3 style={{ marginBottom: "16px" }}>Active Managers</h3>

        <div style={{ border: "1px solid #d9d9d9", backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ padding: "16px 12px", textAlign: "left" }}>Name</th>
                <th style={{ padding: "16px 12px", textAlign: "left" }}>Email</th>
                <th style={{ padding: "16px 12px", textAlign: "left" }}>Events Created</th>
                <th style={{ padding: "16px 12px", textAlign: "left" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {activeManagers.map((manager, index) => (
                <tr key={index}>
                  <td style={tableCellStyle}>{manager.name}</td>
                  <td style={tableCellStyle}>{manager.email}</td>
                  <td style={tableCellStyle}>{manager.events}</td>
                  <td style={tableCellStyle}>
                    <span style={statusStyle}>{manager.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ padding: "18px" }}>
            <button style={actionButtonStyle}>View All Managers →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHomePage;