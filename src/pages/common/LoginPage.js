import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { apiRequest } from "../../api";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [viewMode, setViewMode] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      const data = await apiRequest("/auth/login", "POST", {
        email,
        password
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", viewMode);
      localStorage.setItem("viewMode", viewMode);
      localStorage.setItem("isLoggedIn", "true");

      if (viewMode === "manager") {
        navigate("/manager");
      } else if (viewMode === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh"
      }}
    >
      <div
        style={{
          width: "420px",
          padding: "35px",
          border: "1px solid #ddd",
          borderRadius: "15px",
          background: "white"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Login</h2>

        <p style={{ textAlign: "center", color: "#666", marginBottom: "25px" }}>
          Welcome back to Event It
        </p>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleLogin}>
          <Form.Group style={{ marginBottom: "18px" }}>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group style={{ marginBottom: "18px" }}>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group style={{ marginBottom: "22px" }}>
            <Form.Label>Continue as</Form.Label>
            <Form.Select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>

          <Button
            type="submit"
            variant="dark"
            style={{ width: "100%", marginBottom: "20px" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Form>

        <p style={{ textAlign: "center" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ fontWeight: "bold", color: "black" }}>
            Sign up
          </Link>
        </p>

        <p style={{ textAlign: "center" }}>
          <Link to="/home" style={{ color: "#555" }}>
            Continue as guest
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;