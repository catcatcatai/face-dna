import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
} from "remotion";

// All 54 variations organized by round (6 rows x 9 cols)
const ROUNDS = [
  { name: "expressions", start: 1 },
  { name: "angles", start: 10 },
  { name: "outfits", start: 19 },
  { name: "reinforcement", start: 28 },
  { name: "accessories", start: 37 },
  { name: "activities", start: 46 },
];

const ALL_IMAGES = ROUNDS.flatMap((round) =>
  Array.from({ length: 9 }, (_, i) => ({
    src: `promo/var_${round.name}_${String(round.start + i).padStart(3, "0")}.png`,
    round: round.name,
  })),
);

const COLS = 9;
const ROWS = 6;
const CELL_SIZE = 152;
const GAP = 6;
const GRID_W = COLS * CELL_SIZE + (COLS - 1) * GAP;
const GRID_H = ROWS * CELL_SIZE + (ROWS - 1) * GAP;

// Stagger timing
const ENTRY_DELAY = 10;
const ROW_STAGGER = 18;
const COL_STAGGER = 3;

export const MultiplicationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Whole grid fades in slightly
  const gridOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0A0A0A",
        opacity: gridOpacity,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
          gap: GAP,
          width: GRID_W,
          height: GRID_H,
        }}
      >
        {ALL_IMAGES.map((img, i) => {
          const row = Math.floor(i / COLS);
          const col = i % COLS;
          const delay = ENTRY_DELAY + row * ROW_STAGGER + col * COL_STAGGER;
          const isSource = i === 0; // var_expressions_001

          const scale = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12, mass: 0.4, stiffness: 140 },
          });

          const opacity = interpolate(frame - delay, [0, 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                borderRadius: 8,
                overflow: "hidden",
                transform: `scale(${scale})`,
                opacity,
                border: isSource
                  ? "2px solid rgba(139, 232, 59, 0.6)"
                  : "1px solid rgba(255, 255, 255, 0.06)",
                boxShadow: isSource
                  ? "0 0 20px rgba(139, 232, 59, 0.15)"
                  : "none",
              }}
            >
              <Img
                src={staticFile(img.src)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
