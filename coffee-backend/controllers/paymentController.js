require("dotenv").config()
const Razorpay = require("razorpay");
const Payment = require("../models/Payment");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(
      options
    );

    await Payment.create({
      user: req.user._id,
      razorpayOrderId: order.id,
      amount,
    });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
    } = req.body;

    await Payment.findOneAndUpdate(
      {
        razorpayOrderId: razorpay_order_id,
      },
      {
        status: "paid",
      }
    );

    res.status(200).json({
      success: true,
      message: "Payment Verified",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};