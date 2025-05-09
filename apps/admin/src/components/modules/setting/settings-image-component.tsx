"use client";

import { useState, useRef } from "react";
import { Button } from "@platter/ui/components/button";
import { Label } from "@platter/ui/components/label";
import { Upload, X, Loader2, Info } from "lucide-react";
import Image from "next/image";
import { toast } from "@platter/ui/components/sonner";
import { useEdgeStore } from "@/lib/edgestore/edgestore";

interface ImageUploadProps {
  id: string;
  label: string;
  description?: string;
  initialImage?: string | null;
  imageType: "restaurant-icon" | "restaurant-cover";
  isCircular?: boolean;
  onImageChange: (url: string | null) => void;
}

export default function ImageUpload({
  id,
  label,
  description,
  initialImage,
  imageType,
  isCircular = false,
  onImageChange,
}: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const { edgestore } = useEdgeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    const maxSizeInMB = 5;
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    if (file.size > maxSizeInMB * 1024 * 1024) {
      toast.error(`Image size should be less than ${maxSizeInMB}MB`);
      return;
    }

    try {
      setIsUploading(true);

      if (!edgestore?.publicFiles) {
        throw new Error("EdgeStore not initialized");
      }

      // Upload with the appropriate type
      const res = await edgestore.publicFiles.upload({
        file,
        input: { type: imageType },
        options: {
          // If we have a previous image, replace it
          replaceTargetUrl: image || undefined,
        },
      });

      setImage(res.url);
      onImageChange(res.url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = async () => {
    if (!image) return;

    try {
      setIsUploading(true);

      if (edgestore?.publicFiles) {
        // Delete the image from EdgeStore
        await edgestore.publicFiles.delete({
          url: image,
        });
      }

      setImage(null);
      onImageChange(null);
      toast.success("Image removed successfully!");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex flex-col gap-3">
        <div
          className={`relative ${
            isCircular
              ? "h-24 w-24 rounded-full mx-auto"
              : "h-56 w-full rounded-md"
          } border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center`}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
          ) : image ? (
            <>
              <Image
                src={image}
                alt={label}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-red-500 rounded-full p-1 shadow-sm"
                aria-label="Remove image"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </>
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            id={id}
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : image ? (
              "Change Image"
            ) : (
              "Upload Image"
            )}
          </Button>
          {image && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemoveImage}
              disabled={isUploading}
            >
              Remove
            </Button>
          )}
        </div>

        {description && (
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Info className="size-3" />
            {description}
          </p>
        )}
      </div>
    </div>
  );
}