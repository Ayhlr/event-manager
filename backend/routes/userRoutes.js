const express = require("express");
const router = express.Router();

const {
  getMyProfile,
  updateMyProfile,
  changePassword,
  deleteMyAccount,
  getStudentProfileSummary,
  getAllManagers
} = require("../controllers/userController");;

const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.put("/change-password", protect, changePassword);
router.delete("/me", protect, deleteMyAccount);
router.get("/:id/profile-summary", protect, getStudentProfileSummary);
router.get("/managers", protect, getAllManagers);
module.exports = router;