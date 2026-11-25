import type { MetadataRoute } from "next";

// The site is not an app: no service worker, so `display: "browser"` (it opens as a tab).
// The colors are the wall (#FAFAF7), HANDOFF § 5; a manifest cannot read CSS variables.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "César León",
    short_name: "César León",
    start_url: "/",
    display: "browser",
    theme_color: "#FAFAF7",
    background_color: "#FAFAF7",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
