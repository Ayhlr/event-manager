import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function SearchBar({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedStadium,
  setSelectedStadium
}) {
  return (
    <div style={{ padding: "20px" }}>
      <Row>
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>

        <Col md={3}>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All Categories">All Categories</option>
            <option value="Food">Food</option>
            <option value="Educational">Educational</option>
            <option value="Fun">Fun</option>
            <option value="Sports">Sports</option>
            <option value="Social">Social</option>
          </Form.Select>
        </Col>

        <Col md={3}>
          <Form.Select
            value={selectedStadium}
            onChange={(e) => setSelectedStadium(e.target.value)}
          >
            <option value="All Stadiums">All Stadiums</option>
            <option value="Main Stadium">Main Stadium</option>
            <option value="Indoor Hall">Indoor Hall</option>
            <option value="Engineering Building">Engineering Building</option>
            <option value="Auditorium">Auditorium</option>
          </Form.Select>
        </Col>
      </Row>
    </div>
  );
}

export default SearchBar;