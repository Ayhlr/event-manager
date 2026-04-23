import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "250px", width: "100%", padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;