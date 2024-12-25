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

//user
router.get("/:storeId/visible", getBanners);
router.get("/:bannerId", getBannerById);

//admin
router.get("/all/:storeId", getAllBanner);
router.post("/create/:storeId", createBanner);
router.put("/update/:bannerId", updateBanner);
router.delete("/delete/:bannerId", deleteBanner);

export default router;
