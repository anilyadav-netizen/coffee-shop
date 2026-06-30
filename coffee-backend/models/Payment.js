const mongoose = require("mongoose");

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

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Order Type
    orderType: {
      type: String,
      enum: ["dine_in", "delivery"],
      required: true,
      default: "dine_in",
    },

    deliveryAddress: {
      type: deliveryAddressSchema,
      default: null,
    },

    products: [
      {
        coffee: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Coffee",
        },
        name: String,
        image: String,
        description: String,
        category: String,
        price: Number,
        quantity: Number,
        subtotal: Number,
      },
    ],

    amount: {
      type: Number,
      required: true,
    },

    razorpayOrderId: {
      type: String,
      required: true,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);