const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addToCart,
  getCart,
  removeCartItem,
} = require("../controllers/cartController");

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/:id", protect, removeCartItem);

module.exports = router;