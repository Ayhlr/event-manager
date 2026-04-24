const Registration = require("../models/Registration");
const Event = require("../models/Event");
const PointsHistory = require("../models/PointsHistory");

const joinEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status !== "approved") {
      return res.status(400).json({ message: "You can only join approved events" });
    }

    const existingRegistration = await Registration.findOne({
      user: req.user._id,
      event: eventId
    });

    if (existingRegistration) {
      return res.status(400).json({ message: "You have already joined this event" });
    }

    if (event.attendingCount >= event.capacity) {
      return res.status(400).json({ message: "Event is full" });
    }

    const registration = await Registration.create({
      user: req.user._id,
      event: eventId,
      status: "confirmed",
      joinType: "attendee",
      name: `${req.user.firstName} ${req.user.lastName}`,
      email: req.user.email,
      studentId: req.user.studentId
    });

    await PointsHistory.create({
      user: req.user._id,
      event: event._id,
      eventName: event.title,
      points: event.points,
      status: "pending"
    });

    event.attendingCount += 1;
    await event.save();

    res.status(201).json({
      message: "Joined event successfully",
      registration
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate("event")
      .sort({ createdAt: -1 });

    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getManagerParticipants = async (req, res) => {
  try {
    let managerEvents;

    if (req.user.role === "admin") {
      managerEvents = await Event.find().select("_id title capacity clubName");
    } else {
      managerEvents = await Event.find({ user: req.user._id }).select(
        "_id title capacity clubName"
      );
    }

    const eventIds = managerEvents.map((event) => event._id);

    const registrations = await Registration.find({
      event: { $in: eventIds }
    })
      .populate("event", "title capacity clubName date location")
      .populate("user", "firstName lastName email studentId")
      .sort({ createdAt: -1 });

    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const unenrollEvent = async (req, res) => {
  try {
    const registrationId = req.params.id;

    const registration = await Registration.findOne({
      _id: registrationId,
      user: req.user._id
    });

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const event = await Event.findById(registration.event);

    await Registration.findByIdAndDelete(registrationId);

    if (event && event.attendingCount > 0) {
      event.attendingCount -= 1;
      await event.save();
    }

    await PointsHistory.deleteOne({
      user: req.user._id,
      event: registration.event,
      status: "pending"
    });

    res.status(200).json({
      message: "Unenrolled from event successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  joinEvent,
  getMyRegistrations,
  getManagerParticipants,
  unenrollEvent
};