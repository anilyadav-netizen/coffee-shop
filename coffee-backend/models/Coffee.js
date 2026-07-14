const mongoose = require("mongoose");

const coffeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    // Original Price (MRP)
    price: {
      type: Number,
      required: true,
    },

    // Discounted Selling Price
    discountPrice: {
      type: Number,
      default: 0,
    },

    // Discount Percentage
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    stock: {
      type: Number,
      default: 0,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coffee", coffeeSchema);