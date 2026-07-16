// routes/riderAssignmentRoutes.js
const express = require("express");
const router = express.Router();
const riderAssignmentController = require("../controllers/riderAssignmentController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/admin/available-riders", protect, riderAssignmentController.getAvailableRiders);

// Admin routes
router.post("/admin/assign-rider", protect, riderAssignmentController.assignRiderToOrder);
router.put("/admin/unassign-rider/:orderId", protect, riderAssignmentController.unassignRiderFromOrder);
router.get("/delivery-orders", protect, riderAssignmentController.getDeliveryOrders);
router.put("/admin/update-order-status", protect, riderAssignmentController.adminUpdateOrderStatus);

// Rider routes
router.get("/rider/my-orders", protect, riderAssignmentController.getRiderOrders);
router.put("/rider/update-delivery-status", protect, riderAssignmentController.updateDeliveryStatus);
router.get("/rider/my-order/:orderId", protect, riderAssignmentController.getRiderOrderById);

module.exports = router;