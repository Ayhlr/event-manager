import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import logo from "../assets/logo.gif";

function Navbar() {
 const authButtonStyle = {
  backgroundColor: "#d9d9d9",
  color: "#030817",
  border: "1px solid #d9d9d9",
  borderRadius: "12px",
  padding: "8px 20px",
  fontWeight: "600",
  boxShadow: "0 3px 8px rgba(217, 217, 217, 0.18)"
};

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        borderBottom: "1px solid #000000",
        backgroundColor: "#030817",
        color: "#d9d9d9"
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={logo}
          alt="Event-it logo"
          style={{
            width: "45px",
            height: "45px",
            marginRight: "10px"
          }}
        />

        <h3
          style={{
            margin: 0,
            color: "#d9d9d9",
            fontStyle: "italic",
            letterSpacing: "1px"
          }}
        >
          Event-it
        </h3>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <Button style={authButtonStyle}>Login</Button>
        </Link>

        <Link to="/signup" style={{ textDecoration: "none" }}>
          <Button style={authButtonStyle}>Sign Up</Button>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;