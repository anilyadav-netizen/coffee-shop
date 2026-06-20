const Coffee = require("../models/Coffee");

// Create Coffee
exports.createCoffee = async (req, res) => {
  try {
    const coffee = await Coffee.create(req.body);

    res.status(201).json({
      success: true,
      data: coffee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Coffee
exports.getAllCoffee = async (req, res) => {
  try {
    const coffees = await Coffee.find();

    res.status(200).json({
      success: true,
      data: coffees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Coffee
exports.getCoffeeById = async (req, res) => {
  try {
    const coffee = await Coffee.findById(req.params.id);

    if (!coffee) {
      return res.status(404).json({
        message: "Coffee not found",
      });
    }

    res.status(200).json(coffee);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Coffee
exports.updateCoffee = async (req, res) => {
  try {
    const coffee = await Coffee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(coffee);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Coffee
exports.deleteCoffee = async (req, res) => {
  try {
    await Coffee.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Coffee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};