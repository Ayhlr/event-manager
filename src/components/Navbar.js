import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import logo from "../assets/logo.gif";

function Navbar() {
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

        <h3 style={{ margin: 0, color: "#d9d9d9", fontStyle: "italic", letterSpacing: "1px" }}>
          Event-it
        </h3>
      </div>

      <div>
        <Link to="/login">
          <Button
            style={{
              marginRight: "10px",
              backgroundColor: "#030817",
              color: "#d9d9d9",
              border: "none"
            }}
          >
            Login
          </Button>
        </Link>

        <Link to="/signup">
          <Button
            style={{
              backgroundColor: "#030817",
              color: "#d9d9d9",
              border: "none"
            }}
          >
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;