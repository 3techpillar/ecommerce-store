import express from "express";

import { verifyToken } from "../utils/verifyUser.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product/product.controller.js";

const router = express.Router();

router.post("/create-product/:storeId", verifyToken, createProduct);
router.get("/:storeId", getAllProducts);
router.get("/get-products/:storeId", getProducts);
router.get("/get-product/:productId", getProductById);
router.put("/update-product/:productId", verifyToken, updateProduct);
router.delete("/delete-product/:productId", verifyToken, deleteProduct);

export default router;
