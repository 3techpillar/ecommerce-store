import express from "express";
import { getMostVisitedProducts } from "../controllers/mostVisited.controller.js";

const router = express.Router();

router.get("/products/:storeId", getMostVisitedProducts);

export default router;
