import express from "express";
import multer from "multer";

import {
  createCategory,
  updateCategory,
  getCategories,
  getCategoryById,
  deleteCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

const upload =   require("../middleware/upload.js");

router.post("/", upload.single("icon"), createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.put("/:id", upload.single("icon"), updateCategory);
router.delete("/:id", deleteCategory);

export default router;