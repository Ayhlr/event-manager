const express = require("express");
const router = express.Router();

const {
  getMyProfile,
  updateMyProfile,
  changePassword,
  deleteMyAccount,
  getStudentProfileSummary,
  getAllManagers,
  searchStudents,
  grantManagerAccess,
  removeManagerAccess
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const adminOnly = (req, res, next) => {
  const roles = req.user.roles || [req.user.role];

  if (req.user.role === "admin" || roles.includes("admin")) {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.put("/change-password", protect, changePassword);
router.delete("/me", protect, deleteMyAccount);

router.get("/managers", protect, getAllManagers);
router.get("/students/search", protect, adminOnly, searchStudents);
router.put("/:id/grant-manager", protect, adminOnly, grantManagerAccess);
router.put("/:id/remove-manager", protect, adminOnly, removeManagerAccess);

router.get("/:id/profile-summary", protect, getStudentProfileSummary);

module.exports = router;