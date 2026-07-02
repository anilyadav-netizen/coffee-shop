require("dotenv").config();
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Payment = require("../models/Payment");
const Cart = require("../models/Cart");
const Order = require("../models/orderModel");
const Table = require("../models/tableModel");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ================= CREATE ORDER =================
exports.createOrder = async (req, res) => {
  try {
    console.log("========== CREATE ORDER ==========");

    const userId = req.user.id;

    const {
      orderType,
      deliveryAddress,
      amount,
    } = req.body;

    console.log(req.body);

    const table = req.body.tableId

    // ---------------- VALIDATE ORDER TYPE ----------------
    if (!["delivery", "dine_in"].includes(orderType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order type",
      });
    }

    // ---------------- DELIVERY VALIDATION ----------------
    if (orderType === "delivery") {
      if (
        !deliveryAddress?.fullName ||
        !deliveryAddress?.phone ||
        !deliveryAddress?.addressLine1 ||
        !deliveryAddress?.addressLine2 ||
        !deliveryAddress?.city ||
        !deliveryAddress?.state ||
        !deliveryAddress?.pincode
      ) {
        return res.status(400).json({
          success: false,
          message: "Delivery address is required",
        });
      }
    }

    // ---------------- DINE IN VALIDATION ----------------
    if (orderType === "dine_in") {
      if (!table) {
        return res.status(400).json({
          success: false,
          message: "Please select a table",
        });
      }

      const tableData = await Table.findById(table);

      if (!tableData) {
        return res.status(404).json({
          success: false,
          message: "Table not found",
        });
      }

      if (tableData.status === "occupied") {
        return res.status(400).json({
          success: false,
          message: "Table is already occupied",
        });
      }
    }

    // ---------------- FIND CART ----------------
    const cart = await Cart.findOne({
      user: userId,
      "items.0": { $exists: true },
    }).sort({ createdAt: -1 });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // ---------------- VALIDATE AMOUNT ----------------
    const frontendAmount = Number(amount);

    if (!frontendAmount || isNaN(frontendAmount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // ---------------- PREPARE PRODUCTS ----------------
    let serverTotal = 0;

    const products = cart.items.map((item) => {
      const price = Number(item.amount || 0);
      const quantity = Number(item.quantity || 1);

      const subtotal = price * quantity;
      serverTotal += subtotal;

      return {
        coffee: item.coffee,
        name: item.name,
        image: item.image,
        description: item.description,
        category: item.category,
        price,
        quantity,
        subtotal,
      };
    });

    // ---------------- CREATE RAZORPAY ORDER ----------------
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(frontendAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // ---------------- SAVE PAYMENT ----------------
    await Payment.create({
      user: userId,

      orderType,

      table: orderType === "dine_in" ? table : null,

      deliveryAddress:
        orderType === "delivery"
          ? deliveryAddress
          : null,

      products,

      amount: frontendAmount,

      razorpayOrderId: razorpayOrder.id,

      status: "pending",
    });

    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      order: razorpayOrder,
      amount: frontendAmount,
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

    // Verify Razorpay Signature
    const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
    
    console.log("Payment Table:", payment.table);
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Update Payment
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        status: "paid",
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    // Prevent duplicate order
    const existingOrder = await Order.findOne({
      payment: payment._id,
    });

    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "Order already exists",
        order: existingOrder,
      });
    }

    // Create Order
    const createdOrder = await Order.create({
      user: payment.user,
      payment: payment._id,

      orderType: payment.orderType,

      table: payment.table || null,

      deliveryAddress: payment.deliveryAddress,

      products: payment.products,

      amount: payment.amount,

      paymentStatus: "paid",

      orderStatus: "pending",

      tracking: [
        {
          status: "pending",
          message: "Order placed successfully",
          timestamp: new Date(),
        },
      ],
    });

    // Make table occupied
    if (payment.orderType === "dine_in" && payment.table) {
      await Table.findByIdAndUpdate(payment.table, {
        status: "occupied",
      });
    }

    // Populate Order
    const populatedOrder = await Order.findById(createdOrder._id)
      .populate({
        path: "user",
        select: "name email mobile profileImage",
      })
      .populate("payment")
      .populate("table") // <-- Added
      .populate({
        path: "products.coffee",
        select: "name image price category",
      });

    // Socket Events
    const io = req.app.get("io");

    if (io) {
      io.emit("new-order-placed", {
        success: true,
        order: populatedOrder,
        message: "New order placed successfully!",
        timestamp: new Date(),
      });

      io.to(createdOrder._id.toString()).emit("order-created", {
        orderId: createdOrder._id,
        order: populatedOrder,
        message: "Your order has been created",
      });

      io.to(`user-${payment.user}`).emit("order-confirmed", {
        orderId: createdOrder._id,
        order: populatedOrder,
        message: "Your payment is confirmed and order is placed",
      });

      const totalOrders = await Order.countDocuments();

      io.emit("order-count-update", {
        totalOrders,
        newOrder: populatedOrder,
      });
    }

    // Clear Cart
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
      message: "Payment verified and order created successfully",
      order: populatedOrder,
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
    })
      .populate({
        path: "table",
        select: "tableNumber seats status",
      })
      .sort({ createdAt: -1 });

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
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .select(
        "orderType table amount paymentStatus orderStatus deliveryAddress products tracking createdAt updatedAt payment"
      )
      .populate({
        path: "table",
        select: "tableNumber seats status",
      })
      .populate({
        path: "products.coffee",
        select: "name image description category price discountPrice stock",
      })
      .populate({
        path: "payment",
        select: "paymentId orderId signature method status createdAt",
      })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


