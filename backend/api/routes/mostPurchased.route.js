import express from "express";
import { getMostPurchasedProducts } from "../controllers/mostPurchased.controller.js";

const router = express.Router();

router.get("/products/:storeId", getMostPurchasedProducts);

export default router;
