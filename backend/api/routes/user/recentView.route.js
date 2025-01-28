import express from "express";
import {
  addRecentView,
  getRecentViews,
} from "../../controllers/user/recentView.controller.js";

const router = express.Router();

router.post("/add", addRecentView);
router.get("/get/:userId", getRecentViews);

export default router;
