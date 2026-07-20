require("dotenv").config();
const express = require("express");
const dns = require("dns");
const cors = require("cors");
const http = require("http");
const cookies = require("cookie-parser");
const { Server } = require("socket.io");
const path = require("path");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


// ============================================================
// ENVIRONMENT VALIDATION
// ============================================================
const requiredEnvVars = ['PORT', 'MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// ============================================================
// CONSTANTS & CONFIGURATION
// ============================================================
const EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  
  // Room Events
  JOIN_ORDER: 'join-order',
  JOIN_USER: 'join-user',
  JOIN_RIDER: 'join-rider',
  JOIN_ADMIN: 'join-admin',
  JOIN_RIDER_LOCATION: 'join-rider-location',
  
  // Admin Events
  ADMIN_JOIN: 'admin-join',
  ORDER_STATUS_UPDATE: 'order-status-update',
  CANCEL_ORDER: 'cancel-order',
  ASSIGN_RIDER: 'assign-rider',
  UNASSIGN_RIDER: 'unassign-rider',
  
  // Rider Events
  RIDER_JOIN: 'rider-join',
  RIDER_DELIVERY_UPDATE: 'rider-delivery-update',
  RIDER_DELIVERY_CONFIRM: 'rider-delivery-confirm',
  RIDER_ORDER_PICKUP: 'rider-order-pickup',
  RIDER_LOCATION_UPDATE: 'rider-location-update',
  RIDER_AVAILABILITY_TOGGLE: 'rider-availability-toggle',
  
  // Order Events
  NEW_ORDER: 'new-order',
  ORDER_UPDATE: 'order-update',
  
  // Message Events
  RIDER_MESSAGE: 'rider-message',
  USER_MESSAGE: 'user-message',
  
  // System Events
  PING: 'ping',
  PONG: 'pong',
  RATE_LIMITED: 'rate-limited'
};

// ============================================================
// LOGGER
// ============================================================
const logger = {
  info: (message, data = null) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      data,
      timestamp: new Date().toISOString()
    }));
  },
  error: (message, error = null) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error ? error.message : null,
      stack: error ? error.stack : null,
      timestamp: new Date().toISOString()
    }));
  },
  socket: (event, data = null) => {
    console.log(JSON.stringify({
      level: 'socket',
      event,
      data,
      timestamp: new Date().toISOString()
    }));
  },
  warn: (message, data = null) => {
    console.warn(JSON.stringify({
      level: 'warn',
      message,
      data,
      timestamp: new Date().toISOString()
    }));
  }
};

// ============================================================
// EXPRESS APP SETUP
// ============================================================
const app = express();
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Cookie Parser
app.use(cookies());

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://yourdomain.com'
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));

// Body Parser
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

// ============================================================
// DATABASE CONNECTION
// ============================================================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Use IPv4, skip trying IPv6
    });
    logger.info('✅ MongoDB connected successfully');
  } catch (error) {
    logger.error('❌ MongoDB connection error:', error);
    setTimeout(connectDB, 5000);
  }
};

// ============================================================
// CREATE HTTP SERVER
// ============================================================
const server = http.createServer(app);

// ============================================================
// SOCKET.IO SETUP
// ============================================================
const io = new Server(server, {
  cors: corsOptions,
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

// Make io available everywhere
app.set("io", io);

// ============================================================
// RATE LIMITING FOR SOCKET EVENTS
// ============================================================
const rateLimiter = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_EVENTS_PER_WINDOW = 60;

const checkRateLimit = (socketId) => {
  const now = Date.now();
  if (!rateLimiter.has(socketId)) {
    rateLimiter.set(socketId, [now]);
    return true;
  }
  
  const timestamps = rateLimiter.get(socketId)
    .filter(t => now - t < RATE_LIMIT_WINDOW);
  
  if (timestamps.length >= MAX_EVENTS_PER_WINDOW) {
    return false;
  }
  
  timestamps.push(now);
  rateLimiter.set(socketId, timestamps);
  return true;
};

// Clean up rate limiter every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [socketId, timestamps] of rateLimiter.entries()) {
    const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
    if (validTimestamps.length === 0) {
      rateLimiter.delete(socketId);
    } else {
      rateLimiter.set(socketId, validTimestamps);
    }
  }
}, 300000);

// ============================================================
// SOCKET.IO AUTHENTICATION MIDDLEWARE
// ============================================================
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      logger.warn('Socket connection attempt without token', { socketId: socket.id });
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    socket.userRole = decoded.role || 'user';
    socket.userEmail = decoded.email;
    
    logger.info('Socket authenticated', { 
      socketId: socket.id, 
      userId: socket.userId, 
      role: socket.userRole 
    });
    
    next();
  } catch (err) {
    logger.error('Socket authentication failed', err);
    next(new Error("Invalid token"));
  }
});

// ============================================================
// SOCKET CONNECTION HANDLER
// ============================================================
io.on(EVENTS.CONNECTION, (socket) => {
  logger.socket(EVENTS.CONNECTION, { 
    socketId: socket.id, 
    userId: socket.userId,
    role: socket.userRole 
  });

  // ==========================================================
  // CONNECTION HEALTH
  // ==========================================================
  socket.on(EVENTS.PING, () => {
    socket.emit(EVENTS.PONG);
  });

  // ==========================================================
  // HELPER FUNCTIONS
  // ==========================================================
  const emitToAll = (event, data, rooms = []) => {
    // Emit to specific rooms
    rooms.forEach(room => {
      io.to(room).emit(event, data);
    });
    
    // Emit to general admin room if applicable
    if (rooms.includes('admin') || rooms.some(r => r.startsWith('admin-'))) {
      io.to('admin').emit(event, data);
    }
    
    // Global broadcast
    io.emit(`${event}-broadcast`, data);
  };

  const emitToUser = (userId, event, data) => {
    if (userId) {
      io.to(`user-${userId}`).emit(event, data);
    }
  };

  const emitToRider = (riderId, event, data) => {
    if (riderId) {
      io.to(`rider-${riderId}`).emit(event, data);
    }
  };

  const emitToAdmin = (adminId, event, data) => {
    if (adminId) {
      io.to(`admin-${adminId}`).emit(event, data);
    }
    io.to('admin').emit(event, data);
  };

  const emitToOrder = (orderId, event, data) => {
    if (orderId) {
      io.to(orderId).emit(event, data);
    }
  };

  // ==========================================================
  // 1. JOIN ROOMS
  // ==========================================================
  socket.on(EVENTS.JOIN_ORDER, (orderId) => {
    if (!orderId) return;
    socket.join(orderId);
    logger.socket(EVENTS.JOIN_ORDER, { socketId: socket.id, orderId });
  });

  socket.on(EVENTS.JOIN_USER, (userId) => {
    if (!userId) return;
    socket.join(`user-${userId}`);
    logger.socket(EVENTS.JOIN_USER, { socketId: socket.id, userId });
  });

  socket.on(EVENTS.JOIN_RIDER, (riderId) => {
    if (!riderId) return;
    socket.join(`rider-${riderId}`);
    logger.socket(EVENTS.JOIN_RIDER, { socketId: socket.id, riderId });
  });

  socket.on(EVENTS.JOIN_ADMIN, (adminId) => {
    if (adminId) {
      socket.join(`admin-${adminId}`);
      logger.socket(EVENTS.JOIN_ADMIN, { socketId: socket.id, adminId });
    }
    socket.join("admin");
    logger.socket(EVENTS.JOIN_ADMIN, { socketId: socket.id, room: 'admin' });
  });

  socket.on(EVENTS.JOIN_RIDER_LOCATION, (riderId) => {
    if (!riderId) return;
    socket.join(`rider-location-${riderId}`);
    logger.socket(EVENTS.JOIN_RIDER_LOCATION, { socketId: socket.id, riderId });
  });

  // ==========================================================
  // 2. ADMIN EVENTS
  // ==========================================================
  socket.on(EVENTS.ADMIN_JOIN, (adminId) => {
    if (!checkRateLimit(socket.id)) {
      socket.emit(EVENTS.RATE_LIMITED, { message: 'Too many requests' });
      return;
    }
    
    if (adminId) {
      socket.join(`admin-${adminId}`);
      logger.socket(EVENTS.ADMIN_JOIN, { socketId: socket.id, adminId });
    }
    socket.join("admin");
    logger.socket(EVENTS.ADMIN_JOIN, { socketId: socket.id, room: 'admin' });
  });

  socket.on(EVENTS.ORDER_STATUS_UPDATE, (data) => {
    if (!checkRateLimit(socket.id)) {
      socket.emit(EVENTS.RATE_LIMITED, { message: 'Too many requests' });
      return;
    }

    const { orderId, newStatus, tracking, updatedBy, riderId, userId } = data;
    
    if (!orderId || !newStatus) {
      socket.emit(EVENTS.ERROR, { message: 'Order ID and status are required' });
      return;
    }

    logger.socket(EVENTS.ORDER_STATUS_UPDATE, { orderId, newStatus, updatedBy });

    const eventData = {
      orderId,
      newStatus,
      status: newStatus,
      tracking: tracking || [],
      timestamp: new Date().toISOString(),
      updatedBy: updatedBy || 'admin'
    };

    // Broadcast to all relevant rooms
    emitToAdmin(updatedBy, 'order-status-updated', eventData);
    emitToRider(riderId, 'order-status-updated', eventData);
    emitToUser(userId, 'order-status-updated', eventData);
    emitToOrder(orderId, 'order-status-updated', eventData);
    io.emit('order-update-broadcast', eventData);

    logger.info(`✅ Order ${orderId} status updated to ${newStatus}`);
  });

  socket.on(EVENTS.CANCEL_ORDER, (data) => {
    if (!checkRateLimit(socket.id)) {
      socket.emit(EVENTS.RATE_LIMITED, { message: 'Too many requests' });
      return;
    }

    const { orderId, reason, cancelledBy, riderId, userId } = data;
    
    if (!orderId) {
      socket.emit(EVENTS.ERROR, { message: 'Order ID is required' });
      return;
    }

    logger.socket(EVENTS.CANCEL_ORDER, { orderId, reason, cancelledBy });

    const eventData = {
      orderId,
      reason: reason || 'Order cancelled by admin',
      cancelledBy: cancelledBy || 'admin',
      timestamp: new Date().toISOString()
    };

    emitToAdmin(cancelledBy, 'order-cancelled', eventData);
    emitToRider(riderId, 'order-cancelled', eventData);
    emitToUser(userId, 'order-cancelled', eventData);
    emitToOrder(orderId, 'order-cancelled', eventData);
    io.emit('order-cancelled-broadcast', eventData);

    logger.info(`✅ Order ${orderId} cancelled`);
  });

  // ==========================================================
  // 3. RIDER EVENTS
  // ==========================================================
  socket.on(EVENTS.RIDER_JOIN, (riderId) => {
    if (!riderId) return;
    socket.join(`rider-${riderId}`);
    logger.socket(EVENTS.RIDER_JOIN, { socketId: socket.id, riderId });
  });

  socket.on(EVENTS.RIDER_DELIVERY_UPDATE, async (data) => {
    if (!checkRateLimit(socket.id)) {
      socket.emit(EVENTS.RATE_LIMITED, { message: 'Too many requests' });
      return;
    }

    const { orderId, status, message, riderId, userId, order, tracking } = data;
    
    if (!orderId || !status || !riderId) {
      socket.emit(EVENTS.ERROR, { message: 'Order ID, status, and rider ID are required' });
      return;
    }

    logger.socket(EVENTS.RIDER_DELIVERY_UPDATE, { orderId, status, riderId });

    const eventData = {
      orderId,
      status,
      newStatus: status,
      message: message || `Delivery status updated to ${status}`,
      riderId,
      order,
      tracking: tracking || [],
      timestamp: new Date().toISOString()
    };

    emitToAdmin(riderId, 'delivery_status_updated', eventData);
    emitToRider(riderId, 'delivery_status_confirmed', {
      orderId,
      status,
      newStatus: status,
      message: `Delivery status updated to ${status}`,
      tracking,
      timestamp: new Date().toISOString()
    });
    emitToUser(userId, 'delivery_status_updated', {
      orderId,
      status,
      newStatus: status,
      message: message || `Your order is ${status}`,
      tracking,
      timestamp: new Date().toISOString()
    });
    emitToOrder(orderId, 'delivery-status-updated', eventData);
    
    io.emit('order-status-updated', {
      orderId,
      newStatus: status,
      status: status,
      tracking,
      timestamp: new Date().toISOString(),
      updatedBy: 'rider'
    });
    io.emit('delivery-update-broadcast', {
      orderId,
      status,
      newStatus: status,
      message,
      riderId,
      timestamp: new Date().toISOString()
    });

    logger.info(`✅ Rider ${riderId} updated order ${orderId} to ${status}`);
  });

  socket.on(EVENTS.RIDER_DELIVERY_CONFIRM, (data) => {
    if (!checkRateLimit(socket.id)) {
      socket.emit(EVENTS.RATE_LIMITED, { message: 'Too many requests' });
      return;
    }

    const { orderId, riderId, deliveryTime, order, userId } = data;
    
    if (!orderId || !riderId) {
      socket.emit(EVENTS.ERROR, { message: 'Order ID and rider ID are required' });
      return;
    }

    logger.socket(EVENTS.RIDER_DELIVERY_CONFIRM, { orderId, riderId });

    const eventData = {
      orderId,
      riderId,
      deliveryTime: deliveryTime || new Date().toISOString(),
      order,
      timestamp: new Date().toISOString()
    };

    emitToAdmin(null, 'order-delivered-admin', eventData);
    emitToRider(riderId, 'delivery-confirmed', {
      orderId,
      deliveryTime,
      message: 'Delivery confirmed successfully!',
      timestamp: new Date().toISOString()
    });
    emitToUser(userId, 'order-delivered-user', {
      orderId,
      riderId,
      deliveryTime,
      message: 'Your order has been delivered successfully! 🎉',
      timestamp: new Date().toISOString()
    });
    emitToOrder(orderId, 'order-delivered', eventData);
    
    io.emit('order-status-updated', {
      orderId,
      newStatus: 'delivered',
      status: 'delivered',
      tracking: order?.tracking || [],
      timestamp: new Date().toISOString(),
      updatedBy: 'rider'
    });

    logger.info(`✅ Order ${orderId} delivered by rider ${riderId}`);
  });

  socket.on(EVENTS.RIDER_ORDER_PICKUP, (data) => {
    if (!checkRateLimit(socket.id)) {
      socket.emit(EVENTS.RATE_LIMITED, { message: 'Too many requests' });
      return;
    }

    const { orderId, riderId, pickupTime, userId } = data;
    
    if (!orderId || !riderId) {
      socket.emit(EVENTS.ERROR, { message: 'Order ID and rider ID are required' });
      return;
    }

    logger.socket(EVENTS.RIDER_ORDER_PICKUP, { orderId, riderId });

    const eventData = {
      orderId,
      riderId,
      pickupTime: pickupTime || new Date().toISOString(),
      timestamp: new Date().toISOString()
    };

    emitToAdmin(null, 'order-picked-up-admin', eventData);
    emitToRider(riderId, 'pickup-confirmed', {
      orderId,
      pickupTime,
      message: 'Order picked up successfully!',
      timestamp: new Date().toISOString()
    });
    emitToUser(userId, 'order-picked-up-user', {
      orderId,
      riderId,
      pickupTime,
      message: 'Your order has been picked up by the rider 🚚',
      timestamp: new Date().toISOString()
    });
    emitToOrder(orderId, 'order-picked-up', eventData);
    
    io.emit('order-status-updated', {
      orderId,
      newStatus: 'out_for_delivery',
      status: 'out_for_delivery',
      timestamp: new Date().toISOString(),
      updatedBy: 'rider'
    });

    logger.info(`✅ Order ${orderId} picked up by rider ${riderId}`);
  });

  socket.on(EVENTS.RIDER_LOCATION_UPDATE, async (data) => {
    if (!checkRateLimit(socket.id)) {
      socket.emit(EVENTS.RATE_LIMITED, { message: 'Too many requests' });
      return;
    }

    const { riderId, orderId, latitude, longitude } = data;
    
    if (!riderId) {
      socket.emit(EVENTS.ERROR, { message: 'Rider ID is required' });
      return;
    }

    if (!latitude || !longitude) {
      socket.emit(EVENTS.ERROR, { message: 'Latitude and longitude are required' });
      return;
    }

    logger.socket(EVENTS.RIDER_LOCATION_UPDATE, { riderId, orderId, latitude, longitude });

    try {
      const User = require("./models/User");
      await User.findByIdAndUpdate(riderId, {
        "currentLocation.latitude": latitude,
        "currentLocation.longitude": longitude,
        "currentLocation.updatedAt": new Date()
      });

      const locationData = {
        riderId,
        orderId,
        latitude,
        longitude,
        timestamp: new Date().toISOString()
      };

      emitToAdmin(null, 'rider-location-updated', locationData);
      
      if (orderId) {
        io.to(`order-${orderId}`).emit('rider-location', locationData);
      }
      
      io.to(`rider-location-${riderId}`).emit('location-update-confirmed', {
        riderId,
        latitude,
        longitude,
        timestamp: new Date().toISOString()
      });

      logger.info(`✅ Rider ${riderId} location updated`);
    } catch (error) {
      logger.error(`Error updating rider location for ${riderId}`, error);
      socket.emit(EVENTS.ERROR, { 
        message: 'Failed to update location',
        error: error.message 
      });
    }
  });

  socket.on(EVENTS.RIDER_AVAILABILITY_TOGGLE, (data) => {
    if (!checkRateLimit(socket.id)) {
      socket.emit(EVENTS.RATE_LIMITED, { message: 'Too many requests' });
      return;
    }

    const { riderId, isAvailable } = data;
    
    if (!riderId) {
      socket.emit(EVENTS.ERROR, { message: 'Rider ID is required' });
      return;
    }

    logger.socket(EVENTS.RIDER_AVAILABILITY_TOGGLE, { riderId, isAvailable });

    const eventData = {
      riderId,
      isAvailable,
      timestamp: new Date().toISOString()
    };

    emitToAdmin(null, 'rider-availability-changed', eventData);
    emitToRider(riderId, 'availability-updated', {
      isAvailable,
      message: `You are now ${isAvailable ? 'available' : 'unavailable'} for deliveries`,
      timestamp: new Date().toISOString()
    });

    logger.info(`✅ Rider ${riderId} availability: ${isAvailable}`);
  });

  // ==========================================================
  // 4. RIDER ASSIGNMENT EVENTS
  // ==========================================================
  socket.on(EVENTS.ASSIGN_RIDER, (data) => {
    if (!checkRateLimit(socket.id)) {
      socket.emit(EVENTS.RATE_LIMITED, { message: 'Too many requests' });
      return;
    }

    const { orderId, riderId, rider, assignedBy, order, userId } = data;
    
    if (!orderId || !riderId || !rider) {
      socket.emit(EVENTS.ERROR, { message: 'Order ID, rider ID, and rider data are required' });
      return;
    }

    logger.socket(EVENTS.ASSIGN_RIDER, { orderId, riderId, assignedBy });

    const eventData = {
      orderId,
      riderId,
      rider,
      assignedBy: assignedBy || 'admin',
      order,
      timestamp: new Date().toISOString()
    };

    emitToAdmin(assignedBy, 'rider-assigned', eventData);
    emitToRider(riderId, 'new_order_assigned', {
      orderId,
      order,
      rider,
      assignedBy: assignedBy || 'admin',
      message: 'New order assigned to you',
      timestamp: new Date().toISOString()
    });
    emitToUser(userId, 'order_rider_assigned', {
      orderId,
      rider: {
        name: rider.name,
        mobile: rider.mobile
      },
      timestamp: new Date().toISOString()
    });
    emitToOrder(orderId, 'rider-assigned', eventData);
    
    io.emit('rider-assigned-broadcast', {
      orderId,
      riderId,
      rider,
      assignedBy: assignedBy || 'admin',
      timestamp: new Date().toISOString()
    });
    io.emit('order-status-updated', {
      orderId,
      newStatus: 'assigned_to_rider',
      status: 'assigned_to_rider',
      timestamp: new Date().toISOString(),
      updatedBy: 'admin'
    });

    logger.info(`✅ Rider ${riderId} (${rider.name}) assigned to order ${orderId}`);
  });

  socket.on(EVENTS.UNASSIGN_RIDER, (data) => {
    if (!checkRateLimit(socket.id)) {
      socket.emit(EVENTS.RATE_LIMITED, { message: 'Too many requests' });
      return;
    }

    const { orderId, riderId, unassignedBy, reason, userId } = data;
    
    if (!orderId || !riderId) {
      socket.emit(EVENTS.ERROR, { message: 'Order ID and rider ID are required' });
      return;
    }

    logger.socket(EVENTS.UNASSIGN_RIDER, { orderId, riderId, unassignedBy });

    const eventData = {
      orderId,
      riderId,
      unassignedBy: unassignedBy || 'admin',
      reason: reason || 'Order has been unassigned',
      timestamp: new Date().toISOString()
    };

    emitToAdmin(unassignedBy, 'rider-unassigned', eventData);
    emitToRider(riderId, 'order_unassigned', {
      orderId,
      reason: reason || 'Order has been unassigned from you',
      unassignedBy: unassignedBy || 'admin',
      timestamp: new Date().toISOString()
    });
    emitToUser(userId, 'order_rider_unassigned', {
      orderId,
      message: 'Your rider has been unassigned. A new rider will be assigned soon.',
      timestamp: new Date().toISOString()
    });
    emitToOrder(orderId, 'rider-unassigned', eventData);
    
    io.emit('rider-unassigned-broadcast', {
      orderId,
      riderId,
      unassignedBy: unassignedBy || 'admin',
      timestamp: new Date().toISOString()
    });

    logger.info(`✅ Rider ${riderId} unassigned from order ${orderId}`);
  });

  // ==========================================================
  // 5. ORDER EVENTS
  // ==========================================================
  socket.on(EVENTS.NEW_ORDER, (data) => {
    if (!checkRateLimit(socket.id)) {
      socket.emit(EVENTS.RATE_LIMITED, { message: 'Too many requests' });
      return;
    }

    const { order, userId } = data;
    
    if (!order || !order._id) {
      socket.emit(EVENTS.ERROR, { message: 'Valid order data is required' });
      return;
    }

    logger.socket(EVENTS.NEW_ORDER, { orderId: order._id, userId });

    const eventData = {
      order,
      timestamp: new Date().toISOString()
    };

    emitToAdmin(null, 'new-order-placed', eventData);
    emitToUser(userId, 'order-placed', {
      order,
      message: 'Your order has been placed successfully!',
      timestamp: new Date().toISOString()
    });
    io.emit('new-order-broadcast', eventData);

    logger.info(`✅ New order ${order._id} broadcasted`);
  });

  socket.on(EVENTS.ORDER_UPDATE, (data) => {
    if (!checkRateLimit(socket.id)) {
      socket.emit(EVENTS.RATE_LIMITED, { message: 'Too many requests' });
      return;
    }

    const { orderId, updates, userId, riderId } = data;
    
    if (!orderId || !updates) {
      socket.emit(EVENTS.ERROR, { message: 'Order ID and updates are required' });
      return;
    }

    logger.socket(EVENTS.ORDER_UPDATE, { orderId, userId, riderId });

    const eventData = {
      orderId,
      updates,
      timestamp: new Date().toISOString()
    };

    emitToUser(userId, 'order-updated', eventData);
    emitToRider(riderId, 'order-updated', eventData);
    emitToAdmin(null, 'order-updated', eventData);
    emitToOrder(orderId, 'order-updated', eventData);

    logger.info(`✅ Order ${orderId} updated`);
  });

  // ==========================================================
  // 6. MESSAGE EVENTS
  // ==========================================================
  socket.on(EVENTS.RIDER_MESSAGE, (data) => {
    if (!checkRateLimit(socket.id)) {
      socket.emit(EVENTS.RATE_LIMITED, { message: 'Too many requests' });
      return;
    }

    const { orderId, message, riderId, userId, sender } = data;
    
    if (!message || !riderId) {
      socket.emit(EVENTS.ERROR, { message: 'Message and rider ID are required' });
      return;
    }

    logger.socket(EVENTS.RIDER_MESSAGE, { orderId, riderId, userId });

    const eventData = {
      orderId,
      message,
      riderId,
      sender: sender || 'Rider',
      timestamp: new Date().toISOString()
    };

    emitToUser(userId, 'rider-message', eventData);
    emitToRider(riderId, 'message-sent', {
      orderId,
      message,
      timestamp: new Date().toISOString()
    });
    emitToAdmin(null, 'rider-user-message', {
      ...eventData,
      userId
    });

    logger.info(`✅ Message sent from rider ${riderId} to user ${userId}`);
  });

  socket.on(EVENTS.USER_MESSAGE, (data) => {
    if (!checkRateLimit(socket.id)) {
      socket.emit(EVENTS.RATE_LIMITED, { message: 'Too many requests' });
      return;
    }

    const { orderId, message, userId, riderId, sender } = data;
    
    if (!message || !userId) {
      socket.emit(EVENTS.ERROR, { message: 'Message and user ID are required' });
      return;
    }

    logger.socket(EVENTS.USER_MESSAGE, { orderId, userId, riderId });

    const eventData = {
      orderId,
      message,
      userId,
      sender: sender || 'Customer',
      timestamp: new Date().toISOString()
    };

    emitToRider(riderId, 'user-message', eventData);
    emitToUser(userId, 'message-sent', {
      orderId,
      message,
      timestamp: new Date().toISOString()
    });
    emitToAdmin(null, 'user-rider-message', {
      ...eventData,
      riderId
    });

    logger.info(`✅ Message sent from user ${userId} to rider ${riderId}`);
  });

  // ==========================================================
  // 7. DISCONNECT
  // ==========================================================
  socket.on(EVENTS.DISCONNECT, () => {
    logger.info(`🔴 User Disconnected: ${socket.id} (User: ${socket.userId})`);
    // Clean up rate limiter entry
    rateLimiter.delete(socket.id);
  });

  socket.on(EVENTS.ERROR, (error) => {
    logger.error(`❌ Socket Error for ${socket.id}:`, error);
  });
});

// ============================================================
// ROUTES
// ============================================================
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

app.use("/api/auth", authRoutes);
app.use("/api/coffee", coffeeRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/category", categoryRoute);
app.use("/api/updatedelivery", updatedeliveryRoute);
app.use("/api/tables", tableRoutes);
app.use("/api/rider-assignment", riderAssignmentRoutes);

// ============================================================
// STATIC FILES & FRONTEND
// ============================================================
const clientPath = path.join(__dirname, "../coffeeShop/dist");

// Check if frontend build exists
const fs = require('fs');
if (fs.existsSync(clientPath)) {
  app.use(express.static(clientPath));
  
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
} else {
  logger.warn('Frontend build not found at:', clientPath);
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Server is running', 
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  });
}

// ============================================================
// HEALTH CHECK
// ============================================================
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ============================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ============================================================
// DATABASE CONNECTION
// ============================================================
connectDB();

// ============================================================
// GRACEFUL SHUTDOWN
// ============================================================
const gracefulShutdown = async (signal) => {
  logger.info(`\n${signal} received, closing server...`);
  
  server.close(() => {
    logger.info('HTTP server closed');
  });
  
  // Close socket connections
  io.close(() => {
    logger.info('Socket.IO server closed');
  });
  
  // Close database connection
  try {
    await mongoose.connection.close(false);
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
  }
  
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("❌ Unhandled Rejection:", err);
  gracefulShutdown('unhandledRejection');
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("❌ Uncaught Exception:", err);
  gracefulShutdown('uncaughtException');
});

// ============================================================
// START SERVER
// ============================================================
const Port = process.env.PORT || 5000;
server.listen(Port, () => {
  logger.info(`🚀 Server running on port ${Port}`);
  logger.info(`📍 Socket.IO ready for connections`);
  logger.info(`📡 Admin panel available at http://localhost:${Port}`);
  logger.info(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// ============================================================
// EXPORTS
// ============================================================
module.exports = { app, server, io, logger };