const express = require("express");
const router = express.Router();

const {
  createCoffee,
  getAllCoffee,
  getCoffeeById,
  updateCoffee,
  deleteCoffee,
} = require("../controllers/coffeeController");

router.post("/", createCoffee);
router.get("/", getAllCoffee);
router.get("/:id", getCoffeeById);
router.put("/:id", updateCoffee);
router.delete("/:id", deleteCoffee);

module.exports = router;