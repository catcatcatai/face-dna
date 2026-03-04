import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PromoImage } from "./PromoImage";

interface FaceGridProps {
  /** Image paths (resolved via staticFile). Provide up to 9. */
  images?: string[];
  /** Fallback label prefix for placeholder cells */
  label?: string;
  /** Frames between each cell's entrance (stagger). Default: 3 */
  staggerDelay?: number;
  /** Cell size in pixels. Default: 200 */
  cellSize?: number;
  /** Gap between cells in pixels. Default: 12 */
  gap?: number;
}

export const FaceGrid: React.FC<FaceGridProps> = ({
  images,
  label,
  staggerDelay = 3,
  cellSize = 200,
  gap = 12,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gridSize = cellSize * 3 + gap * 2;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(3, ${cellSize}px)`,
        gap,
        width: gridSize,
      }}
    >
      {Array.from({ length: 9 }).map((_, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const delay = (row + col) * staggerDelay;

        const scale = spring({
          frame: frame - delay,
          fps,
          config: { damping: 12, mass: 0.6, stiffness: 100 },
        });

        const opacity = interpolate(frame - delay, [0, 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              width: cellSize,
              height: cellSize,
              borderRadius: 12,
              overflow: "hidden",
              transform: `scale(${scale})`,
              opacity,
              border: "1px solid rgba(139, 232, 59, 0.15)",
            }}
          >
            <PromoImage
              src={images?.[i] || `promo/face-${i + 1}.png`}
              label={label ? `${label} ${i + 1}` : `Cell ${i + 1}`}
            />
          </div>
        );
      })}
    </div>
  );
};
