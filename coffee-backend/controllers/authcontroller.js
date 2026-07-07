const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Cookie Options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // true on https
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
};

// Register
const register = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = await User.create({
      name,
      mobile,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    // Save Token in Cookie
    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    // Role based cookie name
    const cookieName = user.role === "admin" ? "adminToken" : "token";

    // Optional: Clear opposite cookie
    res.clearCookie(cookieName === "adminToken" ? "token" : "adminToken");

    // Save Token in Cookie
    res.cookie(cookieName, token, cookieOptions);

    return res.status(200).json({
      message: "Login successful",
      role: user.role,
      user: {
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production" ? "None" : "Lax",
    };

    res.clearCookie("token", cookieOptions);
    res.clearCookie("adminToken", cookieOptions);

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};


// Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const createAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      type,
      fullName,
      email,
      phone,
      secondPhone,
      address,
      city,
      state,
      pincode,
      landmark,
      isDefault,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If this is the first address, make it default automatically
    let defaultStatus = isDefault || false;

    if (user.addresses.length === 0) {
      defaultStatus = true;
    }

    // If new address is default, remove default from others
    if (defaultStatus) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    const newAddress = {
      type,
      fullName,
      email,
      phone,
      secondPhone,
      address,
      city,
      state,
      pincode,
      landmark,
      isDefault: defaultStatus,
    };

    user.addresses.push(newAddress);

    await user.save();

    const createdAddress = user.addresses[user.addresses.length - 1];

    res.status(201).json({
      success: true,
      message: "Address created successfully",
      address: createdAddress,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const wasDefault = address.isDefault;

    // Delete address
    address.deleteOne();

    // If deleted address was default, make first remaining address default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    const {
      type,
      fullName,
      email,
      phone,
      secondPhone,
      address,
      city,
      state,
      pincode,
      landmark,
      isDefault,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const addressData = user.addresses.id(addressId);

    if (!addressData) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Update fields
    if (type !== undefined) addressData.type = type;
    if (fullName !== undefined) addressData.fullName = fullName;
    if (email !== undefined) addressData.email = email;
    if (phone !== undefined) addressData.phone = phone;
    if (secondPhone !== undefined) addressData.secondPhone = secondPhone;
    if (address !== undefined) addressData.address = address;
    if (city !== undefined) addressData.city = city;
    if (state !== undefined) addressData.state = state;
    if (pincode !== undefined) addressData.pincode = pincode;
    if (landmark !== undefined) addressData.landmark = landmark;

    // Default address handling
    if (isDefault === true) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
      addressData.isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: addressData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = ["user", "admin", "rider", "chef"];

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;

    // Agar rider nahi hai to location reset kar do
    if (role !== "rider") {
      user.currentLocation = {
        latitude: null,
        longitude: null,
        updatedAt: null,
      };

      user.isAvailable = false;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateAddress,
  getAllUsers,
  deleteUser,
  createAddress,
  deleteAddress,
  updateUserRole
};