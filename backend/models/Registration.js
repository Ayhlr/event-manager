const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["confirmed", "pending", "cancelled"],
      default: "confirmed"
    },
    joinType: {
      type: String,
      enum: ["attendee", "organizer_request"],
      default: "attendee"
    },
    pointsEarned: {
      type: Number,
      default: 0
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    message: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      default: ""
    },
    studentId: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", registrationSchema);