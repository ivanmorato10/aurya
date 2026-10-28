import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Mesmo desenho do icon.svg, rasterizado para a tela inicial do iPhone (cantos aplicados pelo iOS).
export default async function AppleIcon() {
  const svg = await readFile(path.join(process.cwd(), "src/app/icon.svg"), "utf8");
  const square = svg.replace(/<path d="M32 0C55[^"]*" fill="url\(#g\)"\/>/, '<rect width="64" height="64" fill="url(#g)"/>');
  const src = `data:image/svg+xml;base64,${Buffer.from(square).toString("base64")}`;
  return new ImageResponse(
    (
      <img src={src} width={180} height={180} alt="" />
    ),
    size,
  );
}
