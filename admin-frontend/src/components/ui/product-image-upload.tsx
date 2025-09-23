"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { getAssetType } from "@/lib/getAssetType";
import api from "@/lib/axios";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string[]) => void; 
  onRemove: (value: string) => void;
  value: string[];
}

const ProductImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [images, setImages] = useState<string[]>(value);
  const [isMounted, setIsMounted] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      setUploading(true);
      const res = await api.post(`/v1/upload/assets`,formData);

      const data = await res.data;
      if (data.success && data.assets) {
        const urls = data.assets.map((asset: any) => asset.url);
        setImages((prev) => {
          const updated = [...prev, ...urls];
          onChange(updated);
          return updated;
        });
      } else {
        console.error("Upload failed:", data);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  
  const handleRemove = (url: string) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img !== url);
      onChange(updated);
      return updated;
    });
    onRemove(url);
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-4">
      
      <div className="flex flex-wrap gap-4">
        {images.map((url) => {
          const type = getAssetType(url);
          return (
            <div
              key={url}
              className="relative w-[180px] h-[180px] rounded-lg overflow-hidden border shadow-sm"
            >
              <div className="absolute top-2 right-2 z-10">
                <Button
                  type="button"
                  onClick={() => handleRemove(url)}
                  variant="destructive"
                  size="icon"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              {type === "image" && (
                <Image
                  fill
                  className="object-cover"
                  alt="Product image"
                  src={url}
                />
              )}
              {type === "video" && (
                <video
                  className="w-full h-full object-cover rounded-md"
                  src={url}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )}
            </div>
          );
        })}
      </div>

     
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          disabled={disabled || uploading}
          onChange={handleFileChange}
          // className="hidden"
        />
        {/* <Button type="button" disabled={disabled || uploading}>
          <ImagePlus className="h-4 w-4 mr-2" />
          {uploading ? "Uploading..." : "Upload Images / Videos"}
        </Button> */}
      </label>
    </div>
  );
};

export default ProductImageUpload;
