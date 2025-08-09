// Use dynamic imports based on environment

declare global {
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined;
  var EdgeRuntime: string | undefined;
}

const prismaClientSingleton = () => {
  // Check if we're in an edge runtime
  if (typeof EdgeRuntime === "string" || process.env.NEXT_RUNTIME === "edge") {
    // For edge environments
    const { PrismaClient } = require("@prisma/client/edge");
    return new PrismaClient();
  }

  // For Node.js environments
  const { PrismaClient } = require("@prisma/client");
  return new PrismaClient();
};

const db = globalThis.prisma ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
