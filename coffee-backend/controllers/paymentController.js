require("dotenv").config()
const Razorpay = require("razorpay");
const Payment = require("../models/Payment");
const Cart = require("../models/Cart");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── Create Order ─────────────────────────────────────────────────────────────
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    console.log("Amount:", amount);
    console.log("User:", req.user);

    if (cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ✅ Total amount: ہر item کی price × quantity
    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + item.coffee.price * item.quantity;
    }, 0);

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Payment record بنائیں
    await Payment.create({
      user: req.user._id,
      razorpayOrderId: order.id,
      amount,
      status: "pending",
    });

    res.status(200).json(order);
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── Verify Payment ───────────────────────────────────────────────────────────
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    // Payment find کریں اور status update کریں
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { status: "paid" },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Payment Verified",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};