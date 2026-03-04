import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

const LINES = ["54 images.", "One LoRA.", "Minutes."];
const LINE_STAGGER = 20; // frames between each line

export const CountScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
        gap: 16,
      }}
    >
      {LINES.map((line, i) => {
        const delay = 15 + i * LINE_STAGGER;

        const scale = spring({
          frame: frame - delay,
          fps,
          config: { damping: 14, mass: 0.7 },
          durationInFrames: 25,
        });

        const opacity = interpolate(frame - delay, [0, 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              fontSize: i === 0 ? 56 : 40,
              fontWeight: i === 0 ? 700 : 500,
              fontFamily: "'Roboto Mono', monospace",
              color: i === 0 ? "#8BE83B" : "rgba(255, 255, 255, 0.85)",
              transform: `scale(${scale})`,
              opacity,
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};
