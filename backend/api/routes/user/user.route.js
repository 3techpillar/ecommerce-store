import express from "express";
import {
  getUserById,
  signin,
  signout,
  signup,
  updateUser,
  getUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../../controllers/user/user.controller.js";
import { verifyToken, verifyUser } from "../../utils/verifyUser.js";

const router = express.Router();

// Auth
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", signout);

// Forgot Password Flow
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

// User CRUD
router.put("/:id", verifyUser, updateUser);
router.get("/:id", getUserById);
router.get("/me", verifyToken, getUser);

export default router;
