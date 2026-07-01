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

  // Handle order status update
  socket.on("order-status-update", (data) => {
    const { orderId, newStatus, tracking } = data;
    // Broadcast to all users in the order room
    io.to(orderId).emit("order-status-updated", {
      orderId,
      newStatus,
      tracking,
      timestamp: new Date()
    });
    console.log(`Order ${orderId} status updated to ${newStatus}`);
  });

  // Handle order cancellation
  socket.on("cancel-order", (data) => {
    const { orderId, reason } = data;
    io.to(orderId).emit("order-cancelled", {
      orderId,
      reason,
      timestamp: new Date()
    });
    console.log(`Order ${orderId} cancelled. Reason: ${reason}`);
  });

  // Handle rider assignment
  socket.on("assign-rider", (data) => {
    const { orderId, riderId, rider } = data;
    io.to(orderId).emit("rider-assigned", {
      orderId,
      riderId,
      rider,
      timestamp: new Date()
    });
    console.log(`Rider ${riderId} assigned to order ${orderId}`);
  });

  // Handle kitchen notes update
  socket.on("update-kitchen-notes", (data) => {
    const { orderId, notes } = data;
    io.to(orderId).emit("kitchen-notes-updated", {
      orderId,
      notes,
      timestamp: new Date()
    });
    console.log(`Kitchen notes updated for order ${orderId}`);
  });

  // Handle rider messaging
  socket.on("message-rider", (data) => {
    const { orderId, riderId, message } = data;
    // You can emit to specific rider's room if they have one
    io.to(`rider-${riderId}`).emit("new-message", {
      orderId,
      message,
      timestamp: new Date()
    });
    console.log(`Message sent to rider ${riderId}: ${message}`);
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