const mongoose = require("mongoose");

// Products Schema
const orderProductSchema = new mongoose.Schema(
  {
    coffee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coffee",
      required: true,
    },
    name: String,
    image: String,
    description: String,
    category: String,
    price: Number,
    quantity: Number,
    subtotal: Number,
  },
  { _id: false }
);

// Delivery Address Schema
const deliveryAddressSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["home", "office", "other"],
      default: "home",
    },
    fullName: String,
    email: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
  },
  { _id: false }
);

// Tracking Schema
const trackingSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Main Order Schema
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },

    orderType: {
      type: String,
      enum: ["delivery", "dine_in"],
      required: true,
    },

    deliveryAddress: {
      type: deliveryAddressSchema,
      default: null,
    },

    products: [orderProductSchema],

    amount: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "failed"],
      default: "paid",
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    tracking: {
      type: [trackingSchema],
      default: [
        {
          status: "pending",
          message: "Order placed successfully",
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);