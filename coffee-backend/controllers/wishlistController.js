const Wishlist = require("../models/Wishlist");


// Add Wishlist
exports.createWishlist = async (req, res) => {
  try {
    const { coffeeId } = req.body;

    const exists = await Wishlist.findOne({
      user: req.user.id,
      coffee: coffeeId,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Coffee already in wishlist",
      });
    }

    const wishlist = await Wishlist.create({
      user: req.user.id,
      coffee: coffeeId,
    });

    res.status(201).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get User Wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({
      user: req.user.id,
    }).populate("coffee");

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Update Wishlist
exports.updateWishlist = async (req, res) => {
  try {
    const { coffeeId } = req.body;

    const wishlist = await Wishlist.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        coffee: coffeeId,
      },
      { new: true }
    ).populate("coffee");

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Delete Wishlist Item
exports.deleteWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wishlist item removed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};