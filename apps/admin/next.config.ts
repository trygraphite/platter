import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@platter/db", "@platter/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
      },
      {
        protocol: "https",
        hostname: "files.edgestore.dev", 
      },
    ],
  },
};

export default nextConfig;
