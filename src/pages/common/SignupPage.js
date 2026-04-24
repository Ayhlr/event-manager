import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { apiRequest } from "../../api";

function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    studentId: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/auth/register", "POST", formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("viewMode", data.user.role);

      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "30px",
          background: "white",
          boxSizing: "border-box"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Sign Up</h2>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "25px"
          }}
        >
          Create your Event It student account
        </p>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "12px" }}>
            <Form.Group style={{ flex: 1, marginBottom: "15px" }}>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group style={{ flex: 1, marginBottom: "15px" }}>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </div>

          <Form.Group style={{ marginBottom: "15px" }}>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group style={{ marginBottom: "15px" }}>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="phoneNumber"
              placeholder="+965 9999 9999"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group style={{ marginBottom: "15px" }}>
            <Form.Label>Student ID</Form.Label>
            <Form.Control
              type="text"
              name="studentId"
              placeholder="Enter student ID"
              value={formData.studentId}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group style={{ marginBottom: "20px" }}>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button
            variant="dark"
            type="submit"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </Form>

        <p style={{ marginTop: "18px", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ fontWeight: "bold", color: "black" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;