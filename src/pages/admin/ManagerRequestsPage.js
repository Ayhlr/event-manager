import { useState } from "react";

function ManagerRequestsPage() {
  const [search, setSearch] = useState("");

  const requests = [
    { name: "Sarah Ahmed", email: "sarah.ahmed@ku.edu.kw", requested: "2026-03-25" },
    { name: "Mohammed Ali", email: "m.ali@ku.edu.kw", requested: "2026-03-24" },
    { name: "Fatima Hassan", email: "f.hassan@ku.edu.kw", requested: "2026-03-23" },
    { name: "Ali Rashid", email: "a.rashid@ku.edu.kw", requested: "2026-03-22" },
    { name: "Noor Abdullah", email: "n.abdullah@ku.edu.kw", requested: "2026-03-21" }
  ];

  const filteredRequests = requests.filter((request) =>
    request.name.toLowerCase().includes(search.toLowerCase()) ||
    request.email.toLowerCase().includes(search.toLowerCase())
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
    padding: "24px",
    marginBottom: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px"
  };

  const approveBtnStyle = {
    backgroundColor: "#000",
    color: "#fff",
    border: "1px solid #000",
    padding: "12px 22px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    marginRight: "10px"
  };

  const rejectBtnStyle = {
    backgroundColor: "#fff",
    color: "#111",
    border: "1px solid #d9d9d9",
    padding: "12px 22px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600"
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: "38px", fontWeight: "700" }}>Manager Requests</h1>
        <p style={{ margin: "8px 0 0 0", color: "#6b7280", fontSize: "20px" }}>
          Review and approve manager applications
        </p>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ marginBottom: "10px", fontWeight: "600" }}>Search Requests</div>

        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <div style={countBoxStyle}>
          <strong>{filteredRequests.length}</strong> pending request(s)
        </div>

        {filteredRequests.map((request, index) => (
          <div key={index} style={cardStyle}>
            <div>
              <div style={{ fontSize: "20px", fontWeight: "700", marginBottom: "12px" }}>
                {request.name}
              </div>
              <div style={{ color: "#6b7280", marginBottom: "10px", fontSize: "17px" }}>
                <strong style={{ color: "#6b7280" }}>Email:</strong> {request.email}
              </div>
              <div style={{ color: "#6b7280", fontSize: "17px" }}>
                <strong style={{ color: "#6b7280" }}>Requested:</strong> {request.requested}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <button style={approveBtnStyle}>◔ Approve</button>
              <button style={rejectBtnStyle}>⊗ Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManagerRequestsPage;