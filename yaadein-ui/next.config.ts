import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

const config = async () => {
  if (process.env.ANALYZE === "true") {
    // Dynamically import to avoid compile dependency during normal execution
    const withBundleAnalyzer = (await import("@next/bundle-analyzer")).default;
    return withBundleAnalyzer({ enabled: true })(nextConfig);
  }
  return nextConfig;
};

export default config;

