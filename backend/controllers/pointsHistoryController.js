const PointsHistory = require("../models/PointsHistory");
const Event = require("../models/Event");
const User = require("../models/User");

const getMyPointsHistory = async (req, res) => {
  try {
    const pointsHistory = await PointsHistory.find({ user: req.user._id })
      .populate("event", "title date location points")
      .sort({ createdAt: -1 });

    res.status(200).json(pointsHistory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updatePointsStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["earned", "revoked"].includes(status)) {
      return res.status(400).json({ message: "Status must be earned or revoked" });
    }

    const pointsRecord = await PointsHistory.findById(req.params.id)
      .populate("event")
      .populate("user");

    if (!pointsRecord) {
      return res.status(404).json({ message: "Points record not found" });
    }

    if (!pointsRecord.event || pointsRecord.event.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (pointsRecord.status === "earned") {
      return res.status(400).json({ message: "Points already marked as earned" });
    }

    if (status === "earned" && pointsRecord.status !== "earned") {
      pointsRecord.user.totalPoints += pointsRecord.points;
      await pointsRecord.user.save();
    }

    pointsRecord.status = status;
    await pointsRecord.save();

    res.status(200).json({
      message: `Points ${status} successfully`,
      pointsRecord
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getMyPointsHistory, updatePointsStatus };