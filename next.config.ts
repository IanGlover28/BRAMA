import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Prisma (and its query engine binary) unbundled so it loads correctly
  // on serverless hosts like Vercel.
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;