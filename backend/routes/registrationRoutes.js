const express = require("express");
const router = express.Router();

const {
  joinEvent,
  getMyRegistrations,
  getManagerParticipants,
  unenrollEvent
} = require("../controllers/registrationController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/", protect, authorizeRoles("student"), joinEvent);

router.get(
  "/my-registrations",
  protect,
  authorizeRoles("student"),
  getMyRegistrations
);

router.get(
  "/manager-participants",
  protect,
  authorizeRoles("manager", "admin"),
  getManagerParticipants
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("student"),
  unenrollEvent
);

module.exports = router;