import Sidebar from "../../components/Sidebar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function ProfilePage() {
  return (
    <div style={{ display: "flex" }}>
      
      <Sidebar />

      <div style={{
        marginLeft: "250px",
        padding: "30px",
        width: "100%"
      }}>
        
        {/* Title */}
        <h2>Profile</h2>
        <p style={{ color: "#666" }}>
          Manage your account information
        </p>

        <div style={{ display: "flex", gap: "30px", marginTop: "20px" }}>
          
          {/* LEFT SIDE */}
          <div style={boxStyle}>
            <div style={{ textAlign: "center" }}>
              <div style={avatarStyle}>👤</div>
              <h4>Ahmed Al-Mutairi</h4>
              <p style={{ color: "#666" }}>Student</p>
            </div>

            <p>📧 ahmed.mutairi@ku.edu.kw</p>
            <p>📞 +965 9999 9999</p>

            <hr />

            <h5>Quick Stats</h5>
            <p>⭐ Total Points: 225</p>
            <p>📅 Events Joined: 12</p>
          </div>

          {/* RIGHT SIDE */}
          <div style={boxStyle}>
            <h4>Edit Profile</h4>

            <Form>
              <div style={{ display: "flex", gap: "15px" }}>
                <Form.Group style={{ flex: 1 }}>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control defaultValue="Ahmed" />
                </Form.Group>

                <Form.Group style={{ flex: 1 }}>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control defaultValue="Al-Mutairi" />
                </Form.Group>
              </div>

              <Form.Group style={{ marginTop: "15px" }}>
                <Form.Label>Email</Form.Label>
                <Form.Control defaultValue="ahmed.mutairi@ku.edu.kw" />
              </Form.Group>

              <Form.Group style={{ marginTop: "15px" }}>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control defaultValue="+965 9999 9999" />
              </Form.Group>

              <Form.Group style={{ marginTop: "15px" }}>
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  defaultValue="Computer Science student passionate about technology and innovation."
                />
              </Form.Group>

              <Form.Group style={{ marginTop: "15px" }}>
                <Form.Label>Student ID</Form.Label>
                <Form.Control defaultValue="2021450123" disabled />
              </Form.Group>

              <div style={{ marginTop: "20px" }}>
                <Button variant="dark">Save Changes</Button>{" "}
                <Button variant="outline-dark">Cancel</Button>
              </div>
            </Form>
          </div>

        </div>
      </div>
    </div>
  );
}

const boxStyle = {
  flex: 1,
  border: "1px solid #ddd",
  padding: "20px",
  borderRadius: "10px"
};

const avatarStyle = {
  fontSize: "50px",
  border: "2px solid #ddd",
  borderRadius: "50%",
  width: "100px",
  height: "100px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 10px"
};

export default ProfilePage;