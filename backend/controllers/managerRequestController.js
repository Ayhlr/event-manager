const ManagerRequest = require("../models/ManagerRequest");
const User = require("../models/User");

const applyForManager = async (req, res) => {
  try {
    const existingRequest = await ManagerRequest.findOne({
      user: req.user._id,
      status: "pending"
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You already have a pending manager request"
      });
    }

    const managerRequest = await ManagerRequest.create({
      user: req.user._id,
      name: `${req.user.firstName} ${req.user.lastName}`,
      email: req.user.email,
      status: "pending"
    });

    res.status(201).json({
      message: "Manager request submitted successfully",
      managerRequest
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllManagerRequests = async (req, res) => {
  try {
    const requests = await ManagerRequest.find()
      .populate("user", "firstName lastName email role")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateManagerRequestStatus = async (req, res) => {
  try {
    const { status, duration } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be approved or rejected"
      });
    }

    const managerRequest = await ManagerRequest.findById(req.params.id);

    if (!managerRequest) {
      return res.status(404).json({ message: "Manager request not found" });
    }

    managerRequest.status = status;
    managerRequest.approvalDate = new Date();

    if (status === "approved") {
      const requestDuration = duration || "6 months";
      managerRequest.duration = requestDuration;

      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + 6);
      managerRequest.expiryDate = expiry;

      const user = await User.findById(managerRequest.user);

      if (user) {
        user.role = "manager";
        await user.save();
      }
    } else {
      managerRequest.expiryDate = null;
    }

    const updatedRequest = await managerRequest.save();

    res.status(200).json({
      message: `Manager request ${status} successfully`,
      managerRequest: updatedRequest
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getApprovedManagers = async (req, res) => {
  try {
    const approvedRequests = await ManagerRequest.find({
      status: "approved"
    })
      .populate("user", "firstName lastName email role")
      .sort({ approvalDate: -1 });

    res.status(200).json(approvedRequests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const removeManager = async (req, res) => {
  try {
    const managerRequest = await ManagerRequest.findById(req.params.id);

    if (!managerRequest) {
      return res.status(404).json({ message: "Manager record not found" });
    }

    const user = await User.findById(managerRequest.user);

    if (user) {
      user.role = "student";
      await user.save();
    }

    managerRequest.status = "rejected";
    managerRequest.expiryDate = new Date();

    await managerRequest.save();

    res.status(200).json({
      message: "Manager removed successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  applyForManager,
  getAllManagerRequests,
  updateManagerRequestStatus,
  getApprovedManagers,
  removeManager
};