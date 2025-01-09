import express from "express";
import { verifyToken } from "../utils/verifyUser.js";

import {
  createShipping,
  deleteShipping,
  getAllShipping,
  getShipping,
  getShippingById,
  updateShipping,
} from "../controllers/shipping.controller.js";

const router = express.Router();

router.get("/get-by-id/:shippingId", getShippingById);
router.get("/:storeId", getAllShipping);
router.get("/active/:storeId", getShipping);

router.post("/:storeId", verifyToken, createShipping);

router.put("/:shippingId", verifyToken, updateShipping);

router.delete("/:shippingId", verifyToken, deleteShipping);

export default router;
