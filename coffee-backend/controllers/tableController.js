const Table = require("../models/tableModel");

// Create Table
exports.createTable = async (req, res) => {
  try {
    const { tableNumber, seats } = req.body;

    const table = await Table.create({
      tableNumber,
      seats,
    });

    res.status(201).json({
      success: true,
      table,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Tables
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find({
    });

    res.json({
      success: true,
      tables,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Table
exports.updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      table,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Table
exports.deleteTable = async (req, res) => {
  try {
    await Table.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Table deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};