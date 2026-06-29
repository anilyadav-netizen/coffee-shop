const express = require("express");
const router = express.Router();

const {protect} = require("../middleware/authMiddleware");

const {
  addToCart,
  getCart,
  removeCartItem,
  increaseQuantity,
  decreaseQuantity,
} = require("../controllers/cartController");

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/:coffeeId", protect, removeCartItem);

router.patch("/increase/:coffeeId", protect, increaseQuantity);
router.patch("/decrease/:coffeeId", protect, decreaseQuantity);

module.exports = router;