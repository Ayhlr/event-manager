import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import categories from "../../data/categories";

function CreateEventPage() {
  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h2>Create New Event</h2>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Club Name</Form.Label>
          <Form.Control type="text" placeholder="e.g. Basketball Club" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Event Name</Form.Label>
          <Form.Control type="text" placeholder="e.g. Spring Championship" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select>
            <option value="">Select category</option>

{categories
  .filter((category) => category.name !== "All" && category.name !== "All Categories")
  .map((category) => (
    <option key={category.name} value={category.name}>
      {category.name}
    </option>
  ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control type="date" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Time</Form.Label>
          <Form.Control type="time" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Expected Capacity</Form.Label>
          <Form.Control type="number" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Event Description</Form.Label>
          <Form.Control as="textarea" rows={3} />
        </Form.Group>

        <Button variant="dark">Create Event</Button>
      </Form>
    </div>
  );
}

export default CreateEventPage;