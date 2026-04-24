const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    phoneNumber: {
      type: String,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    studentId: {
      type: String,
      trim: true
    },

    role: {
      type: String,
      enum: ["student", "manager", "admin"],
      default: "student"
    },

    bio: {
      type: String,
      default: ""
    },

    notifPref: {
      eventReminders: {
        type: Boolean,
        default: true
      },
      newEvents: {
        type: Boolean,
        default: true
      },
      requestUpdates: {
        type: Boolean,
        default: true
      },
      emailDigest: {
        type: Boolean,
        default: false
      }
    },

    profVis: {
      type: String,
      enum: ["public", "private"],
      default: "public"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);