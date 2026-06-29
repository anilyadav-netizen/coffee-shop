const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  getProfile,
  updateAddress,
  getAllUsers,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected Routes
router.post("/logout", protect, logout);
router.get("/profile", protect, getProfile);
router.put("/address/:addressId", protect, updateAddress);
router.get("/all", protect, getAllUsers);



module.exports = router;