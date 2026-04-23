import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

function LandingHero() {
  return (
    <div style={{ textAlign: "center", padding: "80px" }}>
      <h2 style={{ fontSize: "32px", fontWeight: "bold" }}>
  Welcome to Event-it
</h2>

<p style={{
  maxWidth: "600px",
  margin: "20px auto",
  color: "#555"
}}>
      </p>

      <Link to="/home">
        <Button variant="dark">Browse Events as Guest</Button>
      </Link>
    </div>
  );
}

export default LandingHero;