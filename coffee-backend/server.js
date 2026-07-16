require("dotenv").config();
const express = require("express");
const dns = require("dns");
const cors = require("cors");
const http = require("http");
const cookies = require("cookie-parser");
const { Server } = require("socket.io");

const app = express();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

app.use(cookies());

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
);
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

const Port = process.env.PORT || 5000;

// Database
const connectDB = require("./config/connect.db");

// Routes
const authRoutes = require("./routes/authRoutes");
const coffeeRoutes = require("./routes/coffeeRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const wishlistRoute = require("./routes/wishlistRoute");
const categoryRoute = require("./routes/category.routes");
const updatedeliveryRoute = require("./routes/orderRoutes");
const tableRoutes = require("./routes/tableRoutes");
const riderAssignmentRoutes = require("./routes/riderAssignmentRoutes");

// Create HTTP Server
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
});

// Make io available everywhere
app.set("io", io);

// ============================================================
// SOCKET CONNECTION HANDLER
// ============================================================
io.on("connection", (socket) => {
  console.log("🟢 User Connected:", socket.id);

  // ==========================================================
  // 1. JOIN ROOMS
  // ==========================================================

  // Join order room
  socket.on("join-order", (orderId) => {
    socket.join(orderId);
    console.log(`📦 Joined Order Room: ${orderId}`);
  });

  // Join user room
  socket.on("join-user", (userId) => {
    if (userId) {
      socket.join(`user-${userId}`);
      console.log(`👤 Joined User Room: user-${userId}`);
    }
  });

  // Join rider room
  socket.on("join-rider", (riderId) => {
    if (riderId) {
      socket.join(`rider-${riderId}`);
      console.log(`🏍️ Joined Rider Room: rider-${riderId}`);
    }
  });

  // Join admin room
  socket.on("join-admin", (adminId) => {
    if (adminId) {
      socket.join(`admin-${adminId}`);
      console.log(`👤 Joined Admin Room: admin-${adminId}`);
    }
    // Also join general admin room
    socket.join("admin");
    console.log(`👤 Joined General Admin Room: admin`);
  });

  // Join rider location room
  socket.on("join-rider-location", (riderId) => {
    if (riderId) {
      socket.join(`rider-location-${riderId}`);
      console.log(`📍 Joined Rider Location Room: rider-location-${riderId}`);
    }
  });

  // ==========================================================
  // 2. ADMIN EVENTS
  // ==========================================================

  // Admin join
  socket.on("admin-join", (adminId) => {
    if (adminId) {
      socket.join(`admin-${adminId}`);
      console.log(`👤 Admin ${adminId} joined room`);
    }
    socket.join("admin");
    console.log("👤 Admin joined general admin room");
  });

  // Admin update order status
  socket.on("order-status-update", (data) => {
    const { orderId, newStatus, tracking, updatedBy, riderId, userId } = data;

    console.log(`📡 Order status update requested: ${orderId} -> ${newStatus}`);

    // Broadcast to admin room
    io.to("admin").emit("order-status-updated", {
      orderId,
      newStatus,
      status: newStatus,
      tracking,
      timestamp: new Date(),
      updatedBy: updatedBy || "admin",
    });

    // Broadcast to specific admin
    if (updatedBy) {
      io.to(`admin-${updatedBy}`).emit("order-status-updated", {
        orderId,
        newStatus,
        status: newStatus,
        tracking,
        timestamp: new Date(),
        updatedBy: updatedBy || "admin",
      });
    }

    // Broadcast to rider if assigned
    if (riderId) {
      io.to(`rider-${riderId}`).emit("order-status-updated", {
        orderId,
        newStatus,
        status: newStatus,
        tracking,
        timestamp: new Date(),
        updatedBy: updatedBy || "admin",
      });
    }

    // Broadcast to user
    if (userId) {
      io.to(`user-${userId}`).emit("order-status-updated", {
        orderId,
        newStatus,
        status: newStatus,
        tracking,
        timestamp: new Date(),
        updatedBy: updatedBy || "admin",
      });
    }

    // Broadcast to order room
    io.to(orderId).emit("order-status-updated", {
      orderId,
      newStatus,
      status: newStatus,
      tracking,
      timestamp: new Date(),
      updatedBy: updatedBy || "admin",
    });

    // Global broadcast
    io.emit("order-update-broadcast", {
      orderId,
      newStatus,
      status: newStatus,
      tracking,
      timestamp: new Date(),
      updatedBy: updatedBy || "admin",
    });

    console.log(`✅ Order ${orderId} status updated to ${newStatus}`);
  });

  // Admin cancel order
  socket.on("cancel-order", (data) => {
    const { orderId, reason, cancelledBy, riderId, userId } = data;

    console.log(`❌ Order cancellation requested: ${orderId}`);

    // Broadcast to admin
    io.to("admin").emit("order-cancelled", {
      orderId,
      reason,
      cancelledBy: cancelledBy || "admin",
      timestamp: new Date(),
    });

    // Broadcast to specific admin
    if (cancelledBy) {
      io.to(`admin-${cancelledBy}`).emit("order-cancelled", {
        orderId,
        reason,
        cancelledBy: cancelledBy || "admin",
        timestamp: new Date(),
      });
    }

    // Broadcast to rider
    if (riderId) {
      io.to(`rider-${riderId}`).emit("order-cancelled", {
        orderId,
        reason,
        cancelledBy: cancelledBy || "admin",
        timestamp: new Date(),
      });
    }

    // Broadcast to user
    if (userId) {
      io.to(`user-${userId}`).emit("order-cancelled", {
        orderId,
        reason,
        cancelledBy: cancelledBy || "admin",
        timestamp: new Date(),
      });
    }

    // Broadcast to order room
    io.to(orderId).emit("order-cancelled", {
      orderId,
      reason,
      cancelledBy: cancelledBy || "admin",
      timestamp: new Date(),
    });

    // Global broadcast
    io.emit("order-cancelled-broadcast", {
      orderId,
      reason,
      cancelledBy: cancelledBy || "admin",
      timestamp: new Date(),
    });

    console.log(`✅ Order ${orderId} cancelled`);
  });

  // ==========================================================
  // 3. RIDER EVENTS
  // ==========================================================

  // Rider join
  socket.on("rider-join", (riderId) => {
    if (riderId) {
      socket.join(`rider-${riderId}`);
      console.log(`🏍️ Rider ${riderId} joined room`);
    }
  });

  // Rider update delivery status
  socket.on("rider-delivery-update", (data) => {
    const { orderId, status, message, riderId, userId, order, tracking } = data;

    console.log(`📡 Rider delivery update: ${orderId} -> ${status}`);

    // Emit to admin room
    io.to("admin").emit("delivery_status_updated", {
      orderId,
      status,
      newStatus: status,
      message,
      riderId,
      order,
      tracking,
      timestamp: new Date(),
    });

    // Emit to specific admin
    io.to(`admin-${riderId}`).emit("delivery_status_updated", {
      orderId,
      status,
      newStatus: status,
      message,
      riderId,
      order,
      tracking,
      timestamp: new Date(),
    });

    // Emit to rider
    io.to(`rider-${riderId}`).emit("delivery_status_confirmed", {
      orderId,
      status,
      newStatus: status,
      message: `Delivery status updated to ${status}`,
      tracking,
      timestamp: new Date(),
    });

    // Emit to user
    if (userId) {
      io.to(`user-${userId}`).emit("delivery_status_updated", {
        orderId,
        status,
        newStatus: status,
        message: message || `Your order is ${status}`,
        tracking,
        timestamp: new Date(),
      });
    }

    // Emit to order room
    io.to(orderId).emit("delivery-status-updated", {
      orderId,
      status,
      newStatus: status,
      message,
      riderId,
      order,
      tracking,
      timestamp: new Date(),
    });

    // Global broadcast
    io.emit("order-status-updated", {
      orderId,
      newStatus: status,
      status: status,
      tracking,
      timestamp: new Date(),
      updatedBy: "rider",
    });

    io.emit("delivery-update-broadcast", {
      orderId,
      status,
      newStatus: status,
      message,
      riderId,
      timestamp: new Date(),
    });

    console.log(`✅ Rider ${riderId} updated order ${orderId} to ${status}`);
  });

  // Rider confirm delivery
  socket.on("rider-delivery-confirm", (data) => {
    const { orderId, riderId, deliveryTime, order, userId } = data;

    console.log(`📦 Delivery confirmed: ${orderId}`);

    io.to("admin").emit("order-delivered-admin", {
      orderId,
      riderId,
      deliveryTime,
      order,
      timestamp: new Date(),
    });

    io.to(`rider-${riderId}`).emit("delivery-confirmed", {
      orderId,
      deliveryTime,
      message: "Delivery confirmed successfully!",
      timestamp: new Date(),
    });

    if (userId) {
      io.to(`user-${userId}`).emit("order-delivered-user", {
        orderId,
        riderId,
        deliveryTime,
        message: "Your order has been delivered successfully! 🎉",
        timestamp: new Date(),
      });
    }

    io.to(orderId).emit("order-delivered", {
      orderId,
      riderId,
      deliveryTime,
      order,
      timestamp: new Date(),
    });

    io.emit("order-status-updated", {
      orderId,
      newStatus: "delivered",
      status: "delivered",
      tracking: order?.tracking || [],
      timestamp: new Date(),
      updatedBy: "rider",
    });

    console.log(`✅ Order ${orderId} delivered by rider ${riderId}`);
  });

  // Rider order pickup
  socket.on("rider-order-pickup", (data) => {
    const { orderId, riderId, pickupTime, userId } = data;

    console.log(`📦 Order pickup: ${orderId}`);

    io.to("admin").emit("order-picked-up-admin", {
      orderId,
      riderId,
      pickupTime,
      timestamp: new Date(),
    });

    io.to(`rider-${riderId}`).emit("pickup-confirmed", {
      orderId,
      pickupTime,
      message: "Order picked up successfully!",
      timestamp: new Date(),
    });

    if (userId) {
      io.to(`user-${userId}`).emit("order-picked-up-user", {
        orderId,
        riderId,
        pickupTime,
        message: "Your order has been picked up by the rider 🚚",
        timestamp: new Date(),
      });
    }

    io.to(orderId).emit("order-picked-up", {
      orderId,
      riderId,
      pickupTime,
      timestamp: new Date(),
    });

    io.emit("order-status-updated", {
      orderId,
      newStatus: "out_for_delivery",
      status: "out_for_delivery",
      timestamp: new Date(),
      updatedBy: "rider",
    });

    console.log(`✅ Order ${orderId} picked up by rider ${riderId}`);
  });

  // Rider location update
  socket.on("rider-location-update", async (data) => {
    const { riderId, orderId, latitude, longitude } = data;

    console.log(`📍 Rider location update: ${riderId}`);

    try {
      const User = require("./models/User");
      await User.findByIdAndUpdate(riderId, {
        "currentLocation.latitude": latitude,
        "currentLocation.longitude": longitude,
        "currentLocation.updatedAt": new Date(),
      });

      io.to("admin").emit("rider-location-updated", {
        riderId,
        orderId,
        latitude,
        longitude,
        timestamp: new Date(),
      });

      if (orderId) {
        io.to(`order-${orderId}`).emit("rider-location", {
          riderId,
          orderId,
          latitude,
          longitude,
          timestamp: new Date(),
        });
      }

      io.to(`rider-location-${riderId}`).emit("location-update-confirmed", {
        riderId,
        latitude,
        longitude,
        timestamp: new Date(),
      });

      console.log(`✅ Rider ${riderId} location updated`);
    } catch (error) {
      console.error("Error updating rider location:", error);
    }
  });

  // Rider availability toggle
  socket.on("rider-availability-toggle", (data) => {
    const { riderId, isAvailable } = data;

    console.log(`🔄 Rider availability: ${riderId} -> ${isAvailable}`);

    io.to("admin").emit("rider-availability-changed", {
      riderId,
      isAvailable,
      timestamp: new Date(),
    });

    io.to(`rider-${riderId}`).emit("availability-updated", {
      isAvailable,
      message: `You are now ${isAvailable ? 'available' : 'unavailable'} for deliveries`,
      timestamp: new Date(),
    });

    console.log(`✅ Rider ${riderId} availability: ${isAvailable}`);
  });

  // ==========================================================
  // 4. RIDER ASSIGNMENT EVENTS
  // ==========================================================

  // Assign rider to order
  socket.on("assign-rider", (data) => {
    const { orderId, riderId, rider, assignedBy, order, userId } = data;

    console.log(`🚚 Assigning rider ${riderId} to order ${orderId}`);

    // Emit to admin
    io.to("admin").emit("rider-assigned", {
      orderId,
      riderId,
      rider,
      assignedBy,
      order,
      timestamp: new Date(),
    });

    // Emit to specific admin
    if (assignedBy) {
      io.to(`admin-${assignedBy}`).emit("rider-assigned", {
        orderId,
        riderId,
        rider,
        assignedBy,
        order,
        timestamp: new Date(),
      });
    }

    // Emit to rider
    io.to(`rider-${riderId}`).emit("new_order_assigned", {
      orderId,
      order,
      rider,
      assignedBy,
      message: "New order assigned to you",
      timestamp: new Date(),
    });

    // Emit to user
    if (userId) {
      io.to(`user-${userId}`).emit("order_rider_assigned", {
        orderId,
        rider: {
          name: rider.name,
          mobile: rider.mobile,
        },
        timestamp: new Date(),
      });
    }

    // Emit to order room
    io.to(orderId).emit("rider-assigned", {
      orderId,
      riderId,
      rider,
      assignedBy,
      order,
      timestamp: new Date(),
    });

    // Global broadcast
    io.emit("rider-assigned-broadcast", {
      orderId,
      riderId,
      rider,
      assignedBy,
      timestamp: new Date(),
    });

    io.emit("order-status-updated", {
      orderId,
      newStatus: "assigned_to_rider",
      status: "assigned_to_rider",
      timestamp: new Date(),
      updatedBy: "admin",
    });

    console.log(`✅ Rider ${riderId} (${rider.name}) assigned to order ${orderId}`);
  });

  // Unassign rider from order
  socket.on("unassign-rider", (data) => {
    const { orderId, riderId, unassignedBy, reason, userId } = data;

    console.log(`🚫 Unassigning rider ${riderId} from order ${orderId}`);

    // Emit to admin
    io.to("admin").emit("rider-unassigned", {
      orderId,
      riderId,
      unassignedBy,
      reason,
      timestamp: new Date(),
    });

    // Emit to specific admin
    if (unassignedBy) {
      io.to(`admin-${unassignedBy}`).emit("rider-unassigned", {
        orderId,
        riderId,
        unassignedBy,
        reason,
        timestamp: new Date(),
      });
    }

    // Emit to rider
    if (riderId) {
      io.to(`rider-${riderId}`).emit("order_unassigned", {
        orderId,
        reason: reason || "Order has been unassigned from you",
        unassignedBy,
        timestamp: new Date(),
      });
    }

    // Emit to user
    if (userId) {
      io.to(`user-${userId}`).emit("order_rider_unassigned", {
        orderId,
        message: "Your rider has been unassigned. A new rider will be assigned soon.",
        timestamp: new Date(),
      });
    }

    // Emit to order room
    io.to(orderId).emit("rider-unassigned", {
      orderId,
      riderId,
      unassignedBy,
      reason,
      timestamp: new Date(),
    });

    // Global broadcast
    io.emit("rider-unassigned-broadcast", {
      orderId,
      riderId,
      unassignedBy,
      timestamp: new Date(),
    });

    console.log(`✅ Rider ${riderId} unassigned from order ${orderId}`);
  });

  // ==========================================================
  // 5. ORDER EVENTS
  // ==========================================================

  // New order placed
  socket.on("new-order", (data) => {
    const { order, userId } = data;

    console.log(`🆕 New order placed: ${order._id}`);

    // Emit to admin
    io.to("admin").emit("new-order-placed", {
      order,
      timestamp: new Date(),
    });

    // Emit to user
    if (userId) {
      io.to(`user-${userId}`).emit("order-placed", {
        order,
        message: "Your order has been placed successfully!",
        timestamp: new Date(),
      });
    }

    // Global broadcast
    io.emit("new-order-broadcast", {
      order,
      timestamp: new Date(),
    });

    console.log(`✅ New order ${order._id} broadcasted`);
  });

  // Order status update (general)
  socket.on("order-update", (data) => {
    const { orderId, updates, userId, riderId } = data;

    console.log(`📡 Order update: ${orderId}`);

    if (userId) {
      io.to(`user-${userId}`).emit("order-updated", {
        orderId,
        updates,
        timestamp: new Date(),
      });
    }

    if (riderId) {
      io.to(`rider-${riderId}`).emit("order-updated", {
        orderId,
        updates,
        timestamp: new Date(),
      });
    }

    io.to("admin").emit("order-updated", {
      orderId,
      updates,
      timestamp: new Date(),
    });

    io.to(orderId).emit("order-updated", {
      orderId,
      updates,
      timestamp: new Date(),
    });

    console.log(`✅ Order ${orderId} updated`);
  });

  // ==========================================================
  // 6. MESSAGE EVENTS
  // ==========================================================

  // Rider to user message
  socket.on("rider-message", (data) => {
    const { orderId, message, riderId, userId, sender } = data;

    console.log(`💬 Message from rider ${riderId} to user ${userId}`);

    if (userId) {
      io.to(`user-${userId}`).emit("rider-message", {
        orderId,
        message,
        riderId,
        sender: sender || "Rider",
        timestamp: new Date(),
      });
    }

    io.to(`rider-${riderId}`).emit("message-sent", {
      orderId,
      message,
      timestamp: new Date(),
    });

    io.to("admin").emit("rider-user-message", {
      orderId,
      message,
      riderId,
      userId,
      timestamp: new Date(),
    });

    console.log(`✅ Message sent from rider ${riderId} to user ${userId}`);
  });

  // User to rider message
  socket.on("user-message", (data) => {
    const { orderId, message, userId, riderId, sender } = data;

    console.log(`💬 Message from user ${userId} to rider ${riderId}`);

    if (riderId) {
      io.to(`rider-${riderId}`).emit("user-message", {
        orderId,
        message,
        userId,
        sender: sender || "Customer",
        timestamp: new Date(),
      });
    }

    io.to(`user-${userId}`).emit("message-sent", {
      orderId,
      message,
      timestamp: new Date(),
    });

    io.to("admin").emit("user-rider-message", {
      orderId,
      message,
      userId,
      riderId,
      timestamp: new Date(),
    });

    console.log(`✅ Message sent from user ${userId} to rider ${riderId}`);
  });

  // ==========================================================
  // 7. DISCONNECT
  // ==========================================================

  socket.on("disconnect", () => {
    console.log("🔴 User Disconnected:", socket.id);
  });

  socket.on("error", (error) => {
    console.error("❌ Socket Error:", error);
  });
});

// ============================================================
// MIDDLEWARE & ROUTES
// ============================================================

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/coffee", coffeeRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/category", categoryRoute);
app.use("/api/updatedelivery", updatedeliveryRoute);
app.use("/api/tables", tableRoutes);
app.use("/api/rider-assignment", riderAssignmentRoutes);

// Database Connection
connectDB();

// ============================================================
// START SERVER
// ============================================================

server.listen(Port, () => {
  console.log(`🚀 Server running on port ${Port}`);
  console.log(`📍 Socket.IO ready for connections`);
  console.log(`📡 Admin panel available at http://localhost:${Port}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});

module.exports = { app, server, io };