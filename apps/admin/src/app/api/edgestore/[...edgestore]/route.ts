import getServerSession from "@/lib/auth/server";
import { initEdgeStore } from "@edgestore/server";
import {
  CreateContextOptions,
  createEdgeStoreNextHandler,
} from "@edgestore/server/adapters/next/app";
import { z } from "zod";

  const session = await getServerSession();

// Define the Context type
type Context = {
  userId: string;
};

// Create context function
function createContext({ req }: CreateContextOptions): Context {

  return {
    userId: session?.user?.id || "user-id",
  };
}

// Initialize EdgeStore with context
const es = initEdgeStore.context<Context>().create();

/**
 * This is the main router for the Edge Store buckets.
 */
const edgeStoreRouter: any = es.router({
  publicFiles: es
.imageBucket({
      maxSize: 1024 * 1024 * 1, // 1MB
    })    .input(
      z.object({
        type: z.enum(["Platter-menuItem"]),
      }),
    )
    .path(({ input }) => [{ type: input.type }]),
});

// Create handler with context
const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
});

export { handler as GET, handler as POST };

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;