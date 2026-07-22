const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  getProfile,
  updateAddress,
  getAllUsers,
  deleteUser,
  createAddress,
  deleteAddress,
  updateUserRole
} = require("../controllers/authcontroller");
const { protect } = require("../middleware/authMiddleware");


// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected Routes
router.post("/logout", protect, logout);
router.get("/profile", protect, getProfile);

router.post("/address", protect, createAddress);

router.put("/address/:addressId", protect, updateAddress);
router.delete("/address/:addressId", protect, deleteAddress);

router.get("/all", protect, getAllUsers);
router.delete("/delete/:id", protect, deleteUser);

router.put(
  "/update-role/:id",
  updateUserRole
);



module.exports = router;