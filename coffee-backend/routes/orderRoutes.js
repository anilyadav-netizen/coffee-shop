const express = require("express");
const router = express.Router();

const {
  updateOrderStatus,
} = require("../controllers/riderController");
const {protect} = require("../middleware/authMiddleware");
const { getAllOrders } = require("../controllers/orderController");


// Update Order Status
router.put("/update-status/:orderId", protect, updateOrderStatus);

router.get("/admin/all", protect,  getAllOrders);


module.exports = router;