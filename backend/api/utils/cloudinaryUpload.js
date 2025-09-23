import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (filePath, folder = "khajanchi_assets") => {
  const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(filePath);

  if (isVideo) {
    return await cloudinary.uploader.upload_large(filePath, {
      folder,
      resource_type: "video",
      chunk_size: 6000000, 
      transformation: [
        { quality: "auto", fetch_format: "mp4" }, 
        { width: 1280, height: 720, crop: "limit" },
      ],
    });
  }

  return await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "auto",
    transformation: [
      { quality: "auto", fetch_format: "jpg" }, 
    ],
  });
};
