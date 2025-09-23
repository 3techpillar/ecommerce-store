import express from "express";
import {
  createCODPayment,
  createOnlinePayment,
  verifyOnlinePayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

// COD Payment
router.post("/cod", createCODPayment);

// Online Payment
router.post("/online/create", createOnlinePayment);
router.post("/online/verify", verifyOnlinePayment);

export default router;
