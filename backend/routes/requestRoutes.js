const express = require("express");
const router = express.Router();
const {
  createOrganizerRequest,
  getMyRequests,
  getManagerEventRequests,
  updateRequestStatus,
  cancelMyRequest
} = require("../controllers/requestController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/", protect, authorizeRoles("student"), createOrganizerRequest);

router.get("/my-requests", protect, authorizeRoles("student"), getMyRequests);

router.get("/manager", protect, authorizeRoles("manager", "admin"), getManagerEventRequests);

router.put("/:id/status", protect, authorizeRoles("manager", "admin"), updateRequestStatus);

router.delete("/:id", protect, authorizeRoles("student"), cancelMyRequest);

module.exports = router;