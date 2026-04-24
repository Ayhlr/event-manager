const mongoose = require("mongoose");

const managerRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    date: {
      type: Date,
      default: Date.now
    },
    approvalDate: {
      type: Date,
      default: null
    },
    duration: {
      type: String,
      default: "6 months"
    },
    expiryDate: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ManagerRequest", managerRequestSchema);