import type { NextConfig } from "next";
import { withContentCollections } from "@content-collections/next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: "./"
  }
};

export default withContentCollections(nextConfig);
