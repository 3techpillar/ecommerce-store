import express from "express";

import { verifyToken } from "../utils/verifyUser.js";
import {
  createCategoryProduct,
  deleteCategoryProduct,
  getAllCategoryProducts,
  getCategoryProducts,
  getCategoryProductsById,
  updateCategoryProduct,
} from "../controllers/product/categoryProduct.controller.js";

const router = express.Router();

router.post("/create/:storeId", verifyToken, createCategoryProduct);

router.put("/update/:id", verifyToken, updateCategoryProduct);

router.delete("/delete/:id", deleteCategoryProduct);

router.get("/get-all/:storeId", getAllCategoryProducts);
router.get("/:storeId/get-active", getCategoryProducts);
router.get("/get-category-product/:id", getCategoryProductsById);

export default router;
