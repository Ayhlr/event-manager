import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

function FooterSection() {
  return (
    <div style={{ textAlign: "center", padding: "60px", background: "#f5f5f5" }}>
      <h4>Ready to Get Started?</h4>
      <p>Create an account to join events, earn points, or manage your club's events.</p>

      <Link to="/signup">
        <Button variant="dark" style={{ margin: "10px" }}>Sign Up Now</Button>
      </Link>

      <Link to="/home">
        <Button variant="outline-dark">Browse as Guest</Button>
      </Link>
    </div>
  );
}

export default FooterSection;