import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@platter/db", "@platter/ui"],
  images: {
    remotePatterns: [],
    domains: ["files.edgestore.dev"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },
};

export default nextConfig;
