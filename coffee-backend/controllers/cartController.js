const Cart = require("../models/Cart");

// Add To Cart
exports.addToCart = async (req, res) => {
  try {
    const { coffeeId, quantity } = req.body;

    const cartItem = await Cart.create({
      user: req.user._id,
      coffee: coffeeId,
      quantity,
    });

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get User Cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.find({
      user: req.user._id,
    }).populate("coffee");

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Remove Cart Item
exports.removeCartItem = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Item removed",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


exports.increaseQuantity = async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await Cart.findById(id);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    cartItem.quantity += 1;
    await cartItem.save();

    res.status(200).json({
      success: true,
      message: "Quantity increased",
      data: cartItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Decrease Quantity
exports.decreaseQuantity = async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await Cart.findById(id);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // If quantity is 1, remove item from cart
    if (cartItem.quantity <= 1) {
      await Cart.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: "Item removed from cart",
      });
    }

    cartItem.quantity -= 1;
    await cartItem.save();

    res.status(200).json({
      success: true,
      message: "Quantity decreased",
      data: cartItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};