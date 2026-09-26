import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ShelfTrack",
    short_name: "ShelfTrack",
    description: "Capture and review supermarket shelf visits.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f4f1e9",
    theme_color: "#10231f",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
