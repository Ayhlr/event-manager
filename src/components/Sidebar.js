import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  if (!role) return null;

  const studentMenu = [
    { name: "Home", path: "/home" },
    { name: "My Events", path: "/myevents" },
    { name: "Requests", path: "/requests" },
    { name: "Profile", path: "/profile" },
    { name: "Points History", path: "/points" },
    { name: "Settings", path: "/settings" }
  ];

  const managerMenu = [
    { name: "Home", path: "/manager" },
    { name: "Create Event", path: "/manager/create" },
    { name: "My Created Events", path: "/manager/events" },
    { name: "Manage Requests", path: "/manager/requests" },
    { name: "Participants", path: "/manager/participants" },
    { name: "Profile", path: "/manager/profile" },
    { name: "Settings", path: "/manager/settings" }
  ];

  const adminMenu = [
    { name: "Home", path: "/admin" },
    { name: "Manager Requests", path: "/admin/manager-requests" },
    { name: "Manage Managers", path: "/admin/manage-managers" },
    { name: "Event Approvals", path: "/admin/event-approvals" },
    { name: "Approved Events", path: "/admin/approved-events" },
    { name: "Profile", path: "/admin/profile" },
    { name: "Settings", path: "/admin/settings" }
  ];

  let menu = studentMenu;
  let panelTitle = "Student";

  if (role === "manager") {
    menu = managerMenu;
    panelTitle = "Event Manager";
  } else if (role === "admin") {
    menu = adminMenu;
    panelTitle = "Admin Panel";
  }

  const handleSwitchAccount = () => {
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        borderRight: "1px solid #ddd",
        padding: "20px",
        position: "fixed",
        left: 0,
        top: 0,
        background: "#f9f9f9"
      }}
    >
      <h3 style={{ marginBottom: "30px" }}>
        Event-it <br />
        <small style={{ color: "#666" }}>{panelTitle}</small>
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {menu.map((item) => (
          <Link key={item.name} to={item.path} style={linkStyle}>
            {item.name}
          </Link>
        ))}
      </div>

      <div style={{ position: "absolute", bottom: "20px", width: "80%" }}>
        <button style={btnStyle} onClick={handleSwitchAccount}>
          Switch Account
        </button>
        <button style={btnStyle} onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
}

const linkStyle = {
  textDecoration: "none",
  color: "black",
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "5px"
};

const btnStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  border: "1px solid #ddd",
  background: "white"
};

export default Sidebar;