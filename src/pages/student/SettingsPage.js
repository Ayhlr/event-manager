import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import { apiRequest } from "../../api";

function SettingsPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [notifPref, setNotifPref] = useState({
    eventReminders: true,
    newEvents: true,
    requestUpdates: true,
    emailDigest: false
  });

  const [profVis, setProfVis] = useState("public");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [savingPrivacy, setSavingPrivacy] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchSettings = async () => {
    try {
      setError("");

      const data = await apiRequest("/users/me");

      setUser(data);

      if (data.notifPref) {
        setNotifPref({
          eventReminders: data.notifPref.eventReminders ?? true,
          newEvents: data.notifPref.newEvents ?? true,
          requestUpdates: data.notifPref.requestUpdates ?? true,
          emailDigest: data.notifPref.emailDigest ?? false
        });
      }

      if (data.profVis) {
        setProfVis(data.profVis);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);
        await fetchSettings();
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, []);

  const formatRole = (role) => {
    if (!role) return "User";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const formatMemberSince = (dateValue) => {
    if (!dateValue) return "Not available";

    return new Date(dateValue).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });
  };

  const handleNotifChange = (field) => {
    setNotifPref((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSavePreferences = async () => {
    try {
      setSavingPrefs(true);
      setError("");
      setSuccess("");

      const updated = await apiRequest("/users/me", "PUT", {
        notifPref
      });

      setUser(updated.user);
      setSuccess("Notification preferences saved successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleSavePrivacy = async () => {
    try {
      setSavingPrivacy(true);
      setError("");
      setSuccess("");

      const updated = await apiRequest("/users/me", "PUT", {
        profVis
      });

      setUser(updated.user);
      setSuccess("Privacy settings saved successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingPrivacy(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      setChangingPassword(true);
      setError("");
      setSuccess("");

      if (
        !passwordData.currentPassword ||
        !passwordData.newPassword ||
        !passwordData.confirmPassword
      ) {
        setError("Please fill all password fields.");
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError("New password and confirm password do not match.");
        return;
      }

      await apiRequest("/users/change-password", "PUT", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      setSuccess("Password changed successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDownloadData = () => {
    if (!user) return;

    const dataToDownload = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      studentId: user.studentId,
      role: user.role,
      bio: user.bio,
      notifPref,
      profVis,
      createdAt: user.createdAt
    };

    const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "my-event-it-data.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    try {
      setDeletingAccount(true);
      setError("");
      setSuccess("");

      await apiRequest("/users/me", "DELETE");

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("viewMode");

      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingAccount(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex" }}>
        <Sidebar />

        <div
          style={{
            marginLeft: "250px",
            padding: "30px",
            width: "100%"
          }}
        >
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div
        style={{
          marginLeft: "250px",
          padding: "30px",
          width: "100%"
        }}
      >
        <h2>Settings</h2>

        <p style={{ color: "#666" }}>
          Manage your account settings and preferences
        </p>

        {error && (
          <Alert variant="danger" style={{ maxWidth: "760px" }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" style={{ maxWidth: "760px" }}>
            {success}
          </Alert>
        )}

        <div style={boxStyle}>
          <h4>Account Information</h4>

          <div style={{ display: "flex", gap: "40px", marginTop: "10px" }}>
            <div>
              <p>Email</p>
              <strong>{user?.email || "No email"}</strong>
            </div>

            <div>
              <p>Account Type</p>
              <strong>{formatRole(user?.role)}</strong>
            </div>

            <div>
              <p>Status</p>
              <span style={activeStyle}>ACTIVE</span>
            </div>
          </div>

          <p style={{ marginTop: "10px" }}>
            Member Since:{" "}
            <strong>{formatMemberSince(user?.createdAt)}</strong>
          </p>
        </div>

        <div style={boxStyle}>
          <h4>Change Password</h4>

          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group style={{ marginTop: "10px" }}>
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
            </Form.Group>

            <Form.Group style={{ marginTop: "10px" }}>
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
            </Form.Group>

            <Form.Group style={{ marginTop: "10px" }}>
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
            </Form.Group>

            <Button
              style={{ marginTop: "15px" }}
              variant="dark"
              type="submit"
              disabled={changingPassword}
            >
              {changingPassword ? "Changing..." : "Change Password"}
            </Button>
          </Form>
        </div>

        <div style={boxStyle}>
          <h4>Notification Preferences</h4>

          <Form.Check
            label="Event Reminders"
            checked={notifPref.eventReminders}
            onChange={() => handleNotifChange("eventReminders")}
          />

          <Form.Check
            label="New Events"
            checked={notifPref.newEvents}
            onChange={() => handleNotifChange("newEvents")}
          />

          <Form.Check
            label="Request Updates"
            checked={notifPref.requestUpdates}
            onChange={() => handleNotifChange("requestUpdates")}
          />

          <Form.Check
            label="Email Digest"
            checked={notifPref.emailDigest}
            onChange={() => handleNotifChange("emailDigest")}
          />

          <Button
            style={{ marginTop: "15px" }}
            variant="dark"
            onClick={handleSavePreferences}
            disabled={savingPrefs}
          >
            {savingPrefs ? "Saving..." : "Save Preferences"}
          </Button>
        </div>

        <div style={boxStyle}>
          <h4>Privacy & Security</h4>

          <Form.Group>
            <Form.Label>Profile Visibility</Form.Label>
            <Form.Select
              value={profVis}
              onChange={(e) => setProfVis(e.target.value)}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </Form.Select>
          </Form.Group>

          <div style={{ marginTop: "15px" }}>
            <Button
              variant="dark"
              onClick={handleSavePrivacy}
              disabled={savingPrivacy}
            >
              {savingPrivacy ? "Saving..." : "Save Privacy"}
            </Button>{" "}

            <Button variant="outline-dark" onClick={handleDownloadData}>
              Download My Data
            </Button>{" "}

            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              Delete Account
            </Button>
          </div>
        </div>

        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Account</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={deletingAccount}
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              disabled={deletingAccount}
            >
              {deletingAccount ? "Deleting..." : "Delete Account"}
            </Button>
          </Modal.Footer>
        </Modal>
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