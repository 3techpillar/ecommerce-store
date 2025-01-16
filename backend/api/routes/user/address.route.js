import express from "express";
import {
  addAddress,
  deleteAddress,
  getAddress,
  getAddressById,
  updateAddress,
} from "../../controllers/user/address.controller.js";
import { verifyUser } from "../../utils/verifyUser.js";

const router = express.Router();

router.post("/add/:userId", addAddress);
router.get("/get-all/:userId", getAddress);
router.get("/get-by-id/:addressId", getAddressById);
router.put("/update/:userId/:addressId", updateAddress);
router.delete("/:addressId", deleteAddress);

export default router;
