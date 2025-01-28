import express from "express";
import {
  createCms,
  deleteCms,
  getActiveCms,
  getAllCms,
  getCms,
  getCmsById,
  updateCms,
} from "../controllers/cms.controller.js";

const router = express.Router();

router.get("/active/:storeId", getActiveCms);
router.get("/page/:slug", getCms);

router.post("/create/:storeId", createCms);
router.put("/update/:id", updateCms);
router.get("/get-by-id/:cmsId", getCmsById);
router.get("/get-all/:storeId", getAllCms);
router.delete("/delete/:id", deleteCms);

export default router;
