const Request = require("../models/Request");
const Event = require("../models/Event");
const PointsHistory = require("../models/PointsHistory");

const createOrganizerRequest = async (req, res) => {
  try {
    const { eventId, message } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const existingRequest = await Request.findOne({
      user: req.user._id,
      event: eventId
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You already sent a request for this event"
      });
    }

    const request = await Request.create({
      user: req.user._id,
      event: eventId,
      eventName: event.title,
      clubName: event.clubName,
      message: message || "",
      status: "pending",
      name: `${req.user.firstName} ${req.user.lastName}`,
      email: req.user.email
    });

    res.status(201).json({
      message: "Organizer request submitted successfully",
      request
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ user: req.user._id })
      .populate("event", "title date time location status clubName category points")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getManagerEventRequests = async (req, res) => {
  try {
    let requests;

    if (req.user.role === "admin") {
      requests = await Request.find()
       .populate("event", "title clubName date location time user category points")
        .populate("user", "firstName lastName email studentId")
        .sort({ createdAt: -1 });
    } else {
      const managerEvents = await Event.find({ user: req.user._id }).select(
        "_id title clubName"
      );

      const eventIds = managerEvents.map((event) => event._id);

      requests = await Request.find({ event: { $in: eventIds } })
       .populate("event", "title clubName date location time user category points")
        .populate("user", "firstName lastName email studentId")
        .sort({ createdAt: -1 });
    }

    res.status(200).json(requests);
  } catch (error) {
    console.log("getManagerEventRequests error:", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be approved or rejected"
      });
    }

    const request = await Request.findById(req.params.id).populate("event");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (
      !request.event ||
      request.event.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    request.status = status;
    const updatedRequest = await request.save();

    if (status === "approved") {
      const existingPoints = await PointsHistory.findOne({
        user: request.user,
        event: request.event._id
      });

      if (!existingPoints) {
        await PointsHistory.create({
          user: request.user,
          event: request.event._id,
          eventName: request.event.title,
          points: 50,
          status: "pending"
        });
      }
    }

    res.status(200).json({
      message: `Request ${status} successfully`,
      request: updatedRequest
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const cancelMyRequest = async (req, res) => {
  try {
    const request = await Request.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate("event");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status === "rejected") {
      return res.status(400).json({
        message: "Rejected requests cannot be cancelled"
      });
    }

    if (request.event?.date) {
      const eventDate = new Date(request.event.date);

      if (request.event.time) {
        const [hours, minutes] = request.event.time.split(":");
        eventDate.setHours(Number(hours));
        eventDate.setMinutes(Number(minutes));
        eventDate.setSeconds(0);
        eventDate.setMilliseconds(0);
      } else {
        eventDate.setHours(23, 59, 0, 0);
      }

      if (eventDate < new Date()) {
        return res.status(400).json({
          message: "You cannot cancel a request after the event date has passed"
        });
      }
    }

    if (request.status === "approved") {
      await PointsHistory.findOneAndUpdate(
        {
          user: request.user,
          event: request.event?._id || request.event
        },
        {
          status: "revoked"
        }
      );
    }

    await Request.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Request cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createOrganizerRequest,
  getMyRequests,
  getManagerEventRequests,
  updateRequestStatus,
  cancelMyRequest
};