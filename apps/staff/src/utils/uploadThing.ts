import {
  generateReactHelpers,
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton: ReturnType<
  typeof generateUploadButton<OurFileRouter>
> = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export const { useUploadThing } = generateReactHelpers<OurFileRouter>();

// Convenience hooks for specific uploaders
export const useCategoryImageUploader = () =>
  generateReactHelpers<OurFileRouter>().useUploadThing("categoryImageUploader");
export const useMenuItemImageUploader = () =>
  generateReactHelpers<OurFileRouter>().useUploadThing("menuItemImageUploader");
