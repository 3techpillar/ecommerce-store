import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {string} file - Base64 encoded image or file path
 * @param {Object} options - Additional upload options
 * @param {string} [options.folder] - Cloudinary folder to upload to
 * @param {string} [options.resourceType] - Type of resource (image, raw, etc.)
 * @returns {Promise<string>} - Cloudinary image URL
 */

export const uploadToCloudinary = async (file, options = {}) => {
  const { folder = "default", resourceType = "image" } = options;

  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: resourceType,
    });

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Image upload failed");
  }
};
