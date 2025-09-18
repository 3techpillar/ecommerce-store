import express from "express";
import {
  addToWishlist,
  clearWishlist,
  getWishlist,
  removeFromWishlist,
} from "../../controllers/user/wishlist.controller.js";

const router = express.Router();

router.post("/add", addToWishlist);
router.post("/remove", removeFromWishlist);
router.delete("/clear/:userId", clearWishlist);
router.get("/get/:userId", getWishlist);

export default router;
