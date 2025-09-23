import fs from "fs";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const uploadController = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const uploadPromises = req.files.map(async (file) => {
      const result = await uploadToCloudinary(file.path, "khajanchi_assets");

      // Remove temp file after upload
      fs.unlinkSync(file.path);

      return {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        bytes: result.bytes,
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      assets: uploadedFiles,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ success: false, message: "File upload failed", error });
  }
};
