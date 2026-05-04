import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Legacy paths from the pre-rename IA.
      { source: "/lab", destination: "/drawingboard", permanent: true },
      { source: "/lab/:slug*", destination: "/drawingboard/:slug*", permanent: true },
    ];
  },
};

export default nextConfig;
