import { useState } from "react";

function ManageManagersPage() {
  const [search, setSearch] = useState("");

  const managers = [
    {
      name: "Ahmed Khan",
      email: "a.khan@ku.edu.kw",
      approvalDate: "2026-01-15",
      duration: "Open-ended",
      expiryDate: "N/A",
      status: "Active"
    },
    {
      name: "Layla Saleh",
      email: "l.saleh@ku.edu.kw",
      approvalDate: "2026-02-10",
      duration: "6 months",
      expiryDate: "2026-08-10",
      status: "Active"
    },
    {
      name: "Omar Yousef",
      email: "o.yousef@ku.edu.kw",
      approvalDate: "2026-03-01",
      duration: "Open-ended",
      expiryDate: "N/A",
      status: "Active"
    },
    {
      name: "Nora Abdullah",
      email: "n.abdullah@ku.edu.kw",
      approvalDate: "2025-12-20",
      duration: "3 months",
      expiryDate: "2026-03-20",
      status: "Expired"
    }
  ];

  const filteredManagers = managers.filter(
    (manager) =>
      manager.name.toLowerCase().includes(search.toLowerCase()) ||
      manager.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = filteredManagers.filter(
    (manager) => manager.status === "Active"
  ).length;

  const expiredCount = filteredManagers.filter(
    (manager) => manager.status === "Expired"
  ).length;

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

  const statBoxStyle = {
    flex: 1,
    border: "1px solid #d9d9d9",
    backgroundColor: "#fff",
    padding: "18px",
    borderRadius: "8px",
    fontSize: "18px"
  };

  const tableWrapperStyle = {
    marginTop: "22px",
    border: "1px solid #d9d9d9",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#fff"
  };

  const thStyle = {
    padding: "16px 14px",
    textAlign: "left",
    fontSize: "16px",
    borderBottom: "1px solid #d9d9d9"
  };

  const tdStyle = {
    padding: "20px 14px",
    textAlign: "left",
    borderBottom: "1px solid #d9d9d9",
    fontSize: "16px"
  };

  const statusStyle = {
    border: "1px solid #d9d9d9",
    padding: "6px 14px",
    display: "inline-block",
    backgroundColor: "#fff",
    borderRadius: "4px",
    fontWeight: "600"
  };

  const removeBtnStyle = {
    backgroundColor: "#fff",
    color: "#111",
    border: "1px solid #d9d9d9",
    padding: "10px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600"
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: "38px", fontWeight: "700" }}>
          Manage Managers
        </h1>
        <p style={{ margin: "8px 0 0 0", color: "#6b7280", fontSize: "20px" }}>
          View and manage approved event managers
        </p>
      </div>

      <div style={{ maxWidth: "1150px", margin: "0 auto" }}>
        <div style={{ marginBottom: "10px", fontWeight: "600" }}>
          Search Managers
        </div>

        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <div style={{ display: "flex", gap: "16px", marginTop: "22px", flexWrap: "wrap" }}>
          <div style={statBoxStyle}>
            <strong>{filteredManagers.length}</strong> total manager(s)
          </div>
          <div style={statBoxStyle}>
            <strong>{activeCount}</strong> active
          </div>
          <div style={statBoxStyle}>
            <strong>{expiredCount}</strong> expired
          </div>
        </div>

        <div style={tableWrapperStyle}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Manager Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Approval Date</th>
                <th style={thStyle}>Duration</th>
                <th style={thStyle}>Expiry Date</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredManagers.map((manager, index) => (
                <tr key={index}>
                  <td style={tdStyle}><strong>{manager.name}</strong></td>
                  <td style={tdStyle}>{manager.email}</td>
                  <td style={tdStyle}>{manager.approvalDate}</td>
                  <td style={tdStyle}>{manager.duration}</td>
                  <td style={tdStyle}>{manager.expiryDate}</td>
                  <td style={tdStyle}>
                    <span style={statusStyle}>{manager.status}</span>
                  </td>
                  <td style={tdStyle}>
                    <button style={removeBtnStyle}>🗑 Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageManagersPage;