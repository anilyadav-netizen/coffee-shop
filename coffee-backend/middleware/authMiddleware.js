const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Protect Middleware
const protect = async (req, res, next) => {
  try {
    let token;

    // User Token
    if (req.cookies.token) {
      token = req.cookies.token;
    }

    // Admin Token
    if (req.cookies.adminToken) {
      token = req.cookies.adminToken;
    }

    console.log(token)

    // Authorization Header (optional)
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// Role Middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
};