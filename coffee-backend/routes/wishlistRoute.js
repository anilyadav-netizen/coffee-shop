const express = require("express");
const router = express.Router();

const {
  createWishlist,
  getWishlist,
  updateWishlist,
  deleteWishlist,
} = require("../controllers/wishlistController.js");

const protect = require("../middleware/authMiddleware");

// Add
router.post("/", protect, createWishlist);

// Get Logged In User Wishlist
router.get("/", protect, getWishlist);

// Update
router.put("/:id", protect, updateWishlist);

// Delete
router.delete("/:id", protect, deleteWishlist);

module.exports = router;