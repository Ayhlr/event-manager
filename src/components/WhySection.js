function WhySection() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px",
        backgroundColor: "#d9d9d9",
        color: "#030817"
      }}
    >
      <h4 style={{ color: "#030817" }}>Why Use Event-it?</h4>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          marginTop: "40px",
          flexWrap: "wrap"
        }}
      >
        <div style={boxStyle}>
          <h5>Discover Events</h5>
          <p>Browse a wide variety of campus events.</p>
        </div>

        <div style={boxStyle}>
          <h5>Join & Connect</h5>
          <p>Meet students who share your interests.</p>
        </div>

        <div style={boxStyle}>
          <h5>Earn Points</h5>
          <p>Track your participation and achievements.</p>
        </div>
      </div>
    </div>
  );
}

const boxStyle = {
  border: "1px solid #030817",
  padding: "30px",
  width: "260px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(3, 8, 23, 0.25)",
  textAlign: "center",
  backgroundColor: "#030817",
  color: "#f9f9f9"
};

export default WhySection;