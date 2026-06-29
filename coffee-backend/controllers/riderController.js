const Order = require("../models/orderModel");

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Status Messages
    const statusMessages = {
      pending: "Order placed successfully.",
      confirmed: "Order confirmed.",
      preparing: "Your coffee is being prepared.",
      out_for_delivery: "Your order is out for delivery.",
      delivered: "Order delivered successfully.",
      cancelled: "Order has been cancelled.",
    };

    order.orderStatus = orderStatus;

    order.tracking.push({
      status: orderStatus,
      message: statusMessages[orderStatus],
      time: new Date(),
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};