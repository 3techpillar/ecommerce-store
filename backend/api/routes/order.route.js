import express from "express";
import {
  cancelOrder,
  createOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";

import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/:userId/:storeId", createOrder);
router.post("/:userId/:orderId", cancelOrder);

router.put("/status/:orderId", updateOrderStatus);

router.get("/:storeId", getAllOrders);
router.get("/:userId", getUserOrders);
router.get("/get-by-id/:orderId", getOrderById);

export default router;
