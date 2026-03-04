import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { PromoImage } from "../components/PromoImage";

// 4 LoRA output images — placeholders until real ones are generated
const OUTPUTS = [
  { src: "promo/output_1.png", label: "Output 1" },
  { src: "promo/output_2.png", label: "Output 2" },
  { src: "promo/output_3.png", label: "Output 3" },
  { src: "promo/output_4.png", label: "Output 4" },
];

const CELL_SIZE = 340;
const GAP = 16;
const REVEAL_STAGGER = 25; // frames between each image reveal

export const PayoffScene: React.FC = () => {
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
      }}
    >
      {/* 2x2 grid of LoRA outputs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(2, ${CELL_SIZE}px)`,
          gap: GAP,
        }}
      >
        {OUTPUTS.map((output, i) => {
          const delay = 15 + i * REVEAL_STAGGER;

          const scale = spring({
            frame: frame - delay,
            fps,
            config: { damping: 14, mass: 0.6 },
            durationInFrames: 30,
          });

          const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                borderRadius: 12,
                overflow: "hidden",
                transform: `scale(${scale})`,
                opacity,
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <PromoImage src={output.src} label={output.label} />
            </div>
          );
        })}
      </div>

      {/* Text — appears after all 4 images are revealed */}
      <div style={{ marginTop: 40 }}>
        <AnimatedText
          text="Identity preserved."
          startFrame={15 + OUTPUTS.length * REVEAL_STAGGER + 20}
          style={{ fontSize: 32, color: "#8BE83B" }}
        />
      </div>
    </div>
  );
};
