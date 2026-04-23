import Sidebar from "../../components/Sidebar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function RequestsPage() {
  return (
    <div style={{ display: "flex" }}>
      
      <Sidebar />

      <div style={{
        marginLeft: "250px",
        padding: "30px",
        width: "100%"
      }}>
        
        {/* Title */}
        <h2>Requests</h2>
        <p style={{ color: "#666" }}>
          Send requests to event organizers and track their status
        </p>

        <div style={{ display: "flex", gap: "30px", marginTop: "20px" }}>
          
          {/* LEFT: FORM */}
          <div style={boxStyle}>
            <h4>Send New Request</h4>

            <Form>
              <Form.Group style={{ marginTop: "15px" }}>
                <Form.Label>Event Name</Form.Label>
                <Form.Control placeholder="Enter event name" />
              </Form.Group>

              <Form.Group style={{ marginTop: "15px" }}>
                <Form.Label>Your Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Write your request message here..."
                />
              </Form.Group>

              <Button
                variant="dark"
                style={{ width: "100%", marginTop: "20px" }}
              >
                Send Request
              </Button>
            </Form>
          </div>

          {/* RIGHT: HISTORY */}
          <div style={boxStyle}>
            <h4>Request History</h4>

            <div style={cardStyle}>
              <div>
                <h5>Spring Music Festival</h5>
                <p>KU Music Club</p>
                <p>"I would like to perform at this event"</p>
              </div>
              <span style={pendingStyle}>PENDING</span>
            </div>

            <div style={cardStyle}>
              <div>
                <h5>Tech Workshop</h5>
                <p>CS Society</p>
                <p>"Can I help with organizing?"</p>
              </div>
              <span style={approvedStyle}>APPROVED</span>
            </div>

            <div style={cardStyle}>
              <div>
                <h5>Art Exhibition</h5>
                <p>Arts Club</p>
                <p>"I'd like to exhibit my artwork"</p>
              </div>
              <span style={rejectedStyle}>REJECTED</span>
            </div>

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

const cardStyle = {
  border: "1px solid #ddd",
  padding: "15px",
  borderRadius: "10px",
  marginTop: "15px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const pendingStyle = {
  border: "1px solid black",
  padding: "5px 10px",
  fontSize: "12px"
};

const approvedStyle = {
  border: "1px solid green",
  color: "green",
  padding: "5px 10px",
  fontSize: "12px"
};

const rejectedStyle = {
  border: "1px solid red",
  color: "red",
  padding: "5px 10px",
  fontSize: "12px"
};

export default RequestsPage;