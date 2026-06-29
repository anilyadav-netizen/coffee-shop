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

    const { orderType, deliveryAddress } = req.body;

    if (!["delivery", "dine_in"].includes(orderType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order type",
      });
    }

    // Delivery address required
    if (orderType === "delivery") {
      if (
        !deliveryAddress ||
        !deliveryAddress.fullName ||
        !deliveryAddress.phone ||
        !deliveryAddress.addressLine1 ||
        !deliveryAddress.city ||
        !deliveryAddress.state ||
        !deliveryAddress.pincode
      ) {
        return res.status(400).json({
          success: false,
          message: "Delivery address is required",
        });
      }
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.coffee");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;

    const products = cart.items.map((item) => {
      const price = Number(item.amount);
      const quantity = Number(item.quantity);
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

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    await Payment.create({
      user: userId,
      orderType,
      deliveryAddress: orderType === "delivery" ? deliveryAddress : null,
      products,
      amount: totalAmount,
      razorpayOrderId: razorpayOrder.id,
      status: "pending",
    });

    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      order: razorpayOrder,
      amount: totalAmount,
    });
  } catch (error) {
    console.log(error);

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
    // Step 1: Verify Razorpay Signature
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
    // Step 2: Update Payment record in DB
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        status: "paid",
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );
    // FIX: Check payment BEFORE accessing payment.user
    // Previously, console.log(payment.user) was called before this check
    // which caused a crash (TypeError) if payment was null
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found. Make sure razorpay_order_id is correct.",
      });
    }
    console.log("Payment verified for user:", payment.user);
    // Step 3: Clear user's cart after successful payment
    const cartUpdate = await Cart.findOneAndUpdate(
      { user: payment.user },
      { $set: { items: [] } },
      { new: true }
    );
    console.log("Cart cleared:", cartUpdate);
    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment,
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
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