import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function SettingsPage() {
  return (
    <div
      style={{
        padding: "10px 20px 30px 20px",
        backgroundColor: "#f6f7f9",
        minHeight: "100vh"
      }}
    >
      <div
        style={{
          marginBottom: "30px",
          borderBottom: "1px solid #d9d9d9",
          paddingBottom: "16px"
        }}
      >
        <h1 style={{ margin: 0, fontSize: "38px", fontWeight: "700" }}>
          Settings
        </h1>
        <p style={{ margin: "8px 0 0 0", color: "#6b7280", fontSize: "20px" }}>
          Manage your account settings and preferences
        </p>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={boxStyle}>
          <h4>Account Information</h4>

          <div style={{ display: "flex", gap: "40px", marginTop: "10px", flexWrap: "wrap" }}>
            <div>
              <p>Email</p>
              <strong>ahmed.mutairi@ku.edu.kw</strong>
            </div>

            <div>
              <p>Account Type</p>
              <strong>Admin</strong>
            </div>

            <div>
              <p>Status</p>
              <span style={activeStyle}>ACTIVE</span>
            </div>
          </div>

          <p style={{ marginTop: "10px" }}>
            Member Since: <strong>January 2026</strong>
          </p>
        </div>

        <div style={boxStyle}>
          <h4>Change Password</h4>

          <Form>
            <Form.Group style={{ marginTop: "10px" }}>
              <Form.Label>Current Password</Form.Label>
              <Form.Control placeholder="Enter current password" />
            </Form.Group>

            <Form.Group style={{ marginTop: "10px" }}>
              <Form.Label>New Password</Form.Label>
              <Form.Control placeholder="Enter new password" />
            </Form.Group>

            <Form.Group style={{ marginTop: "10px" }}>
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control placeholder="Confirm new password" />
            </Form.Group>

            <Button style={{ marginTop: "15px" }} variant="dark">
              Change Password
            </Button>
          </Form>
        </div>

        <div style={boxStyle}>
          <h4>Notification Preferences</h4>

          <Form.Check label="Event Reminders" defaultChecked />
          <Form.Check label="New Events" defaultChecked />
          <Form.Check label="Request Updates" defaultChecked />
          <Form.Check label="Email Digest" />

          <Button style={{ marginTop: "15px" }} variant="dark">
            Save Preferences
          </Button>
        </div>

        <div style={boxStyle}>
          <h4>Privacy & Security</h4>

          <Form.Group>
            <Form.Label>Profile Visibility</Form.Label>
            <Form.Select>
              <option>Public</option>
              <option>Private</option>
            </Form.Select>
          </Form.Group>

          <div style={{ marginTop: "15px" }}>
            <Button variant="outline-dark">Download My Data</Button>{" "}
            <Button variant="danger">Delete Account</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const boxStyle = {
  border: "1px solid #ddd",
  padding: "20px",
  borderRadius: "10px",
  marginTop: "20px",
  backgroundColor: "white"
};

const activeStyle = {
  background: "lightgreen",
  padding: "3px 8px",
  borderRadius: "5px"
};

export default SettingsPage;