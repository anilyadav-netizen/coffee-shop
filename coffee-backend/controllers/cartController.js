const Cart = require("../models/Cart");

// Helper: get today's date string
const getTodayDate = () => new Date().toISOString().split("T")[0];

// ─── Add To Cart ──────────────────────────────────────────────────────────────
exports.addToCart = async (req, res) => {
  try {
    const { coffeeId, quantity } = req.body;
    const today = getTodayDate();

    // Find today's cart for this user (upsert if not exists)
    let cart = await Cart.findOne({ user: req.user.id, date: today });

    if (!cart) {
      // New day → new document
      cart = await Cart.create({
        user: req.user.id,
        date: today,
        items: [{ coffee: coffeeId, quantity }],
      });
    } else {
      // Same day → check if coffee already in items
      const existingItem = cart.items.find(
        (item) => item.coffee.toString() === coffeeId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ coffee: coffeeId, quantity });
      }

      await cart.save();
    }

    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Get User Cart ────────────────────────────────────────────────────────────
exports.getCart = async (req, res) => {
  try {
    const today = getTodayDate();

    const cart = await Cart.findOne({ user: req.user.id, date: today }).populate(
      "items.coffee"
    );

    res.status(200).json(cart || { user: req.user.id, date: today, items: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Remove Cart Item ─────────────────────────────────────────────────────────
exports.removeCartItem = async (req, res) => {
  try {
    const today = getTodayDate();
    const { coffeeId } = req.params; // pass coffeeId in URL

    const cart = await Cart.findOne({ user: req.user.id, date: today });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.coffee.toString() !== coffeeId
    );

    await cart.save();

    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Increase Quantity ────────────────────────────────────────────────────────
exports.increaseQuantity = async (req, res) => {
  try {
    const today = getTodayDate();
    const { coffeeId } = req.params;

    const cart = await Cart.findOne({
      user: req.user.id,
      date: today,
    });

    if (!cart)
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });

    const item = cart.items.find(
      (i) => i.coffee.toString() === coffeeId
    );

    if (!item)
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });

    item.quantity += 1;
    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
      .populate("items.coffee");

    res.status(200).json({
      success: true,
      message: "Quantity increased",
      data: updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── Decrease Quantity ────────────────────────────────────────────────────────
exports.decreaseQuantity = async (req, res) => {
  try {
    const today = getTodayDate();
    const { coffeeId } = req.params;

    const cart = await Cart.findOne({
      user: req.user.id,
      date: today,
    });

    if (!cart)
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });

    const itemIndex = cart.items.findIndex(
      (i) => i.coffee.toString() === coffeeId
    );

    if (itemIndex === -1)
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });

    if (cart.items[itemIndex].quantity <= 1) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity -= 1;
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
      .populate("items.coffee");

    res.status(200).json({
      success: true,
      message: "Quantity decreased",
      data: updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};