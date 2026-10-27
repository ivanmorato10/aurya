import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0c111b" }}>
        <svg width="140" height="140" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="17" fill="none" stroke="#e8c48e" strokeOpacity=".6" />
          <path d="M14 29a10 10 0 0 1 20 0Z" fill="#eebb8e" />
          <path d="M10 29h28" stroke="#f4efe6" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
