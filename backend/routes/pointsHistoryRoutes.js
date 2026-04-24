const express = require("express");
const router = express.Router();
const { getMyPointsHistory, updatePointsStatus } = require("../controllers/pointsHistoryController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/my-points", protect, getMyPointsHistory);
router.put("/:id/status", protect, authorizeRoles("manager", "admin"), updatePointsStatus);

module.exports = router;