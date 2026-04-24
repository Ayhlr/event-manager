import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { apiRequest } from "../../api";

function ProfilePage() {
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    studentId: "",
    role: ""
  });

  const [eventsJoined, setEventsJoined] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProfile = async () => {
    try {
      setError("");

      const data = await apiRequest("/users/me");

      setUser(data);

      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        bio: data.bio || "",
        studentId: data.studentId || "",
        role: data.role || ""
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchStudentStats = async () => {
    try {
      const data = await apiRequest("/registrations/my-registrations");

      const registrations = Array.isArray(data)
        ? data
        : data.registrations || data.myRegistrations || [];

      setEventsJoined(registrations.length);

      const points = registrations.reduce((total, registration) => {
        const eventPoints = Number(registration.event?.points || 0);
        const registrationPoints = Number(registration.pointsEarned || 0);

        return total + (registrationPoints || eventPoints);
      }, 0);

      setTotalPoints(points);
    } catch (err) {
      setEventsJoined(0);
      setTotalPoints(0);
    }
  };

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);
        await fetchProfile();
        await fetchStudentStats();
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCancel = () => {
    if (!user) return;

    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      bio: user.bio || "",
      studentId: user.studentId || "",
      role: user.role || ""
    });

    setSuccess("");
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatedData = await apiRequest("/users/me", "PUT", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        bio: formData.bio
      });

      const updatedUser = updatedData.user;

      setUser(updatedUser);

      setFormData({
        firstName: updatedUser.firstName || "",
        lastName: updatedUser.lastName || "",
        email: updatedUser.email || "",
        phoneNumber: updatedUser.phoneNumber || "",
        bio: updatedUser.bio || "",
        studentId: updatedUser.studentId || "",
        role: updatedUser.role || ""
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          role: updatedUser.role
        })
      );

      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const fullName = `${formData.firstName} ${formData.lastName}`.trim();

  if (loading) {
    return (
      <div style={pageStyle}>
        <p>Loading profile...</p>
      </div>
    );
  }

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

      <div style={{ maxWidth: "1150px", margin: "0 auto" }}>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
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
            <div style={avatarStyle}>👤</div>

            <h2 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>
              {fullName || "User"}
            </h2>

            <div
              style={{
                color: "#6b7280",
                marginBottom: "22px",
                textTransform: "capitalize"
              }}
            >
              {formData.role || "User"}
            </div>
          </div>

          <div style={{ color: "#4b5563", marginBottom: "12px" }}>
            ✉ {formData.email || "No email"}
          </div>

          <div style={{ color: "#4b5563", marginBottom: "22px" }}>
            ☎ {formData.phoneNumber || "No phone number"}
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

            <div style={statRowStyle}>
              <span>⭐ Total Points</span>
              <strong style={{ color: "#111" }}>{totalPoints}</strong>
            </div>

            <div style={statRowStyle}>
              <span>📅 Events Joined</span>
              <strong style={{ color: "#111" }}>{eventsJoined}</strong>
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
          </div>

          <Form onSubmit={handleSave}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "16px"
              }}
            >
              <Form.Group>
                <Form.Label style={labelStyle}>First Name</Form.Label>
                <Form.Control
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label style={labelStyle}>Last Name</Form.Label>
                <Form.Control
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>

            <Form.Group style={{ marginBottom: "16px" }}>
              <Form.Label style={labelStyle}>Email</Form.Label>
              <Form.Control name="email" value={formData.email} disabled />
            </Form.Group>

            <Form.Group style={{ marginBottom: "16px" }}>
              <Form.Label style={labelStyle}>Phone Number</Form.Label>
              <Form.Control
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+965 9999 9999"
              />
            </Form.Group>

            <Form.Group style={{ marginBottom: "16px" }}>
              <Form.Label style={labelStyle}>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write something about yourself..."
              />
            </Form.Group>

            <Form.Group style={{ marginBottom: "8px" }}>
              <Form.Label style={labelStyle}>Student ID</Form.Label>
              <Form.Control
                name="studentId"
                value={formData.studentId || "Not available"}
                disabled
              />

              <div style={{ color: "#6b7280", marginTop: "8px" }}>
                Student ID cannot be changed
              </div>
            </Form.Group>

            <div style={{ marginTop: "28px", display: "flex", gap: "10px" }}>
              <Button variant="dark" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>

              <Button
                variant="outline-dark"
                type="button"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

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

const avatarStyle = {
  width: "120px",
  height: "120px",
  margin: "0 auto 18px auto",
  border: "2px solid #222",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "52px"
};

const statRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "12px",
  color: "#4b5563"
};

const labelStyle = {
  fontWeight: "600"
};

export default ProfilePage;