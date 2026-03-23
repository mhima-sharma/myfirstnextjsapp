import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* other config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["res.cloudinary.com"], 
  },
};

export default nextConfig;
