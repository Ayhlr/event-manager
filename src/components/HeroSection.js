function HeroSection() {
  return (
    <div
      style={{
  textAlign: "center",
  padding: "60px",
  background:  "linear-gradient(135deg, #030817 0%, #1a2238 15%, #d9d9d9 70%)",
  color: "#030817"
}}
    >
      <h1 style={{ fontWeight: "bold", fontStyle: "italic" }}>
        Discover Events at KU
      </h1>

      <p
        style={{
          marginTop: "15px",
          color: "#0f262d",
          fontSize: "18px"
        }}
      >
        Connect with clubs, explore exciting events, and make unforgettable memories
      </p>
    </div>
  );
}

export default HeroSection;