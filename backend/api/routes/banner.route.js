import express from "express";
import {
  createBanner,
  deleteBanner,
  getAllBanner,
  getBannerById,
  getBanners,
  updateBanner,
} from "../controllers/banner.controller.js";

const router = express.Router();

router.get("/visible", getBanners);
router.get("/all/:storeId", getAllBanner);
router.get("/:bannerId", getBannerById);

router.post("/create/:storeId", createBanner);

router.put("/update/:bannerId", updateBanner);
router.delete("/delete/:bannerId", deleteBanner);

export default router;
