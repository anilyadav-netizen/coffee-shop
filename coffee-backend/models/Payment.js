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
      ref: "Cart",       
      required: true,
    },

    razorpayOrderId: String,

    amount: Number,         

    status: {
      type: String,
      default: "paid",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);