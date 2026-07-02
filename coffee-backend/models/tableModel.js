const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: Number,
      required: true,
    },

    seats: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "occupied", "reserved"],
      default: "available",
    },


  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Table", tableSchema);