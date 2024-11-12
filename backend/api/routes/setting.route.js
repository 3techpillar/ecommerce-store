import express from "express";

import { verifyToken } from "../utils/verifyUser.js";
import {
  createSetting,
  deleteStore,
  getAllStore,
  getFirstStore,
  getStoreByUserId,
  updateStore,
} from "../controllers/setting/setting.controller.js";

const router = express.Router();

router.post("/create-setting", verifyToken, createSetting);
router.patch("/update/:storeId", verifyToken, updateStore);
router.get("/get-first-store/:userId", verifyToken, getFirstStore);
router.get("/get-all-store/:userId", verifyToken, getAllStore);
router.get(
  "/get-store-by-userid/:userId/:storeId",
  verifyToken,
  getStoreByUserId
);
router.delete("/delete/:storeId", verifyToken, deleteStore);

export default router;
