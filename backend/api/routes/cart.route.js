import express from "express";
import {
  addToCart,
  applyCoupon,
  clearCart,
  getallCart,
  getCart,
  removeCoupon,
  removeFromCart,
  updateCartShippingAddress,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/get-by-store/:storeId", getallCart); //admin

router.get("/get-by-userId/:userId", getCart); //admin
router.post("/:storeId", addToCart);
router.delete("/:userId/:productId", removeFromCart);
router.delete("/:userId", clearCart);
router.put("/:userId/shipping-address", updateCartShippingAddress);

router.post("/coupon/apply", applyCoupon);
router.post("/coupon/remove", removeCoupon);

export default router;
