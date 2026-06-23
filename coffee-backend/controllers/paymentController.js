require("dotenv").config()
const Razorpay = require("razorpay");
const Razorpay = require("razorpay");
const Payment = require("../models/Payment");
const Coffee = require("../models/Coffee");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { coffeeId } = req.body;

    const coffee = await Coffee.findById(coffeeId);

    if (!coffee) {
      return res.status(404).json({
        message: "Coffee not found",
      });
    }

    const options = {
      amount: coffee.price * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      user: req.user._id,
      coffee: coffee._id,
      razorpayOrderId: order.id,
      amount: coffee.price,
    });

    res.status(200).json({
      order,
      coffee,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { status: "paid" },
      { new: true }
    ).populate("coffee");

    if (payment?.coffee) {
      await Coffee.findByIdAndUpdate(
        payment.coffee._id,
        {
          $inc: { stock: -1 },
        }
      );
    }

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