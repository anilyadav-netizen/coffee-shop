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
const riderAssignmentRoutes = require("./routes/riderAssignmentRoutes"); // Import rider routes

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

// Socket Connection
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // ============= EXISTING EVENTS =============
  
  // Join order room
  socket.on("join-order", (orderId) => {
    socket.join(orderId);
    console.log(`Joined Room: ${orderId}`);
  });

  // Join user room
  socket.on("join-user", (userId) => {
    socket.join(`user-${userId}`);
    console.log(`Joined User Room: user-${userId}`);
  });

  // Join rider room
  socket.on("join-rider", (riderId) => {
    socket.join(`rider-${riderId}`);
    console.log(`Joined Rider Room: rider-${riderId}`);
  });

  // Join admin room
  socket.on("join-admin", (adminId) => {
    socket.join(`admin-${adminId}`);
    console.log(`Joined Admin Room: admin-${adminId}`);
  });

  // Handle order status update
  socket.on("order-status-update", (data) => {
    const { orderId, newStatus, tracking, updatedBy } = data;

    // Broadcast to all users in the order room
    io.to(orderId).emit("order-status-updated", {
      orderId,
      newStatus,
      tracking,
      timestamp: new Date(),
      updatedBy,
    });

    // Also emit to all user rooms that might be listening for this order
    io.emit("order-update-broadcast", {
      orderId,
      newStatus,
      tracking,
      timestamp: new Date(),
      updatedBy,
    });

    console.log(
      `Order ${orderId} status updated to ${newStatus} by ${updatedBy || "admin"}`
    );
  });

  // Handle order cancellation
  socket.on("cancel-order", (data) => {
    const { orderId, reason, cancelledBy } = data;

    io.to(orderId).emit("order-cancelled", {
      orderId,
      reason,
      cancelledBy,
      timestamp: new Date(),
    });

    io.emit("order-cancelled-broadcast", {
      orderId,
      reason,
      cancelledBy,
      timestamp: new Date(),
    });

    console.log(
      `Order ${orderId} cancelled by ${cancelledBy || "admin"}. Reason: ${reason}`
    );
  });

  // ============= NEW RIDER ASSIGNMENT EVENTS =============
  
  // Handle rider assignment to order
  socket.on("assign-rider", (data) => {
    const { orderId, riderId, rider, assignedBy, order } = data;

    // Emit to the order room
    io.to(orderId).emit("rider-assigned", {
      orderId,
      riderId,
      rider,
      assignedBy,
      order,
      timestamp: new Date(),
    });

    // Emit to the specific rider
    if (riderId) {
      io.to(`rider-${riderId}`).emit("new-order-assigned", {
        orderId,
        order,
        rider,
        assignedBy,
        message: "New order assigned to you",
        timestamp: new Date(),
      });
    }

    // Emit to admin room
    io.to(`admin-${assignedBy}`).emit("rider-assigned-confirmation", {
      orderId,
      riderId,
      rider,
      order,
      message: `Rider ${rider.name} assigned to order #${orderId}`,
      timestamp: new Date(),
    });

    // Broadcast to all users
    io.emit("rider-assigned-broadcast", {
      orderId,
      riderId,
      rider,
      assignedBy,
      timestamp: new Date(),
    });

    console.log(
      `Rider ${riderId} (${rider.name}) assigned to order ${orderId} by ${assignedBy || "admin"}`
    );
  });

  // Handle rider unassignment
  socket.on("unassign-rider", (data) => {
    const { orderId, riderId, unassignedBy, reason } = data;

    // Emit to the order room
    io.to(orderId).emit("rider-unassigned", {
      orderId,
      riderId,
      unassignedBy,
      reason,
      timestamp: new Date(),
    });

    // Emit to the rider
    if (riderId) {
      io.to(`rider-${riderId}`).emit("order-unassigned", {
        orderId,
        reason,
        unassignedBy,
        message: "Order has been unassigned from you",
        timestamp: new Date(),
      });
    }

    // Emit to admin
    io.to(`admin-${unassignedBy}`).emit("rider-unassigned-confirmation", {
      orderId,
      riderId,
      message: `Rider unassigned from order #${orderId}`,
      timestamp: new Date(),
    });

    console.log(
      `Rider ${riderId} unassigned from order ${orderId} by ${unassignedBy || "admin"}`
    );
  });

  // Handle delivery status update by rider
  socket.on("rider-delivery-update", (data) => {
    const { orderId, status, message, riderId, order } = data;

    // Emit to order room
    io.to(orderId).emit("delivery-status-updated", {
      orderId,
      status,
      message,
      riderId,
      order,
      timestamp: new Date(),
    });

    // Emit to admin room
    io.to("admin").emit("rider-delivery-update-admin", {
      orderId,
      status,
      message,
      riderId,
      order,
      timestamp: new Date(),
    });

    // Emit to user
    io.to(`user-${order.user}`).emit("delivery-status-updated-user", {
      orderId,
      status,
      message,
      riderId,
      timestamp: new Date(),
    });

    // Broadcast to all
    io.emit("delivery-update-broadcast", {
      orderId,
      status,
      message,
      riderId,
      timestamp: new Date(),
    });

    console.log(
      `Rider ${riderId} updated order ${orderId} to status: ${status}`
    );
  });

  // Handle rider location update
  socket.on("rider-location-update", async (data) => {
    const { riderId, orderId, latitude, longitude } = data;

    try {
      // You can save to database here if needed
      const User = require("./models/User");
      await User.findByIdAndUpdate(riderId, {
        "currentLocation.latitude": latitude,
        "currentLocation.longitude": longitude,
        "currentLocation.updatedAt": new Date(),
      });

      // Emit to admin
      io.to("admin").emit("rider-location-updated", {
        riderId,
        orderId,
        latitude,
        longitude,
        timestamp: new Date(),
      });

      // Emit to user if orderId is provided
      if (orderId) {
        io.to(`order-${orderId}`).emit("rider-location", {
          riderId,
          orderId,
          latitude,
          longitude,
          timestamp: new Date(),
        });
      }

      // Emit to specific rider's location room
      io.to(`rider-location-${riderId}`).emit("location-update-confirmed", {
        riderId,
        latitude,
        longitude,
        timestamp: new Date(),
      });

      console.log(
        `Rider ${riderId} location updated: ${latitude}, ${longitude}`
      );
    } catch (error) {
      console.error("Error updating rider location:", error);
    }
  });

  // Handle rider availability toggle
  socket.on("rider-availability-toggle", (data) => {
    const { riderId, isAvailable } = data;

    // Broadcast to admin
    io.to("admin").emit("rider-availability-changed", {
      riderId,
      isAvailable,
      timestamp: new Date(),
    });

    console.log(`Rider ${riderId} availability: ${isAvailable}`);
  });

  // Handle order pickup by rider
  socket.on("rider-order-pickup", (data) => {
    const { orderId, riderId, pickupTime } = data;

    io.to(orderId).emit("order-picked-up", {
      orderId,
      riderId,
      pickupTime,
      timestamp: new Date(),
    });

    io.to(`user-${data.userId}`).emit("order-picked-up-user", {
      orderId,
      riderId,
      pickupTime,
      message: "Your order has been picked up by the rider",
      timestamp: new Date(),
    });

    io.to("admin").emit("order-picked-up-admin", {
      orderId,
      riderId,
      pickupTime,
      timestamp: new Date(),
    });

    console.log(`Order ${orderId} picked up by rider ${riderId}`);
  });

  // Handle delivery confirmation
  socket.on("rider-delivery-confirm", (data) => {
    const { orderId, riderId, deliveryTime, order } = data;

    io.to(orderId).emit("order-delivered", {
      orderId,
      riderId,
      deliveryTime,
      order,
      timestamp: new Date(),
    });

    io.to(`user-${order.user}`).emit("order-delivered-user", {
      orderId,
      riderId,
      deliveryTime,
      message: "Your order has been delivered successfully!",
      timestamp: new Date(),
    });

    io.to("admin").emit("order-delivered-admin", {
      orderId,
      riderId,
      deliveryTime,
      order,
      timestamp: new Date(),
    });

    console.log(`Order ${orderId} delivered by rider ${riderId}`);
  });

  // ============= HANDLE DISCONNECT =============
  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// Middleware

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/coffee", coffeeRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/category", categoryRoute);
app.use("/api/updatedelivery", updatedeliveryRoute);
app.use("/api/tables", tableRoutes);
app.use("/api/rider-assignment", riderAssignmentRoutes); // Add rider routes

// DB
connectDB();

// Listen
server.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});