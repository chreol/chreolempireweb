import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CHREOL EMPIRE",
    short_name: "Chreol Empire",
    description: "Cartes cadeaux, crypto et services digitaux au Cameroun.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#0A0A0A",
    orientation: "portrait-primary",
    lang: "fr-CM",
    categories: ["shopping", "finance", "games"],
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/favicon.png", sizes: "32x32", type: "image/png", purpose: "any" },
    ],
  };
}
