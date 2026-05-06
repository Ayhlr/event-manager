import { Link, useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const location = useLocation();

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
    <div style={sidebarStyle}>
      <div>
        <h3 style={titleStyle}>
          Event-it
          <br />
          <small style={smallTitleStyle}>{panelTitle}</small>
        </h3>

        <div style={menuStyle}>
          {menu.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                style={isActive ? activeLinkStyle : linkStyle}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div style={bottomStyle}>
        <button style={switchBtnStyle} onClick={handleSwitchAccount}>
          Switch Account
        </button>

        <button style={logoutBtnStyle} onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
}

const sidebarStyle = {
  width: "250px",
  height: "100vh",
  padding: "22px 20px",
  position: "fixed",
  left: 0,
  top: 0,
  background:
    "linear-gradient(180deg, #030817 0%, #192032 75%, #212b43 100%)",
  color: "#f9f9f9",
  boxShadow: "4px 0 18px rgba(3, 8, 23, 0.25)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between"
};

const titleStyle = {
  marginBottom: "30px",
  color: "#ffffff",
  fontWeight: "bold"
};

const smallTitleStyle = {
  color: "#d9d9d9",
  fontSize: "16px"
};

const menuStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const linkStyle = {
  textDecoration: "none",
  color: "#f9f9f9",
  padding: "11px 13px",
  borderRadius: "12px",
  background: "rgba(255, 255, 255, 0.08)",
  border: "1px solid rgba(255, 255, 255, 0.12)"
};

const activeLinkStyle = {
  ...linkStyle,
  background: "#8d9298",
  color: "#030817",
  fontWeight: "bold",
  border: "1px solid #f9f9f9",
  boxShadow: "0 4px 12px rgba(255, 255, 255, 0.18)"
};

const bottomStyle = {
  width: "100%"
};

const switchBtnStyle = {
  width: "100%",
  padding: "11px",
  marginTop: "10px",
  border: "none",
  borderRadius: "12px",
  background: "#d9d9d9",
  color: "#030817",
  fontWeight: "bold"
};

const logoutBtnStyle = {
  width: "100%",
  padding: "11px",
  marginTop: "10px",
  border: "1px solid #d9d9d9",
  borderRadius: "12px",
  background: "transparent",
  color: "#f9f9f9",
  fontWeight: "bold"
};

export default Sidebar;