import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

function Navbar() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        borderBottom: "1px solid #ddd"
      }}
    >
      <h3>Event-it</h3>

      <div>
        <Link to="/login">
          <Button variant="outline-dark" style={{ marginRight: "10px" }}>
            Login
          </Button>
        </Link>

        <Link to="/signup">
          <Button variant="dark">
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;