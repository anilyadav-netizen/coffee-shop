const Cart = require("../models/Cart");

// Helper: get today's date string
const getTodayDate = () => new Date().toISOString().split("T")[0];

// ─────────────────────────────────────────────────────────────
// Add To Cart
// ─────────────────────────────────────────────────────────────
exports.addToCart = async (req, res) => {
  try {
    const { coffeeId, quantity = 1, amount } = req.body;

    // Validation
    if (!coffeeId) {
      return res.status(400).json({
        success: false,
        message: "Coffee ID is required",
      });
    }

    if (amount === undefined || amount === null) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    // Find user's cart (ONLY ONE CART PER USER)
    let cart = await Cart.findOne({
      user: req.user.id,
    });

    // If cart doesn't exist, create one
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [
          {
            coffee: coffeeId,
            quantity: Number(quantity),
            amount: Number(amount),
          },
        ],
      });
    } else {
      // Check if coffee already exists in cart
      const existingItem = cart.items.find(
        (item) => item.coffee.toString() === coffeeId
      );

      if (existingItem) {
        // Increase quantity
        existingItem.quantity += Number(quantity);
        existingItem.amount = Number(amount);
      } else {
        // Add new coffee
        cart.items.push({
          coffee: coffeeId,
          quantity: Number(quantity),
          amount: Number(amount),
        });
      }

      await cart.save();
    }

    // Populate coffee details
    const updatedCart = await Cart.findById(cart._id).populate(
      "items.coffee"
    );

    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      data: updatedCart,
    });
  } catch (error) {
    console.error("Add To Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// Get Cart
// ─────────────────────────────────────────────────────────────
exports.getCart = async (req, res) => {
  try {
    const today = getTodayDate();

    const cart = await Cart.findOne({
      user: req.user.id,
      date: today,
    }).populate("items.coffee");

    res.status(200).json({
      success: true,
      data: cart || {
        user: req.user.id,
        date: today,
        items: [],
      },
    });
  } catch (error) {
    console.error("Get Cart Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────
// Remove Item
// ─────────────────────────────────────────────────────────────
exports.removeCartItem = async (req, res) => {
  try {
    const { coffeeId } = req.params;
    const today = getTodayDate();

    const cart = await Cart.findOne({
      user: req.user.id,
      date: today,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.coffee.toString() !== coffeeId
    );

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.coffee"
    );

    res.status(200).json({
      success: true,
      message: "Item removed successfully",
      data: updatedCart,
    });
  } catch (error) {
    console.error("Remove Item Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────
// Increase Quantity
// ─────────────────────────────────────────────────────────────
exports.increaseQuantity = async (req, res) => {
  try {
    const { coffeeId } = req.params;
    const today = getTodayDate();

    const cart = await Cart.findOne({
      user: req.user.id,
      date: today,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.coffee.toString() === coffeeId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    item.quantity += 1;

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.coffee"
    );

    res.status(200).json({
      success: true,
      message: "Quantity increased",
      data: updatedCart,
    });
  } catch (error) {
    console.error("Increase Quantity Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────
// Decrease Quantity
// ─────────────────────────────────────────────────────────────
exports.decreaseQuantity = async (req, res) => {
  try {
    const { coffeeId } = req.params;
    const today = getTodayDate();

    const cart = await Cart.findOne({
      user: req.user.id,
      date: today,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.coffee.toString() === coffeeId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.coffee"
    );

    res.status(200).json({
      success: true,
      message: "Quantity decreased",
      data: updatedCart,
    });
  } catch (error) {
    console.error("Decrease Quantity Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────
// Clear Cart
// ─────────────────────────────────────────────────────────────
exports.clearCart = async (req, res) => {
  try {
    const today = getTodayDate();

    await Cart.findOneAndDelete({
      user: req.user.id,
      date: today,
    });

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Clear Cart Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
