import { Router } from "express";
import { googleLogin } from "../../controllers/user/user.controller.js";

const router = Router();

router.get("/google/callback", googleLogin)

export default router;