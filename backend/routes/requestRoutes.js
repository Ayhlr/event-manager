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

router.post("/", protect, createOrganizerRequest);
router.get("/my-requests", protect, getMyRequests);
router.get("/manager", protect, getManagerEventRequests);
router.put("/:id/status", protect, updateRequestStatus);
router.delete("/:id", protect, cancelMyRequest);
module.exports = router;