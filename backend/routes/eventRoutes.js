const express = require("express");
const router = express.Router();

const {
  createEvent,
  getApprovedEvents,
  getAllEventsForAdmin,
  getMyEvents,
  updateEventStatus,
  getEventById,
  updateEvent,
  deleteEvent
} = require("../controllers/eventController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/", getApprovedEvents);

router.get(
  "/admin/all",
  protect,
  authorizeRoles("admin"),
  getAllEventsForAdmin
);

router.get(
  "/my-events",
  protect,
  authorizeRoles("manager", "admin"),
  getMyEvents
);

router.get("/:id", getEventById);

router.post("/", protect, authorizeRoles("manager", "admin"), createEvent);

router.put("/:id", protect, authorizeRoles("manager", "admin"), updateEvent);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  updateEventStatus
);

router.delete("/:id", protect, authorizeRoles("manager", "admin"), deleteEvent);

module.exports = router;