const PointsHistory = require("../models/PointsHistory");
const User = require("../models/User");

const EARN_AFTER_MS = 48 * 60 * 60 * 1000;

// Combines event.date + event.time into one Date object
const getEventDateTime = (event) => {
  if (!event || !event.date) return null;

  const eventDate = new Date(event.date);

  if (Number.isNaN(eventDate.getTime())) return null;

  let hours = 23;
  let minutes = 59;

  if (event.time) {
    const timeString = String(event.time).trim();

    // Supports "14:30", "2:30 PM", "02:30 PM"
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

const getMyPointsHistory = async (req, res) => {
  try {
    const pointsHistory = await PointsHistory.find({ user: req.user._id })
      .populate("event", "title date time location points user")
      .sort({ createdAt: -1 });

    const now = new Date();

    for (const record of pointsHistory) {
      // Fix old records with 0 points
      if (!record.points || record.points === 0) {
        record.points = 50;
      }

      const eventEndAt = getEventDateTime(record.event);

      const earnedAt = eventEndAt
        ? new Date(eventEndAt.getTime() + EARN_AFTER_MS)
        : null;

      // Points become earned only 48 hours after the event time
      if (
        record.status === "pending" &&
        earnedAt &&
        now >= earnedAt
      ) {
        record.status = "earned";

        await addPointsToUserOnce(record);
      }

      await record.save();
    }

    const updatedHistory = await PointsHistory.find({ user: req.user._id })
      .populate("event", "title date time location points user")
      .sort({ createdAt: -1 });

    const historyWithCountdown = updatedHistory.map((record) => {
      const eventEndAt = getEventDateTime(record.event);

      const earnedAt = eventEndAt
        ? new Date(eventEndAt.getTime() + EARN_AFTER_MS)
        : null;

      const now = new Date();

      const timeLeftMs = earnedAt ? earnedAt - now : 0;

      return {
        ...record.toObject(),
        eventEndAt,
        earnedAt,
        eventHasFinished: eventEndAt ? now >= eventEndAt : false,
        timeLeftMs: timeLeftMs > 0 ? timeLeftMs : 0
      };
    });

    res.status(200).json(historyWithCountdown);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updatePointsStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["earned", "revoked"].includes(status)) {
      return res.status(400).json({
        message: "Status must be earned or revoked"
      });
    }

    const pointsRecord = await PointsHistory.findById(req.params.id)
      .populate("event")
      .populate("user");

    if (!pointsRecord) {
      return res.status(404).json({ message: "Points record not found" });
    }

    if (
      req.user.role !== "admin" &&
      (!pointsRecord.event ||
        pointsRecord.event.user.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Fix old records with 0 points
    if (!pointsRecord.points || pointsRecord.points === 0) {
      pointsRecord.points = 50;
    }

    const eventEndAt = getEventDateTime(pointsRecord.event);

    if (!eventEndAt) {
      return res.status(400).json({
        message: "Event date/time is missing, so points cannot be updated."
      });
    }

    const earnedAt = new Date(eventEndAt.getTime() + EARN_AFTER_MS);
    const now = new Date();

    // If event has not finished, manager cannot revoke yet
    if (now < eventEndAt) {
      return res.status(400).json({
        message: "You can only revoke points after the event has finished."
      });
    }

    // If 48 hours after the event already passed, points become earned
    if (pointsRecord.status === "pending" && now >= earnedAt) {
      pointsRecord.status = "earned";

      if (pointsRecord.user) {
        pointsRecord.user.totalPoints =
          Number(pointsRecord.user.totalPoints || 0) +
          Number(pointsRecord.points || 50);

        await pointsRecord.user.save();
      }

      await pointsRecord.save();

      return res.status(400).json({
        message:
          "Points are already earned because 48 hours passed after the event."
      });
    }

    // If already earned, manager cannot revoke
    if (pointsRecord.status === "earned") {
      return res.status(400).json({
        message: "Points are already earned and cannot be revoked."
      });
    }

    // If already revoked, do not update again
    if (pointsRecord.status === "revoked") {
      return res.status(400).json({
        message: "Points are already revoked."
      });
    }

    // Manager can revoke only after event finished and before 48 hours passed
    if (status === "revoked") {
      pointsRecord.status = "revoked";
      await pointsRecord.save();

      return res.status(200).json({
        message: "Points revoked successfully",
        pointsRecord
      });
    }

    // Optional manual earning, still only after event finished
    if (status === "earned") {
      pointsRecord.status = "earned";

      if (pointsRecord.user) {
        pointsRecord.user.totalPoints =
          Number(pointsRecord.user.totalPoints || 0) +
          Number(pointsRecord.points || 50);

        await pointsRecord.user.save();
      }

      await pointsRecord.save();

      return res.status(200).json({
        message: "Points earned successfully",
        pointsRecord
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getMyPointsHistory,
  updatePointsStatus
};