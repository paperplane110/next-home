import type { NextConfig } from "next";
import { withContentCollections } from "@content-collections/next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {},

  // static export
  output: "export",
};

export default withContentCollections(nextConfig);
