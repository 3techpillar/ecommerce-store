import express from "express";
import {
  addAddress,
  deleteAddress,
  getAddress,
  updateAddress,
} from "../../controllers/user/address.controller.js";
import { verifyUser } from "../../utils/verifyUser.js";

const router = express.Router();

router.post("/", addAddress);
router.get("/:userId", getAddress);
router.put("/:addressId", updateAddress);
router.delete("/:addressId", deleteAddress);

export default router;
