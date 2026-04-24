const Event = require("../models/Event");

const createEvent = async (req, res) => {
  try {
    const {
      title,
      clubName,
      category,
      date,
      time,
      location,
      points,
      image,
      capacity,
      description
    } = req.body;

    if (
      !title ||
      !clubName ||
      !category ||
      !date ||
      !time ||
      !location ||
      !capacity ||
      !description
    ) {
      return res.status(400).json({ message: "Please fill all required event fields" });
    }

    const event = await Event.create({
      user: req.user._id,
      title,
      clubName,
      category,
      date,
      time,
      location,
      points,
      image,
      capacity,
      description,
      status: "pending"
    });

    res.status(201).json({
      message: "Event created successfully and sent for admin approval",
      event
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getApprovedEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" }).populate("user", "firstName lastName email");
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be approved or rejected" });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.status = status;
    event.approvedAt = status === "approved" ? new Date() : null;

    const updatedEvent = await event.save();

    res.status(200).json({
      message: `Event ${status} successfully`,
      event: updatedEvent
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("user", "firstName lastName email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const {
      title,
      clubName,
      category,
      date,
      time,
      location,
      points,
      image,
      capacity,
      description
    } = req.body;

    event.title = title || event.title;
    event.clubName = clubName || event.clubName;
    event.category = category || event.category;
    event.date = date || event.date;
    event.time = time || event.time;
    event.location = location || event.location;
    event.points = points !== undefined ? points : event.points;
    event.image = image !== undefined ? image : event.image;
    event.capacity = capacity !== undefined ? capacity : event.capacity;
    event.description = description || event.description;

    const updatedEvent = await event.save();

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await event.deleteOne();

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllEventsForAdmin = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createEvent,
  getApprovedEvents,
  getAllEventsForAdmin,
  getMyEvents,
  updateEventStatus,
  getEventById,
  updateEvent,
  deleteEvent
};