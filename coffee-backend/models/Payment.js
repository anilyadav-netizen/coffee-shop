const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",          // ✅ coffee کی جگہ cart
      required: true,
    },

    razorpayOrderId: String,

    amount: Number,         // cart کا total amount

    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);