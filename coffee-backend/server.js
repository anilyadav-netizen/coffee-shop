require("dotenv").config();
const express = require("express");
const dns = require("dns");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

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

// Create HTTP Server
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  },
});

// Make io available everywhere
app.set("io", io);

// Socket Connection
// server.js or socket.js
// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

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

  // Handle order status update - FIXED to emit to both order room and user room
  socket.on("order-status-update", (data) => {
    const { orderId, newStatus, tracking, updatedBy } = data;
    
    // Broadcast to all users in the order room
    io.to(orderId).emit("order-status-updated", {
      orderId,
      newStatus,
      tracking,
      timestamp: new Date(),
      updatedBy
    });
    
    // Also emit to all user rooms that might be listening for this order
    // This ensures the user gets the update even if they're not in the specific order room
    io.emit("order-update-broadcast", {
      orderId,
      newStatus,
      tracking,
      timestamp: new Date(),
      updatedBy
    });
    
    console.log(`Order ${orderId} status updated to ${newStatus} by ${updatedBy || 'admin'}`);
  });

  // Handle order cancellation - FIXED
  socket.on("cancel-order", (data) => {
    const { orderId, reason, cancelledBy } = data;
    
    io.to(orderId).emit("order-cancelled", {
      orderId,
      reason,
      cancelledBy,
      timestamp: new Date()
    });
    
    // Broadcast cancellation to all users
    io.emit("order-cancelled-broadcast", {
      orderId,
      reason,
      cancelledBy,
      timestamp: new Date()
    });
    
    console.log(`Order ${orderId} cancelled by ${cancelledBy || 'admin'}. Reason: ${reason}`);
  });

  // Handle rider assignment - FIXED
  socket.on("assign-rider", (data) => {
    const { orderId, riderId, rider, assignedBy } = data;
    
    io.to(orderId).emit("rider-assigned", {
      orderId,
      riderId,
      rider,
      assignedBy,
      timestamp: new Date()
    });
    
    // Broadcast rider assignment to all users
    io.emit("rider-assigned-broadcast", {
      orderId,
      riderId,
      rider,
      assignedBy,
      timestamp: new Date()
    });
    
    console.log(`Rider ${riderId} assigned to order ${orderId} by ${assignedBy || 'admin'}`);
  });

  // Handle kitchen notes update - FIXED
  socket.on("update-kitchen-notes", (data) => {
    const { orderId, notes, updatedBy } = data;
    
    io.to(orderId).emit("kitchen-notes-updated", {
      orderId,
      notes,
      updatedBy,
      timestamp: new Date()
    });
    
    // Broadcast notes update to all users
    io.emit("kitchen-notes-updated-broadcast", {
      orderId,
      notes,
      updatedBy,
      timestamp: new Date()
    });
    
    console.log(`Kitchen notes updated for order ${orderId} by ${updatedBy || 'admin'}`);
  });

  // Handle rider messaging - FIXED
  socket.on("message-rider", (data) => {
    const { orderId, riderId, message, sender } = data;
    
    // Emit to specific rider's room if they have one
    if (riderId) {
      io.to(`rider-${riderId}`).emit("new-message", {
        orderId,
        message,
        sender,
        timestamp: new Date()
      });
    }
    
    // Also emit to the order room so everyone following the order gets the message
    io.to(orderId).emit("rider-message", {
      orderId,
      message,
      sender,
      timestamp: new Date()
    });
    
    console.log(`Message sent to rider ${riderId}: ${message} by ${sender || 'admin'}`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// Middleware
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/coffee", coffeeRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/category", categoryRoute);
app.use("/api/updatedelivery", updatedeliveryRoute);

// DB
connectDB();

// Listen
server.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});