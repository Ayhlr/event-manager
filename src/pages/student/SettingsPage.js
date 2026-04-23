import Sidebar from "../../components/Sidebar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function SettingsPage() {
  return (
    <div style={{ display: "flex" }}>
      
      <Sidebar />

      <div style={{
        marginLeft: "250px",
        padding: "30px",
        width: "100%"
      }}>
        
        {/* Title */}
        <h2>Settings</h2>
        <p style={{ color: "#666" }}>
          Manage your account settings and preferences
        </p>

        {/* Account Info */}
        <div style={boxStyle}>
          <h4>Account Information</h4>

          <div style={{ display: "flex", gap: "40px", marginTop: "10px" }}>
            <div>
              <p>Email</p>
              <strong>ahmed.mutairi@ku.edu.kw</strong>
            </div>

            <div>
              <p>Account Type</p>
              <strong>Student</strong>
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

        {/* Change Password */}
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

        {/* Notifications */}
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

        {/* Privacy */}
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
  marginTop: "20px"
};

const activeStyle = {
  background: "lightgreen",
  padding: "3px 8px",
  borderRadius: "5px"
};

export default SettingsPage;