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