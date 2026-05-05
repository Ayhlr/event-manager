import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

function LandingHero() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "140px 20px",
        minHeight: "520px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage:
          "linear-gradient(rgba(217, 217, 217, 0.25), rgba(217, 217, 217, 0.25)), url('/landing-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#030817"
      }}
    >
      <h1
        style={{
          fontSize: "52px",
          fontWeight: "bold",
          fontStyle: "italic",
          color: "#030817",
          marginBottom: "18px",
          textShadow: "0 2px 8px rgba(217, 217, 217, 0.75)"
        }}
      >
        Welcome to Event-it
      </h1>

      <p
        style={{
          fontSize: "20px",
          color: "#030817",
          marginBottom: "28px",
          maxWidth: "700px",
          textShadow: "0 1px 6px rgba(217, 217, 217, 0.75)"
        }}
      >
        Discover, join, and organize campus events in one place.
      </p>

      <Link to="/home">
        <Button
          style={{
            backgroundColor: "#030817",
            color: "#d9d9d9",
            borderColor: "#000000",
            padding: "12px 30px",
            fontSize: "18px",
            borderRadius: "8px",
            boxShadow: "0 6px 16px rgba(3, 8, 23, 0.35)"
          }}
        >
          Browse Events as Guest
        </Button>
      </Link>
    </div>
  );
}

export default LandingHero;