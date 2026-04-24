const Request = require("../models/Request");
const Event = require("../models/Event");

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
      .populate("event", "title date location status")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getManagerEventRequests = async (req, res) => {
  try {
    console.log("========== MANAGER REQUEST DEBUG ==========");
    console.log("Logged in user ID:", req.user._id.toString());
    console.log("Logged in user role:", req.user.role);
    console.log("Logged in user email:", req.user.email);

    const allRequests = await Request.find()
      .populate("event", "title clubName user")
      .populate("user", "firstName lastName email studentId");

    console.log("All organizer requests in DB:", allRequests.length);

    allRequests.forEach((request) => {
      console.log("Request:", {
        requestId: request._id.toString(),
        eventName: request.eventName,
        requestStatus: request.status,
        eventId: request.event?._id?.toString(),
        eventOwner: request.event?.user?.toString(),
        studentName: request.name,
        studentEmail: request.email
      });
    });

    if (req.user.role === "admin") {
      console.log("Admin user detected. Returning all requests.");
      console.log("==========================================");
      return res.status(200).json(allRequests);
    }

    const managerEvents = await Event.find({ user: req.user._id }).select(
      "_id title clubName"
    );

    console.log("Events created by this manager:", managerEvents.length);

    managerEvents.forEach((event) => {
      console.log("Manager Event:", {
        eventId: event._id.toString(),
        title: event.title,
        clubName: event.clubName
      });
    });

    const eventIds = managerEvents.map((event) => event._id);

    const requests = await Request.find({ event: { $in: eventIds } })
      .populate("event", "title clubName date location user")
      .populate("user", "firstName lastName email studentId")
      .sort({ createdAt: -1 });

    console.log("Requests returned to manager:", requests.length);
    console.log("==========================================");

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

module.exports = {
  createOrganizerRequest,
  getMyRequests,
  getManagerEventRequests,
  updateRequestStatus
};