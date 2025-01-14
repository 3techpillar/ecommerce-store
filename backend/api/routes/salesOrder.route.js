import express from "express";
import {
  getAllSalesOrders,
  getSalesOrderById,
} from "../controllers/salesOrder.controller.js";

const router = express.Router();

router.get("/:storeId", getAllSalesOrders);
router.get("/get-by-id/:salesOrderId", getSalesOrderById);

export default router;
