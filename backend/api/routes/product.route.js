import express from "express";

import { verifyToken } from "../utils/verifyUser.js";
import { createProduct } from "../controllers/product/product.controller.js";

const router = express.Router();

router.post("/create-product", verifyToken, createProduct);
router.put("/update-product/:productId", verifyToken, createProduct);

export default router;
