const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Registration = require("../models/Registration");
const PointsHistory = require("../models/PointsHistory");

const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userObject = user.toObject();

    if (!userObject.roles || userObject.roles.length === 0) {
      userObject.roles = [userObject.role || "student"];
    }

    res.status(200).json(userObject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, bio, notifPref, profVis } = req.body;

    const updateData = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (bio !== undefined) updateData.bio = bio;
    if (notifPref !== undefined) updateData.notifPref = notifPref;
    if (profVis !== undefined) updateData.profVis = profVis;

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.log("Update profile error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Please fill all password fields" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password do not match"
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      message: "Password changed successfully"
    });
  } catch (error) {
    console.log("Change password error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteMyAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({
      message: "Account deleted successfully"
    });
  } catch (error) {
    console.log("Delete account error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getStudentProfileSummary = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select(
      "firstName lastName email studentId phoneNumber bio"
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const eventsJoined = await Registration.countDocuments({
      user: req.params.id
    });

    const earnedPoints = await PointsHistory.find({
      user: req.params.id,
      status: "earned"
    });

    const organizerPoints = earnedPoints.reduce((total, record) => {
      return total + Number(record.points || 0);
    }, 0);

    res.status(200).json({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      studentId: student.studentId,
      phoneNumber: student.phoneNumber,
      bio: student.bio,
      organizerPoints,
      eventsJoined
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllManagers = async (req, res) => {
  try {
    const managers = await User.find({
      $or: [{ role: "manager" }, { roles: "manager" }]
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(managers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchStudents = async (req, res) => {
  try {
    const searchValue = req.query.search || "";

    if (!searchValue.trim()) {
      return res.status(400).json({ message: "Please enter an email or name to search" });
    }

    const students = await User.find({
      role: { $ne: "admin" },
      $or: [
        { email: { $regex: searchValue, $options: "i" } },
        { firstName: { $regex: searchValue, $options: "i" } },
        { lastName: { $regex: searchValue, $options: "i" } },
        { studentId: { $regex: searchValue, $options: "i" } }
      ]
    })
      .select("-password")
      .limit(10);

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const grantManagerAccess = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin users cannot be changed to managers" });
    }

    if (!user.roles || user.roles.length === 0) {
      user.roles = [user.role || "student"];
    }

    if (!user.roles.includes("student")) {
      user.roles.push("student");
    }

    if (!user.roles.includes("manager")) {
      user.roles.push("manager");
    }

    user.role = "student";

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    res.status(200).json({
      message: "Manager access granted successfully",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeManagerAccess = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.roles = (user.roles || []).filter((role) => role !== "manager");

    if (!user.roles.includes("student")) {
      user.roles.push("student");
    }

    user.role = "student";

    await user.save();

    res.status(200).json({
      message: "Manager access removed successfully",
      user: await User.findById(user._id).select("-password")
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  changePassword,
  deleteMyAccount,
  getStudentProfileSummary,
  getAllManagers,
  searchStudents,
  grantManagerAccess,
  removeManagerAccess
};