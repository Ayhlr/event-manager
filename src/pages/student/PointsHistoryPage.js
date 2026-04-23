import Sidebar from "../../components/Sidebar";

function PointsHistoryPage() {
  return (
    <div style={{ display: "flex" }}>
      
      <Sidebar />

      <div style={{
        marginLeft: "250px",
        padding: "30px",
        width: "100%"
      }}>
        
        {/* Title */}
        <h2>Points History</h2>
        <p style={{ color: "#666" }}>
          Track your earned points and upcoming rewards
        </p>

        {/* Top Boxes */}
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          
          <div style={boxStyle}>
            <p>Total Points Earned</p>
            <h2>225</h2>
          </div>

          <div style={boxStyle}>
            <p>Upcoming Points</p>
            <h2>125</h2>
          </div>

          <div style={boxStyle}>
            <p>Events Completed</p>
            <h2>4</h2>
          </div>

        </div>

        {/* Breakdown */}
        <div style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          marginTop: "30px"
        }}>
          
          <h4 style={{ padding: "15px" }}>Points Breakdown</h4>

          {/* Upcoming */}
          <p style={sectionTitle}>UPCOMING</p>

          <div style={rowStyle}>
            <div>
              <p>Spring Music Festival</p>
              <small>2026-04-15</small>
            </div>
            <span style={{ color: "#888" }}>+50 Pending</span>
          </div>

          <div style={rowStyle}>
            <div>
              <p>Tech Innovation Workshop</p>
              <small>2026-04-20</small>
            </div>
            <span style={{ color: "#888" }}>+75 Pending</span>
          </div>

          {/* Earned */}
          <p style={sectionTitle}>EARNED</p>

          <div style={rowStyle}>
            <div>
              <p>Winter Art Exhibition</p>
              <small>2026-03-10</small>
            </div>
            <span style={{ color: "green" }}>+40 Earned</span>
          </div>

          <div style={rowStyle}>
            <div>
              <p>Basketball Tournament</p>
              <small>2026-02-28</small>
            </div>
            <span style={{ color: "green" }}>+60 Earned</span>
          </div>

          <div style={rowStyle}>
            <div>
              <p>Cultural Night</p>
              <small>2026-02-15</small>
            </div>
            <span style={{ color: "green" }}>+45 Earned</span>
          </div>

        </div>

      </div>
    </div>
  );
}

const boxStyle = {
  flex: 1,
  border: "1px solid #ddd",
  padding: "20px",
  borderRadius: "10px"
};

const sectionTitle = {
  padding: "10px 15px",
  color: "#777",
  fontWeight: "bold"
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "15px",
  borderTop: "1px solid #eee"
};

export default PointsHistoryPage;