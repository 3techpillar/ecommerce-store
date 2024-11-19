import express from "express";

import { verifyToken } from "../utils/verifyUser.js";
import {
  createFeaturedProduct,
  deleteFeaturedProduct,
  getAllFeaturedProducts,
  getFeaturedProductsById,
  updateFeaturedProduct,
} from "../controllers/product/featuredProduct.controller.js";

const router = express.Router();

router.post("/create/:storeId", verifyToken, createFeaturedProduct);

router.put("/update/:id", verifyToken, updateFeaturedProduct);

router.delete("/delete/:id", deleteFeaturedProduct);

router.get("/get-all/:storeId", getAllFeaturedProducts);
router.get("/get-product/:id", getFeaturedProductsById);

export default router;
