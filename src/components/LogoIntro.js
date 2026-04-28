import logo from "../assets/logo.gif";
import "./LogoIntro.css";

function LogoIntro() {
  return (
    <div className="logo-intro">
      <img src={logo} alt="logo" className="logo-animation" />
    </div>
  );
}

export default LogoIntro;