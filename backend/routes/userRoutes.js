const express = require("express");
const router = express.Router();

const {
  getMyProfile,
  updateMyProfile,
  changePassword,
  deleteMyAccount
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.put("/change-password", protect, changePassword);
router.delete("/me", protect, deleteMyAccount);

module.exports = router;