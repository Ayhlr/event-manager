import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

function FooterSection() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px",
        background:
          "linear-gradient(135deg, #030817 0%, #1a2238 45%, #d9d9d9 100%)",
        color: "#d9d9d9"
      }}
    >
      <h4 style={{ color: "#d9d9d9" }}>Ready to Get Started?</h4>

      <p style={{ color: "#d9d9d9" }}>
        Create an account to join events, earn points, or manage your club's events.
      </p>

      <Link to="/signup">
        <Button
          variant="dark"
          style={{
            margin: "10px",
            background: "#030817",
            color: "#d9d9d9",
            border: "1px solid #d9d9d9"
          }}
        >
          Sign Up Now
        </Button>
      </Link>

      <Link to="/home">
        <Button
          variant="outline-dark"
          style={{
            background: "#d9d9d9",
            color: "#030817",
            border: "1px solid #030817"
          }}
        >
          Browse as Guest
        </Button>
      </Link>
    </div>
  );
}

export default FooterSection;