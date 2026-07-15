// routes/riderAssignmentRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAvailableRiders,
  assignRiderToOrder,
  updateDeliveryStatus,
  getRiderOrders,
  getDeliveryOrders,
  unassignRiderFromOrder,
} = require("../controllers/riderAssignmentController");
const { protect } = require("../middleware/authMiddleware");

// Admin routes
router.get("/admin/available-riders", protect, getAvailableRiders);
router.post("/admin/assign-rider", protect, assignRiderToOrder);
router.get("/admin/delivery-orders", protect, getDeliveryOrders);
router.delete("/admin/unassign-rider/:orderId", protect, unassignRiderFromOrder);

// Rider routes
router.get("/rider/my-orders", protect, getRiderOrders);
router.put("/rider/update-delivery-status", protect, updateDeliveryStatus);

module.exports = router;