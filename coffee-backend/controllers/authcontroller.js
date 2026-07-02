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

// Register
const register = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    // g malik 

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

    return res.status(201).json({
      message: "User created successfully",
      token,
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

    const isMatch = await bcryptjs.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id,user.role,user.email,user.name);

    return res.status(200).json({
      message: "Login successful",
      token,
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

// Logout
const logout = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Logout successful. Remove token from client.",
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
  try{
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

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateAddress,
  getAllUsers,
  deleteUser
};