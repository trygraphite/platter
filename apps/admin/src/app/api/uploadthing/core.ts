import getServerSession from "@/lib/auth/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";


const f = createUploadthing();

// Auth function to get current user
const auth = async (req: Request) => {
  const session = await getServerSession();
  return session?.user ? { id: session.user.id } : null;
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter: FileRouter = {
  // Category image uploader
  categoryImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id, type: "category" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // console.log("Category image upload complete for userId:", metadata.userId);
      // console.log("file url", file.url);
      return { uploadedBy: metadata.userId, fileUrl: file.url };
    }),

  // Menu item image uploader
  menuItemImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id, type: "menuItem" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // console.log("Menu item image upload complete for userId:", metadata.userId);
      // console.log("file url", file.url);
      return { uploadedBy: metadata.userId, fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;