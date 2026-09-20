import { ImageResponse } from "next/og";

export const alt =
  "House of Merola artwork on ceramic and wood, made in Liverpool";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#16294d",
          color: "#f2e6d6",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: "0.45em",
            color: "#b0862f",
            textTransform: "uppercase",
          }}
        >
          Art for a more magical home
        </div>
        <div
          style={{ display: "flex", fontSize: 96, fontWeight: 700, marginTop: 24 }}
        >
          House of Merola
        </div>
        <div
          style={{ display: "flex", fontSize: 30, marginTop: 20, opacity: 0.9 }}
        >
          House of Merola artwork on ceramic &amp; wood, made by hand in Liverpool
        </div>
      </div>
    ),
    { ...size },
  );
}
