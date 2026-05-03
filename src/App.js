import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

/* Common pages */
import LandingPage from "./pages/common/LandingPage";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/common/LoginPage";
import SignupPage from "./pages/common/SignupPage";

/* Student pages */
import HomePage from "./pages/student/HomePage";
import MyEventsPage from "./pages/student/MyEventsPage";
import RequestsPage from "./pages/student/RequestsPage";
import ProfilePage from "./pages/student/ProfilePage";
import PointsHistoryPage from "./pages/student/PointsHistoryPage";
import SettingsPage from "./pages/student/SettingsPage";

/* Manager pages */
import ManagerLayout from "./pages/manager/ManagerLayout";
import ManagerHomePage from "./pages/manager/ManagerHomePage";
import CreateEventPage from "./pages/manager/CreateEventPage";
import MyCreatedEventsPage from "./pages/manager/MyCreatedEventsPage";
import ManageRequestsPage from "./pages/manager/ManageRequestsPage";
import ParticipantsPage from "./pages/manager/ParticipantsPage";

/* Admin pages */
import AdminLayout from "./pages/admin/AdminLayout";
import AdminHomePage from "./pages/admin/AdminHomePage";
import ManagerRequestsPage from "./pages/admin/ManagerRequestsPage";
import ManageManagersPage from "./pages/admin/ManageManagersPage";
import EventApprovalsPage from "./pages/admin/EventApprovalsPage";
import ApprovedEventsPage from "./pages/admin/ApprovedEventsPage";
import AdminProfilePage from "./pages/admin/ProfilePage";
import AdminSettingsPage from "./pages/admin/SettingsPage";

/* Logo animation */
import { useState, useEffect } from "react";
import LogoIntro from "./components/LogoIntro";

function AppContent() {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If token or role is missing, treat user as guest
  const isGuest = !token || !role;

  /* SHOW LOGO INTRO */
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const showNavbar =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    (location.pathname === "/home" && isGuest);

  return (
    <>
      {/* Logo animation */}
      {showIntro && <LogoIntro />}

      {/* Navbar */}
      {showNavbar && <Navbar />}

      <Routes>
        {/* COMMON */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* STUDENT */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/myevents" element={<MyEventsPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/points" element={<PointsHistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* MANAGER */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<ManagerHomePage />} />
          <Route path="create" element={<CreateEventPage />} />
          <Route path="events" element={<MyCreatedEventsPage />} />
          <Route path="requests" element={<ManageRequestsPage />} />
          <Route path="participants" element={<ParticipantsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHomePage />} />
          <Route path="manager-requests" element={<ManagerRequestsPage />} />
          <Route path="manage-managers" element={<ManageManagersPage />} />
          <Route path="event-approvals" element={<EventApprovalsPage />} />
          <Route path="approved-events" element={<ApprovedEventsPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;