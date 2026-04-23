import { useState } from "react";

function ProfilePage() {
  const [firstName, setFirstName] = useState("Ahmed");
  const [lastName, setLastName] = useState("Al-Mutairi");
  const [email, setEmail] = useState("ahmed.mutairi@ku.edu.kw");
  const [phone, setPhone] = useState("+965 9999 9999");
  const [bio, setBio] = useState(
    "Computer Science student passionate about technology and innovation."
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

  const cardStyle = {
    border: "1px solid #d9d9d9",
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "24px"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #d9d9d9",
    borderRadius: "8px",
    fontSize: "16px",
    backgroundColor: "#fff",
    outline: "none"
  };

  const textareaStyle = {
    width: "100%",
    minHeight: "120px",
    padding: "12px 14px",
    border: "1px solid #d9d9d9",
    borderRadius: "8px",
    fontSize: "16px",
    backgroundColor: "#fff",
    outline: "none",
    resize: "none"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600"
  };

  const darkBtnStyle = {
    backgroundColor: "#000",
    color: "#fff",
    border: "1px solid #000",
    padding: "12px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600"
  };

  const lightBtnStyle = {
    backgroundColor: "#fff",
    color: "#111",
    border: "1px solid #d9d9d9",
    padding: "12px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600"
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: "38px", fontWeight: "700" }}>
          Profile
        </h1>
        <p style={{ margin: "8px 0 0 0", color: "#6b7280", fontSize: "20px" }}>
          Manage your account information
        </p>
      </div>

      <div
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "340px 1fr",
          gap: "24px",
          alignItems: "start"
        }}
      >
        <div style={cardStyle}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "120px",
                height: "120px",
                margin: "0 auto 18px auto",
                border: "2px solid #222",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "52px"
              }}
            >
              👤
            </div>

            <h2 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>
              Ahmed Al-Mutairi
            </h2>
            <div style={{ color: "#6b7280", marginBottom: "22px" }}>Student</div>
          </div>

          <div style={{ color: "#4b5563", marginBottom: "12px" }}>
            ✉ ahmed.mutairi@ku.edu.kw
          </div>
          <div style={{ color: "#4b5563", marginBottom: "22px" }}>
            ☎ +965 9999 9999
          </div>

          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              paddingTop: "18px"
            }}
          >
            <div style={{ fontWeight: "700", marginBottom: "16px" }}>
              Quick Stats
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
                color: "#4b5563"
              }}
            >
              <span>⚲ Total Points</span>
              <strong style={{ color: "#111" }}>225</strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "#4b5563"
              }}
            >
              <span>📅 Events Joined</span>
              <strong style={{ color: "#111" }}>12</strong>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px"
            }}
          >
            <h2 style={{ margin: 0, fontSize: "28px" }}>Edit Profile</h2>
            <button style={lightBtnStyle}>✎ Edit</button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "16px"
            }}
          >
            <div>
              <label style={labelStyle}>First Name</label>
              <input
                style={inputStyle}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div>
              <label style={labelStyle}>Last Name</label>
              <input
                style={inputStyle}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Email</label>
            <input
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Phone Number</label>
            <input
              style={inputStyle}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Bio</label>
            <textarea
              style={textareaStyle}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "8px" }}>
            <label style={labelStyle}>Student ID</label>
            <input
              style={{ ...inputStyle, backgroundColor: "#f3f4f6", color: "#777" }}
              value="2021450123"
              disabled
            />
            <div style={{ color: "#6b7280", marginTop: "8px" }}>
              Student ID cannot be changed
            </div>
          </div>

          <div style={{ marginTop: "28px", display: "flex", gap: "10px" }}>
            <button style={darkBtnStyle}>Save Changes</button>
            <button style={lightBtnStyle}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;