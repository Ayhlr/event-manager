const Registration = require("../models/Registration");
const Event = require("../models/Event");
const PointsHistory = require("../models/PointsHistory");
const Request = require("../models/Request");
const User = require("../models/User");

const EARN_AFTER_MS = 48 * 60 * 60 * 1000;

// This helper combines event.date + event.time into one Date object
const getEventDateTime = (event) => {
  if (!event || !event.date) return null;

  const eventDate = new Date(event.date);

  if (Number.isNaN(eventDate.getTime())) return null;

  let hours = 23;
  let minutes = 59;

  if (event.time) {
    const timeString = String(event.time).trim();

    // Supports time like "14:30", "2:30 PM", "02:30 PM"
    const match = timeString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);

    if (match) {
      hours = Number(match[1]);
      minutes = Number(match[2]);

      const period = match[3]?.toUpperCase();

      if (period === "PM" && hours !== 12) {
        hours += 12;
      }

      if (period === "AM" && hours === 12) {
        hours = 0;
      }
    }
  }

  eventDate.setHours(hours, minutes, 0, 0);
  return eventDate;
};

const addPointsToUserOnce = async (pointsRecord) => {
  const user = await User.findById(pointsRecord.user);

  if (!user) return;

  user.totalPoints =
    Number(user.totalPoints || 0) + Number(pointsRecord.points || 50);

  await user.save();
};

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
      return res.status(400).json({
        message: "You can only join approved events"
      });
    }

    const existingRegistration = await Registration.findOne({
      user: req.user._id,
      event: eventId
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: "You have already joined this event"
      });
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
    const registrations = await Registration.find({
      user: req.user._id
    })
      .populate("event", "title capacity clubName date time location description")
      .populate("user", "firstName lastName email studentId")
      .lean();

    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getManagerParticipants = async (req, res) => {
  try {
    let managerEvents;

    if (req.user.role === "admin") {
      managerEvents = await Event.find().select(
        "_id title capacity clubName date time location description user"
      );
    } else {
      managerEvents = await Event.find({ user: req.user._id }).select(
        "_id title capacity clubName date time location description user"
      );
    }

    const eventIds = managerEvents.map((event) => event._id);

    // Get ONLY accepted organizer requests
    const approvedOrganizerRequests = await Request.find({
      event: { $in: eventIds },
      status: "approved"
    })
      .populate("event", "title capacity clubName date time location description user")
      .populate("user", "firstName lastName email studentId totalPoints")
      .sort({ updatedAt: -1 })
      .lean();

    const now = new Date();
    const organizers = [];

    for (const request of approvedOrganizerRequests) {
      let pointsRecord = await PointsHistory.findOne({
        user: request.user?._id,
        event: request.event?._id
      });

      // If request was approved but no points record exists, create it
      if (!pointsRecord) {
        pointsRecord = await PointsHistory.create({
          user: request.user?._id,
          event: request.event?._id,
          eventName: request.event?.title || request.eventName,
          points: 50,
          status: "pending"
        });
      }

      // Fix old points records that were saved as 0
      if (!pointsRecord.points || pointsRecord.points === 0) {
        pointsRecord.points = 50;
      }

      const eventEndAt = getEventDateTime(request.event);

      const earnedAt = eventEndAt
        ? new Date(eventEndAt.getTime() + EARN_AFTER_MS)
        : null;

      const eventHasFinished = eventEndAt ? now >= eventEndAt : false;

      const canRevokePoints =
        pointsRecord.status === "pending" &&
        eventEndAt &&
        now >= eventEndAt &&
        now < earnedAt;

      // Automatically mark pending points as earned 48 hours after the event
      if (
        pointsRecord.status === "pending" &&
        earnedAt &&
        now >= earnedAt
      ) {
        pointsRecord.status = "earned";

        await addPointsToUserOnce(pointsRecord);
      }

      await pointsRecord.save();

      organizers.push({
        _id: request._id,
        requestId: request._id,

        user: request.user,
        event: request.event,

        name:
          request.name ||
          `${request.user?.firstName || ""} ${request.user?.lastName || ""}`.trim(),

        email: request.email || request.user?.email || "",
        studentId: request.user?.studentId || "No ID",

        joinedAt: request.updatedAt || request.createdAt,
        createdAt: request.createdAt,

        status: "confirmed",
        role: "organizer",

        pointsHistoryId: pointsRecord._id,
        points: pointsRecord.points || 50,
        pointsStatus: pointsRecord.status,

        eventEndAt,
        earnedAt,
        eventHasFinished,
        canRevokePoints,

        revokeAvailableAt: eventEndAt,
        timeLeftMs: earnedAt ? Math.max(earnedAt - now, 0) : 0
      });
    }

    res.status(200).json(organizers);
  } catch (error) {
    console.log("getManagerParticipants error:", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
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