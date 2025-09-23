"use client";

import { useEffect, useState } from "react";

import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import api from "@/lib/axios";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);
    const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

   if (!isMounted) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      setUploading(true);
      const res = await api.post(`/v1/upload/assets`, formData);

      const data = await res.data;
      if (data.success && data.assets) {
        data.assets.forEach((asset: any) => onChange(asset.url));
      } else {
        console.error("Upload failed:", data);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant={"destructive"}
                size={"icon"}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image alt="upload" fill style={{ objectFit: "cover" }} src={url} />
          </div>
        ))}
      </div>
      
         <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={disabled || uploading}
          onChange={handleFileChange}
          // className="hidden"
        />
        {/* <Button type="button" disabled={disabled || uploading}>
          <ImagePlus className="h-4 w-4 mr-2" />
          {uploading ? "Uploading..." : "Upload Images"}
        </Button> */}
      </label>
    </div>
  );
};

export default ImageUpload;
