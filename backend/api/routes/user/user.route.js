import express from "express";
import {
  getUserById,
  signin,
  signout,
  signup,
  updateUser,
} from "../../controllers/user/user.controller.js";
import { verifyUser } from "../../utils/verifyUser.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", signout);

router.put("/:id", verifyUser, updateUser);
router.get("/:id", getUserById);

export default router;
