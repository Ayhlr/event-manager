const PointsHistory = require("../models/PointsHistory");
const User = require("../models/User");

const getMyPointsHistory = async (req, res) => {
  try {
    const pointsHistory = await PointsHistory.find({ user: req.user._id })
      .populate("event", "title date location points")
      .sort({ createdAt: -1 });

    const now = new Date();

    for (const record of pointsHistory) {
      const createdAt = new Date(record.createdAt);

      // REAL VERSION: 48 hours
      //const earnedAt = new Date(createdAt.getTime() + 48 * 60 * 60 * 1000);

      // TEST VERSION: 1 minute
       const earnedAt = new Date(createdAt.getTime() + 1 * 60 * 1000);

      if (record.status === "pending" && now >= earnedAt) {
        const user = await User.findById(record.user);

        if (user) {
          user.totalPoints =
            Number(user.totalPoints || 0) + Number(record.points || 0);
          await user.save();
        }

        record.status = "earned";
        await record.save();
      }
    }

    const updatedHistory = await PointsHistory.find({ user: req.user._id })
      .populate("event", "title date location points")
      .sort({ createdAt: -1 });

    const historyWithCountdown = updatedHistory.map((record) => {
      const createdAt = new Date(record.createdAt);

      // REAL VERSION: 48 hours
      //const earnedAt = new Date(createdAt.getTime() + 48 * 60 * 60 * 1000);

      // TEST VERSION: 1 minute
       const earnedAt = new Date(createdAt.getTime() + 1 * 60 * 1000);

      const timeLeftMs = earnedAt - new Date();

      return {
        ...record.toObject(),
        earnedAt,
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
      !pointsRecord.event ||
      pointsRecord.event.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (pointsRecord.status === "earned") {
      return res.status(400).json({
        message: "Points already marked as earned"
      });
    }

    if (status === "earned") {
      pointsRecord.user.totalPoints =
        Number(pointsRecord.user.totalPoints || 0) +
        Number(pointsRecord.points || 0);

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

module.exports = {
  getMyPointsHistory,
  updatePointsStatus
};