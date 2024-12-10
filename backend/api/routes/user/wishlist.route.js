import express from "express";
import {
  addRemoveWishlist,
  clearWishlist,
  getWishlist,
} from "../../controllers/user/wishlist.controller.js";

const router = express.Router();

router.post("/", addRemoveWishlist);
router.post("/clear/:userId", clearWishlist);
router.get("/get/:userId", getWishlist);

export default router;
