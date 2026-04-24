import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import categories from "../../data/categories";
import { apiRequest } from "../../api";

function CreateEventPage() {
  const [clubName, setClubName] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [capacity, setCapacity] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await apiRequest("/events", "POST", {
        title,
        clubName,
        category,
        date,
        time,
        location,
        capacity: Number(capacity),
        image,
        description
      });

      setShowSuccess(true);

      setClubName("");
      setTitle("");
      setCategory("");
      setLocation("");
      setDate("");
      setTime("");
      setCapacity("");
      setImage("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h2>Create New Event</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <Form onSubmit={handleCreateEvent}>
        <Form.Group className="mb-3">
          <Form.Label>Club Name</Form.Label>
          <Form.Control
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            placeholder="e.g. CS Club"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Event Name</Form.Label>
          <Form.Control
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Web Workshop"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>
            {categories
              .filter((c) => c.name !== "All" && c.name !== "All Categories")
              .map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            <option value="">Select location</option>
            <option value="Main Stadium">Main Stadium</option>
            <option value="Indoor Hall">Indoor Hall</option>
            <option value="Engineering Building">Engineering Building</option>
            <option value="Auditorium">Auditorium</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
  type="date"
  value={date}
  min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
  onChange={(e) => setDate(e.target.value)}
  required
/>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Time</Form.Label>
          <Form.Control
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Expected Capacity</Form.Label>
          <Form.Control
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            min="1"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image URL (Optional)</Form.Label>
          <Form.Control
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Paste image URL or leave empty"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Event Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="dark" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </Button>
      </Form>

      <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Event Created</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Your event has been submitted and is waiting for admin approval.
        </Modal.Body>

        <Modal.Footer>
          <Button variant="dark" onClick={() => setShowSuccess(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CreateEventPage;