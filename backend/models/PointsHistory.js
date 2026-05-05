const mongoose = require("mongoose");

const pointsHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },
    eventName: {
      type: String,
      required: true,
      trim: true
    },
    points: {
  type: Number,
  required: true,
  default: 50
},
    status: {
      type: String,
      enum: ["pending", "earned", "revoked"],
      default: "pending"
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PointsHistory", pointsHistorySchema);