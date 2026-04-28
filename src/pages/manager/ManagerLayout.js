import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router-dom";

function ManagerLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, marginLeft: "250px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default ManagerLayout;