const mongoose = require("mongoose");

// Sub-schema for each item inside the cart
const cartItemSchema = new mongoose.Schema(
  {
    coffee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coffee",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    amount: {
      type: String,
      required: true, // fixed typo: was "require"
    },
  },
  { _id: true } // each item has its own _id
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String, // Format: "YYYY-MM-DD"
      required: true,
    },

    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

// Unique index: one cart per user per date
cartSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Cart", cartSchema);