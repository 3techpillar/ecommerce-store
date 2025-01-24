import express from "express";
import {
  createBrand,
  deleteBrand,
  getAllBrand,
  getBrandById,
  updateBrand,
} from "../controllers/brand.controller.js";

const router = express.Router();

//admin
router.get("/:brandId", getBrandById);
router.get("/all/:storeId", getAllBrand);
router.post("/create/:storeId", createBrand);
router.put("/update/:brandId", updateBrand);
router.delete("/delete/:brandId", deleteBrand);

export default router;
