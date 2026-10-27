import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AURYA · um instante de presença",
    short_name: "AURYA",
    description: "Uma afirmação para cada momento do seu dia.",
    start_url: "/hoje",
    display: "standalone",
    background_color: "#0c111b",
    theme_color: "#0c111b",
    lang: "pt-BR",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
