const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.js");

const {
  createCoffee,
  getAllCoffee,
  getCoffeeById,
  updateCoffee,
  deleteCoffee,
} = require("../controllers/coffeeController");

// Create Coffee with Image
router.post(
  "/",
  upload.single("image"),
  createCoffee
);

// Get All Coffee
router.get("/", getAllCoffee);

// Get Single Coffee
router.get("/:id", getCoffeeById);

// Update Coffee with Image
router.put(
  "/:id",
  upload.single("image"),
  updateCoffee
);

// Delete Coffee
router.delete("/:id", deleteCoffee);

module.exports = router;