import express from "express";

import { verifyToken } from "../utils/verifyUser.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/product/category.controller.js";

const router = express.Router();

router.post("/create-category", verifyToken, createCategory);
router.get("/get-category", verifyToken, getAllCategories);
router.get("/get-category/:categoryId", verifyToken, getCategoryById);
router.put("/update-category/:categoryId", verifyToken, updateCategory);
router.delete("/delete-category/:categoryId", verifyToken, deleteCategory);

export default router;
