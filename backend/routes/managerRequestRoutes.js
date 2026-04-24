const express = require("express");
const router = express.Router();

const {
  applyForManager,
  getAllManagerRequests,
  updateManagerRequestStatus,
  getApprovedManagers,
  removeManager
} = require("../controllers/managerRequestController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post("/", protect, authorizeRoles("student"), applyForManager);

router.get("/", protect, authorizeRoles("admin"), getAllManagerRequests);

router.get(
  "/approved-managers",
  protect,
  authorizeRoles("admin"),
  getApprovedManagers
);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  updateManagerRequestStatus
);

router.put(
  "/:id/remove-manager",
  protect,
  authorizeRoles("admin"),
  removeManager
);

module.exports = router;