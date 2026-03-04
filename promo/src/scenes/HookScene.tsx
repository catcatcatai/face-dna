import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
} from "remotion";
import { AnimatedText } from "../components/AnimatedText";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Photo springs in (0-40 frames)
  const photoScale = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.8 },
    durationInFrames: 40,
  });

  const photoOpacity = interpolate(frame, [0, 25], [0, 1], {
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
      }}
    >
      {/* Source face — var_expressions_001 */}
      <div
        style={{
          width: 320,
          height: 320,
          borderRadius: 16,
          overflow: "hidden",
          transform: `scale(${photoScale})`,
          opacity: photoOpacity,
          border: "2px solid rgba(139, 232, 59, 0.3)",
          boxShadow: "0 0 60px rgba(139, 232, 59, 0.1)",
        }}
      >
        <Img
          src={staticFile("promo/var_expressions_001.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Text */}
      <div style={{ marginTop: 48 }}>
        <AnimatedText
          text="One reference. Fifty-four variations."
          startFrame={45}
          style={{ fontSize: 34, color: "#FFFFFF" }}
        />
      </div>
    </div>
  );
};
