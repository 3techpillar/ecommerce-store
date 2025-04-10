import express from "express";

import { verifyToken } from "../../utils/verifyUser.js";

import {
  createSpecialCategory,
  deleteSpecialCategory,
  getAllSpecialCategory,
  getSpecialCategory,
  getSpecialCategoryById,
  updateSpecialCategory,
} from "../../controllers/category/specialCategory.controller.js";

const router = express.Router();

router.post("/create/:storeId", verifyToken, createSpecialCategory);

router.put("/update/:id", verifyToken, updateSpecialCategory);

router.delete("/delete/:id", deleteSpecialCategory);

router.get("/get-active/:storeId", getSpecialCategory);
router.get("/get-all/:storeId", getAllSpecialCategory);
router.get("/get-category/:id", getSpecialCategoryById);

export default router;
