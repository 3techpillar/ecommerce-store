"use client";

import { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { getAssetType } from "@/lib/getAssetType";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string[]) => void; // Accepts an array of strings
  onRemove: (value: string) => void;
  value: string[]; // Array of image URLs
}

const ProductImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [images, setImages] = useState(value);
  const [isMounted, setIsMounted] = useState(false);

  console.log("images", images)

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    const newImageUrl = result.info.secure_url;
    console.log("Uploading image:", newImageUrl);
    // Update both local state and parent state with new image URL
    setImages((prevImages) => {
      const updatedImages = [...prevImages, newImageUrl];
      onChange(updatedImages);
      return updatedImages;
    });
  };

  

  const handleRemoveImage = (url: string) => {
    // Update both local state and parent state to remove the image URL
    setImages((prevImages) => {
      const updatedImages = prevImages.filter((image) => image !== url);
      onChange(updatedImages);
      return updatedImages;
    });
    onRemove(url); // Call onRemove to notify parent component
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {images.map((url) => {
           const type = getAssetType(url)
           console.log("type", type)
          return (
            <div
            key={url}
            className="relative w-[200px] h-[200px] overflow-hidden"
          >
            <div className="absolute z-10 top-2 right-2">
              <Button
                onClick={() => handleRemoveImage(url)}
                variant="destructive"
                size="icon"
              >
                <Trash />
              </Button>
            </div>
            {type === "image" && (
              <Image fill className="object-cover" alt="Image" src={url} />
            )}
            {type === "video" && (
              <video
                className="object-cover w-full h-full rounded-md"
                src={url}
                autoPlay
                muted
                loop
                playsInline
              />
            )}
          </div>
          )
        })}
      </div>
      <CldUploadWidget onSuccess={onUpload} uploadPreset="tjjjrspe">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button type="button" disabled={disabled} onClick={onClick}>
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ProductImageUpload;