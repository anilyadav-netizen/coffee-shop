const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    coffee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coffee",
      required: true,
    },

    razorpayOrderId: String,

    amount: Number,

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