export function getAssetType(url: string): "image" | "video" {
  if (!url) return "image";

  const lowerUrl = url.toLowerCase();

  // Check Cloudinary resource type in URL
  if (lowerUrl.includes("/video/")) return "video";
  if (lowerUrl.includes("/image/")) return "image";

  // Fallback: check file extension
  const cleanUrl = lowerUrl.split("?")[0]; // remove query params
  const extension = cleanUrl.split(".").pop();

  switch (extension) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
    case "svg":
      return "image";
    case "mp4":
    case "webm":
    case "ogg":
    case "mov":
      return "video";
    default:
      return "image"; // default fallback
  }
}
