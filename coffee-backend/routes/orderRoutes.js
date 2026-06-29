const express = require("express");
const router = express.Router();

const {
  updateOrderStatus,
} = require("../controllers/riderController");
const protect = require("../middleware/authMiddleware");


// Update Order Status
router.put("/update-status/:orderId", protect, updateOrderStatus);

module.exports = router;