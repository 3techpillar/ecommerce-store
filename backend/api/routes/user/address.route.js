import express from "express";
import {
  addAddress,
  deleteAddress,
  getAddress,
  updateAddress,
} from "../../controllers/user/address.controller.js";
import { verifyUser } from "../../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyUser, addAddress);
router.get("/", verifyUser, getAddress);
router.put("/:addressId", verifyUser, updateAddress);
router.delete("/:addressId", verifyUser, deleteAddress);

export default router;
