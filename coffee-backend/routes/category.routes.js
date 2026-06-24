const express = require("express");

const {
  createCategory,
  updateCategory,
  getCategories,
  getCategoryById,
  deleteCategory,
} = require("../controllers/category.controller");

const upload = require("../middleware/upload");

const router = express.Router();

router.post("/", upload.single("icon"), createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.put("/:id", upload.single("icon"), updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;