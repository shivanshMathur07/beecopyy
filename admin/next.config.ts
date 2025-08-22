import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   typescript: {
      ignoreBuildErrors: true,
    },
    basePath: "/admin",
};

export default nextConfig;
