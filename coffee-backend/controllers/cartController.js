const Cart = require("../models/Cart");

// Helper: get today's date string
const getTodayDate = () => new Date().toISOString().split("T")[0];

// ─────────────────────────────────────────────────────────────
// Add To Cart
// ─────────────────────────────────────────────────────────────
exports.addToCart = async (req, res) => {
  try {
    const { coffeeId, quantity = 1, amount } = req.body;

    if (!coffeeId) {
      return res.status(400).json({
        success: false,
        message: "Coffee ID is required",
      });
    }

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const today = getTodayDate();

    let cart = await Cart.findOne({
      user: req.user.id,
      date: today,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        date: today,
        items: [
          {
            coffee: coffeeId,
            quantity,
            amount,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.coffee.toString() === coffeeId
      );

      if (existingItem) {
        existingItem.quantity += Number(quantity);
        existingItem.amount = amount;
      } else {
        cart.items.push({
          coffee: coffeeId,
          quantity,
          amount,
        });
      }

      await cart.save();
    }

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.coffee"
    );

    res.status(201).json({
      success: true,
      message: "Item added to cart",
      data: updatedCart,
    });
  } catch (error) {
    console.error("Add To Cart Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
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

    console.log(cart)

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
