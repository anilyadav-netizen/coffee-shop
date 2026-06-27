require("dotenv").config();
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Payment = require("../models/Payment");
const Cart = require("../models/Cart");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================= CREATE ORDER =================
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's cart
    const cart = await Cart.findOne({ user: userId })
      .populate("items.coffee");

    console.log("========== CREATE ORDER ==========");
    console.log(JSON.stringify(cart, null, 2));

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;

    const products = cart.items.map((item) => {
      if (!item.coffee) {
        throw new Error("Coffee product not found");
      }

      // amount cart item me string hai
      const price = Number(item.amount);

      if (isNaN(price)) {
        throw new Error(
          `Invalid amount found for ${item.coffee.name}`
        );
      }

      const quantity = Number(item.quantity) || 1;
      const subtotal = price * quantity;

      totalAmount += subtotal;

      return {
        coffee: item.coffee._id,
        name: item.coffee.name,
        image: item.coffee.image,
        description: item.coffee.description,
        category: item.coffee.category,
        price,
        quantity,
        subtotal,
      };
    });

    console.log("Products:", products);
    console.log("Total Amount:", totalAmount);

    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    // Razorpay amount must be in paise
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    console.log("Razorpay Order Created:", razorpayOrder.id);

    // Save payment record
    await Payment.create({
      user: userId,
      products,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount,
      status: "pending",
    });

    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      order: razorpayOrder,
      amount: totalAmount,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= VERIFY PAYMENT =================
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Verify Signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Update Payment
    const payment = await Payment.findOneAndUpdate(
      {
        razorpayOrderId: razorpay_order_id,
      },
      {
        status: "paid",
        razorpayPaymentId: razorpay_payment_id,
      },
      {
        new: true,
      }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { user: payment.user },
      {
        $set: {
          items: [],
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET MY ORDERS =================
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Payment.find({
      user: req.user._id,
      status: "paid",
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET SINGLE ORDER =================
exports.getOrderById = async (req, res) => {
  try {
    const order = await Payment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};