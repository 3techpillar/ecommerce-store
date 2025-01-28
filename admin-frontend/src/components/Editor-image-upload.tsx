"use client";

import { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";

interface ImageUploadButtonProps {
  disabled?: boolean;
  onUpload: (url: string) => void;
}

const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({
  disabled,
  onUpload,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleUpload = (result: any) => {
    onUpload(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <CldUploadWidget onSuccess={handleUpload} uploadPreset="tjjjrspe">
      {({ open }) => {
        const onClick = (e: React.MouseEvent) => {
          e.preventDefault();
          open();
        };

        return (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={onClick}
            className="h-8 w-8 p-1"
          >
            <ImagePlus className="h-4 w-4" />
          </Button>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUploadButton;
