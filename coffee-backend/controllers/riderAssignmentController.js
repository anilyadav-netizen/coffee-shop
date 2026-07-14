// controllers/riderAssignmentController.js
const Order = require("../models/orderModel");
const User = require("../models/userModel");

// Get all available riders
exports.getAvailableRiders = async (req, res) => {
  try {
    const riders = await User.find({
      role: "rider",
      isAvailable: true,
      "riderDetails.isBusy": false,
    }).select("-password");

    res.status(200).json({
      success: true,
      riders,
    });
  } catch (error) {
    console.error("Error fetching available riders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching available riders",
      error: error.message,
    });
  }
};

// Assign rider to delivery order
exports.assignRiderToOrder = async (req, res) => {
  try {
    const { orderId, riderId, notes } = req.body;
    const adminId = req.user.id; // Assuming admin is authenticated

    // Validate order
    const order = await Order.findById(orderId).populate("user", "name email mobile");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order is delivery type
    if (order.orderType !== "delivery") {
      return res.status(400).json({
        success: false,
        message: "This order is not a delivery order",
      });
    }

    // Check order status
    if (order.orderStatus === "delivered" || order.orderStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: `Cannot assign rider to ${order.orderStatus} order`,
      });
    }

    // Validate rider
    const rider = await User.findById(riderId);
    if (!rider) {
      return res.status(404).json({
        success: false,
        message: "Rider not found",
      });
    }

    if (rider.role !== "rider") {
      return res.status(400).json({
        success: false,
        message: "User is not a rider",
      });
    }

    if (!rider.isAvailable || rider.riderDetails.isBusy) {
      return res.status(400).json({
        success: false,
        message: "Rider is not available or busy with another delivery",
      });
    }

    // Update rider status
    rider.riderDetails.isBusy = true;
    rider.riderDetails.currentOrder = orderId;
    await rider.save();

    // Update order with rider assignment
    order.assignedRider = riderId;
    order.riderAssignment = {
      assignedBy: adminId,
      assignedAt: new Date(),
      notes: notes || "",
    };
    order.orderStatus = "assigned_to_rider";

    // Add tracking entry
    order.tracking.push({
      status: "assigned_to_rider",
      message: `Order assigned to rider ${rider.name}`,
      time: new Date(),
    });

    await order.save();

    // Populate rider details for response
    const populatedOrder = await Order.findById(orderId)
      .populate("assignedRider", "name mobile email currentLocation riderDetails")
      .populate("riderAssignment.assignedBy", "name email");

    // Emit socket events
    const io = req.app.get("io");

    // Send to rider
    io.to(`rider_${riderId}`).emit("new_order_assigned", {
      order: populatedOrder,
      message: "New order assigned to you",
    });

    // Send to admin
    io.to(`admin_${adminId}`).emit("rider_assigned", {
      order: populatedOrder,
      message: `Rider ${rider.name} assigned to order #${order._id}`,
    });

    // Send to user (customer)
    io.to(`user_${order.user._id}`).emit("order_rider_assigned", {
      orderId: order._id,
      rider: {
        name: rider.name,
        mobile: rider.mobile,
      },
      message: "Rider has been assigned to your order",
    });

    res.status(200).json({
      success: true,
      message: "Rider assigned successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Error assigning rider:", error);
    res.status(500).json({
      success: false,
      message: "Error assigning rider to order",
      error: error.message,
    });
  }
};

// Update rider delivery status (for rider)
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId, status, message } = req.body;
    const riderId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify rider is assigned to this order
    if (order.assignedRider.toString() !== riderId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this order",
      });
    }

    const validStatuses = ["out_for_delivery", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status update",
      });
    }

    // Update order status
    order.orderStatus = status;
    order.tracking.push({
      status: status,
      message: message || `Order ${status}`,
      time: new Date(),
    });

    if (status === "delivered") {
      order.deliveredAt = new Date();

      // Update rider stats
      const rider = await User.findById(riderId);
      if (rider) {
        rider.riderDetails.totalDeliveries += 1;
        rider.riderDetails.isBusy = false;
        rider.riderDetails.currentOrder = null;
        await rider.save();
      }
    }

    await order.save();

    // Populate order for response
    const populatedOrder = await Order.findById(orderId)
      .populate("assignedRider", "name mobile")
      .populate("user", "name email mobile");

    // Emit socket events
    const io = getIO();
    io.to(`admin`).emit("delivery_status_updated", {
      order: populatedOrder,
      status: status,
      message: `Order #${orderId} status updated to ${status}`,
    });

    io.to(`user_${order.user._id}`).emit("delivery_status_updated", {
      orderId: orderId,
      status: status,
      message: message || `Your order is ${status}`,
    });

    io.to(`rider_${riderId}`).emit("delivery_status_confirmed", {
      orderId: orderId,
      status: status,
      message: `Delivery status updated to ${status}`,
    });

    res.status(200).json({
      success: true,
      message: "Delivery status updated successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Error updating delivery status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating delivery status",
      error: error.message,
    });
  }
};

// Get orders assigned to a specific rider
exports.getRiderOrders = async (req, res) => {
  try {
    const riderId = req.user.id;

    const orders = await Order.find({
      assignedRider: riderId,
    })
      .populate("user", "name email mobile")
      .populate("assignedRider", "name mobile")
      .sort({ createdAt: -1 });

    // Separate active and completed orders
    const activeOrders = orders.filter(
      (order) => order.orderStatus !== "delivered" && order.orderStatus !== "cancelled"
    );

    const completedOrders = orders.filter(
      (order) => order.orderStatus === "delivered" || order.orderStatus === "cancelled"
    );

    res.status(200).json({
      success: true,
      activeOrders,
      completedOrders,
    });
  } catch (error) {
    console.error("Error fetching rider orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching rider orders",
      error: error.message,
    });
  }
};

// Admin: Get all delivery orders
exports.getDeliveryOrders = async (req, res) => {
  try {
    const { status } = req.query;

    let query = { orderType: "delivery" };

    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate("user", "name email mobile")
      .populate("assignedRider", "name mobile email currentLocation riderDetails")
      .populate("riderAssignment.assignedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching delivery orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching delivery orders",
      error: error.message,
    });
  }
};

// Admin: Unassign rider from order
exports.unassignRiderFromOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const adminId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.assignedRider) {
      return res.status(400).json({
        success: false,
        message: "No rider assigned to this order",
      });
    }

    // Free up the rider
    const rider = await User.findById(order.assignedRider);
    if (rider) {
      rider.riderDetails.isBusy = false;
      rider.riderDetails.currentOrder = null;
      await rider.save();
    }

    // Remove rider from order
    const previousRider = order.assignedRider;
    order.assignedRider = null;
    order.riderAssignment = {
      assignedBy: adminId,
      assignedAt: new Date(),
      notes: "Rider unassigned by admin",
    };
    order.orderStatus = "preparing"; // Revert to preparing

    order.tracking.push({
      status: "preparing",
      message: "Rider unassigned, order is being prepared",
      time: new Date(),
    });

    await order.save();

    const populatedOrder = await Order.findById(orderId)
      .populate("user", "name email mobile");

    // Emit socket events
    const io = getIO();
    io.to(`rider_${previousRider}`).emit("order_unassigned", {
      orderId: orderId,
      message: "Order has been unassigned from you",
    });

    io.to(`admin_${adminId}`).emit("rider_unassigned", {
      order: populatedOrder,
      message: `Rider unassigned from order #${orderId}`,
    });

    res.status(200).json({
      success: true,
      message: "Rider unassigned successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Error unassigning rider:", error);
    res.status(500).json({
      success: false,
      message: "Error unassigning rider",
      error: error.message,
    });
  }
};