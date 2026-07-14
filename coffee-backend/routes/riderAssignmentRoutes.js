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
const { auth, isAdmin, isRider } = require("../middleware/auth");

// Admin routes
router.get("/admin/available-riders", auth, isAdmin, getAvailableRiders);
router.post("/admin/assign-rider", auth, isAdmin, assignRiderToOrder);
router.get("/admin/delivery-orders", auth, isAdmin, getDeliveryOrders);
router.delete("/admin/unassign-rider/:orderId", auth, isAdmin, unassignRiderFromOrder);

// Rider routes
router.get("/rider/my-orders", auth, isRider, getRiderOrders);
router.put("/rider/update-delivery-status", auth, isRider, updateDeliveryStatus);

module.exports = router;