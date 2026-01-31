import type { NextConfig } from "next";
import { withContentCollections } from "@content-collections/next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    qualities: [50, 75, 90],
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
