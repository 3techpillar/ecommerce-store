import express from "express";
import {
  addToCart,
  applyCoupon,
  clearCart,
  getCart,
  removeCoupon,
  removeFromCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/:userId", getCart);
router.post("/", addToCart);
router.delete("/:userId/:productId", removeFromCart);
router.delete("/:userId", clearCart);

router.post("/coupon/apply", applyCoupon);
router.post("/coupon/remove", removeCoupon);

export default router;
