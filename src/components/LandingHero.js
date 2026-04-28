import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

function LandingHero() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px",
        backgroundColor: "#d9d9d9",
        color: "#030817"
      }}
    >
      <h2
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          fontStyle: "italic",
          color: "#030817"
        }}
      >
        Welcome to Event-it
      </h2>

      <Link to="/home">
        <Button
          style={{
            backgroundColor: "#030817",
            color: "#d9d9d9",
            borderColor: "#000000"
          }}
        >
          Browse Events as Guest
        </Button>
      </Link>
    </div>
  );
}

export default LandingHero;