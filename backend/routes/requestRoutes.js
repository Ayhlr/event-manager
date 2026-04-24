const express = require("express");
const router = express.Router();
const {
  createOrganizerRequest,
  getMyRequests,
  getManagerEventRequests,
  updateRequestStatus
} = require("../controllers/requestController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/", protect, authorizeRoles("student"), createOrganizerRequest);
router.get("/my-requests", protect, authorizeRoles("student"), getMyRequests);
router.get("/manager", protect, authorizeRoles("manager", "admin"), getManagerEventRequests);
router.put("/:id/status", protect, authorizeRoles("manager", "admin"), updateRequestStatus);

module.exports = router;