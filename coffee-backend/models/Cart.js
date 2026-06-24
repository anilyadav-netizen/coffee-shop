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
  },
  { _id: true } // ہر item کا اپنا _id ہوگا
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

    items: [cartItemSchema], // ✅ سب items ایک array میں
  },
  {
    timestamps: true,
  }
);

// ✅ ایک user کی ایک date پر صرف ایک cart document
cartSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Cart", cartSchema);