const Order = require("../models/orderModel");


exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate({
        path: "user",
        select: "name email mobile profileImage",
      })
      .populate({
        path: "payment",
      })
      .populate({
        path: "products.coffee",
        select: "name image price category",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};