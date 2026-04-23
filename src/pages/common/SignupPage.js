import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SignupPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("Student");

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "80vh"
    }}>
      <div style={{
        width: "350px",
        padding: "30px",
        border: "1px solid #ddd",
        borderRadius: "10px"
      }}>
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
          Sign Up
        </h3>

        <Form>
          <Form.Group style={{ marginBottom: "15px" }}>
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" />
          </Form.Group>

          <Form.Group style={{ marginBottom: "15px" }}>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          {/* ✅ NEW: Role Selection */}
          <Form.Group style={{ marginBottom: "15px" }}>
            <Form.Label>Account Type</Form.Label>
            <Form.Select onChange={(e) => setRole(e.target.value)}>
              <option>Student</option>
              <option>Event Manager</option>
            </Form.Select>
          </Form.Group>

          <Form.Group style={{ marginBottom: "20px" }}>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" />
          </Form.Group>

          <Button
            variant="dark"
            style={{ width: "100%" }}
          onClick={() => {
  localStorage.setItem("role", role);

  if (role === "Event Manager") {
   navigate("/manager");
  } else {
    navigate("/home"); // student
  }
}}
          >
            Sign Up
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default SignupPage;