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