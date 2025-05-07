import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["img.freepik.com", "asset.cloudinary.com", "res.cloudinary.com"],
  },
  typescript: {
    ignoreBuildErrors: true
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
