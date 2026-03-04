import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { GridLoaderComposition } from "@/components/ui/grid-loader-composition";

export const BrandingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo springs in
  const logoScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, mass: 0.7 },
    durationInFrames: 30,
  });
  const logoOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tagline fades in after logo
  const taglineOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0A0A0A",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* GridLoader background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.06,
          transform: "scale(2.5)",
          pointerEvents: "none",
        }}
      >
        <GridLoaderComposition />
      </div>

      {/* FaceDNA text logo */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          marginBottom: 32,
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            fontFamily: "'Roboto Mono', monospace",
            color: "#FFFFFF",
            letterSpacing: -2,
          }}
        >
          Face
          <span style={{ color: "#8BE83B" }}>DNA</span>
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          fontSize: 24,
          fontWeight: 400,
          fontFamily: "'Roboto Mono', monospace",
          color: "rgba(255, 255, 255, 0.6)",
          position: "relative",
        }}
      >
        Face LoRA training from a single image.
      </div>
    </div>
  );
};
