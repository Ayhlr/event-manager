import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");

  const handleLogin = () => {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("role", role);

  if (role === "manager") {
    navigate("/manager");
  } else if (role === "admin") {
    navigate("/admin");
  } else {
    navigate("/home");
  }
};

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh"
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "30px",
          border: "1px solid #ddd",
          borderRadius: "10px"
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
          Login
        </h3>

        <Form>
          <Form.Group style={{ marginBottom: "15px" }}>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          <Form.Group style={{ marginBottom: "15px" }}>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" />
          </Form.Group>

          <Form.Group style={{ marginBottom: "20px" }}>
            <Form.Label>Login As</Form.Label>
            <Form.Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="manager">Event Manager</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>

          <Button
            variant="dark"
            style={{ width: "100%" }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;