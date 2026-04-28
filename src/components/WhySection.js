function WhySection() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px",
        backgroundColor: "#030817",
        color: "#f9f9f9"
      }}
    >
      <h4>Why Use Event-it?</h4>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          marginTop: "40px"
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
  border: "1px solid #f9f9f9",
  padding: "30px",
  width: "260px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(144, 148, 150, 0.57)",
  textAlign: "center",
  backgroundColor: "#030817",
  color: "#f9f9f9"
};

export default WhySection;