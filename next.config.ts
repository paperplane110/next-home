import type { NextConfig } from "next";
import { withContentCollections } from "@content-collections/next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048], // 移除 3840，避免处理过大的图片
    remotePatterns: [
      {
        protocol: "https",
        hostname: "neul1shzddwvm3wd.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      }
    ]
  }
};

export default withContentCollections(nextConfig);
