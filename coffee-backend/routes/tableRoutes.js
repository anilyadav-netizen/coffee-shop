const express = require("express");

const router = express.Router();

const {
  createTable,
  getTables,
  updateTable,
  deleteTable,
} = require("../controllers/tableController");
const { protect } = require("../middleware/authMiddleware");


// auth middleware agar hai to yahan lagao
// const auth = require("../middleware/auth");

router.post("/",protect, createTable);
router.get("/", getTables);
router.put("/:id", updateTable);
router.delete("/:id", deleteTable);

module.exports = router;