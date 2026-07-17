import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the dev-tools "N issues" badge so the UI matches the Magica reference exactly
  devIndicators: false,
};

export default nextConfig;
