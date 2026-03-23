import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LuxeLoom",
    short_name: "LuxeLoom",
    description:
      "Shop luxury fashion, lifestyle, gifts, plants, candles, and home essentials.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#B39452",
    orientation: "portrait",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo2.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/logo2.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
