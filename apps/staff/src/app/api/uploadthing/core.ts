import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getCurrentStaff } from "@/utils/auth";

const f = createUploadthing();

const auth = async () => {
  const staff = await getCurrentStaff();
  return staff ? { id: staff.id, restaurantId: staff.restaurantId } : null;
};

export const ourFileRouter: FileRouter = {
  // Category image uploader for staff
  categoryImageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const user = await auth();
      if (!user) throw new UploadThingError("Unauthorized");
      return {
        staffId: user.id,
        restaurantId: user.restaurantId,
        type: "category",
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.staffId, fileUrl: file.url };
    }),
  // Menu item image uploader for staff
  menuItemImageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const user = await auth();
      if (!user) throw new UploadThingError("Unauthorized");
      return {
        staffId: user.id,
        restaurantId: user.restaurantId,
        type: "menuItem",
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.staffId, fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
