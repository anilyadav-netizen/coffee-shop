const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createOrder,
  verifyPayment,
  getMyOrders,
  getUserOrders,
  getPurchaseAnalytics,
} = require("../controllers/paymentController");

// Create Razorpay Order
router.post(
  "/create-order",
  protect,
  createOrder
);

// Verify Payment
router.post(
  "/verify-payment",
  protect,
  verifyPayment
);

// Get Logged-in User Orders
router.get(
  "/orderDetails",
  protect,
  getUserOrders
);

router.get("/analytics", protect, getPurchaseAnalytics);



module.exports = router;