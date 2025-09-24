import express from "express"
import { uploadController } from "../controllers/upload.controller.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

router.post("/assets", upload.array("files"), (req, res, next) => {
  console.log("Incoming request files:", req.files);
  next();
}, uploadController);

export default router;