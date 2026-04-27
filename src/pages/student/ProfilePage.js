import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
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
  const [organizerPoints, setOrganizerPoints] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProfile = async () => {
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
  };

  const fetchStudentStats = async () => {
    try {
      const registrationsData = await apiRequest("/registrations/my-registrations");

      const registrations = Array.isArray(registrationsData)
        ? registrationsData
        : registrationsData.registrations || registrationsData.myRegistrations || [];

      setEventsJoined(registrations.length);
    } catch (err) {
      setEventsJoined(0);
    }

    try {
      const pointsData = await apiRequest("/points-history/my-points");

      const pointsHistory = Array.isArray(pointsData)
        ? pointsData
        : pointsData.pointsHistory || pointsData.history || [];

      const totalEarned = pointsHistory
        .filter((item) => item.status === "earned")
        .reduce((total, item) => total + Number(item.points || 0), 0);

      setOrganizerPoints(totalEarned);
    } catch (err) {
      setOrganizerPoints(0);
    }
  };

  const loadPage = async () => {
    try {
      setLoading(true);
      setError("");

      await fetchProfile();
      await fetchStudentStats();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  loadPage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={pageStyle}>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={pageStyle}>
        <h2>Profile</h2>
        <p style={{ color: "#666" }}>Manage your account information</p>

        {error && (
          <Alert variant="danger" style={{ maxWidth: "780px" }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" style={{ maxWidth: "780px" }}>
            {success}
          </Alert>
        )}

        <div style={{ display: "flex", gap: "30px", marginTop: "20px" }}>
          <div style={boxStyle}>
            <div style={{ textAlign: "center" }}>
              <div style={avatarStyle}>👤</div>

              <h4>{fullName || "User"}</h4>

              <p style={{ color: "#666", textTransform: "capitalize" }}>
                {formData.role || "User"}
              </p>
            </div>

            <p>📧 {formData.email || "No email"}</p>
            <p>📞 {formData.phoneNumber || "No phone number"}</p>

            <hr />

            <h5>Quick Stats</h5>

                {formData.role === "student" && (
                  <>
                    <p>⭐ Organizer Points: {organizerPoints}</p>
                    <p>📅 Events Joined: {eventsJoined}</p>
                  </>
                )}

                {formData.role === "manager" && (
                  <p>📅 Manager Account</p>
                )}

                {formData.role === "admin" && (
                  <p>🛠 Admin Account</p>
                )}
          </div>

          <div style={boxStyle}>
            <h4>Edit Profile</h4>

            <Form onSubmit={handleSave}>
              <div style={{ display: "flex", gap: "15px" }}>
                <Form.Group style={{ flex: 1 }}>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group style={{ flex: 1 }}>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>

              <Form.Group style={{ marginTop: "15px" }}>
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" value={formData.email} disabled />
              </Form.Group>

              <Form.Group style={{ marginTop: "15px" }}>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+965 9999 9999"
                />
              </Form.Group>

              <Form.Group style={{ marginTop: "15px" }}>
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Write something about yourself..."
                />
              </Form.Group>

              <Form.Group style={{ marginTop: "15px" }}>
                <Form.Label>Student ID</Form.Label>
                <Form.Control
                  name="studentId"
                  value={formData.studentId || "Not available"}
                  disabled
                />
              </Form.Group>

              <div style={{ marginTop: "20px" }}>
                <Button variant="dark" type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>{" "}

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
    </div>
  );
}

const pageStyle = {
  marginLeft: "250px",
  padding: "30px",
  width: "100%"
};

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