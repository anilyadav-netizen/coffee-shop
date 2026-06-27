require("dotenv").config();
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
    const { cartId } = req.body; // ✅ coffeeId کی جگہ cartId

    // Cart populate کریں تاکہ ہر coffee کی price مل سکے
    const cart = await Cart.findById(cartId).populate("items.coffee");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ✅ Total amount: ہر item کی price × quantity
    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + item.coffee.price * item.quantity;
    }, 0);

    const options = {
      amount: totalAmount * 100, // Razorpay → paise میں
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Payment record بنائیں
    await Payment.create({
      user: req.user._id,
      cart: cart._id,           // ✅ coffee کی جگہ cart
      razorpayOrderId: order.id,
      amount: totalAmount,
    });

    res.status(200).json({
      order,
      cart,
      totalAmount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    ).populate({
      path: "cart",
      populate: { path: "items.coffee" }, // nested populate
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    // ✅ Cart کی ہر coffee کا stock کم کریں
    if (payment.cart && payment.cart.items.length > 0) {
      const bulkOps = payment.cart.items.map((item) => ({
        updateOne: {
          filter: { _id: item.coffee._id },
          update: { $inc: { stock: -item.quantity } }, // quantity جتنی stock کم
        },
      }));

      const Coffee = require("../models/Coffee");
      await Coffee.bulkWrite(bulkOps);
    }

    res.status(200).json({
      success: true,
      message: "Payment Verified",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};