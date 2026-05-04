import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ExhaleJR",
    short_name: "ExhaleJR",
    description: "Personal portfolio and project lab.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/logo/logo-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/logo/logo-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/logo/logo-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
