import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupon,
  getCoupon,
  updateCoupon,
} from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/get-by-id/:couponId", getCoupon);
router.get("/:storeId", getAllCoupon);

router.post("/:storeId", verifyToken, createCoupon);

router.put("/:couponId", verifyToken, updateCoupon);

router.delete("/:couponId", verifyToken, deleteCoupon);

export default router;
