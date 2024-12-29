import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@platter/db", "@platter/ui"],
};

export default nextConfig;
