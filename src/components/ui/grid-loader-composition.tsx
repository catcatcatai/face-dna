"use client";

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  Loop,
  spring,
} from "remotion";

// === LAYOUT ===
const GRID_SIZE = 3;
const CELL_SIZE = 126;
const GAP = 21;
const CELL_RADIUS = 21;
const FILL_COLOR = "#8BE83B";
const STROKE_WIDTH = 2;
const SOURCE_STROKE_WIDTH = 3;
const SOURCE_PREFILL = 0.12;
const GRID_TOTAL = GRID_SIZE * CELL_SIZE + (GRID_SIZE - 1) * GAP;

// === EASING ===
const SNAP_IN = Easing.bezier(0.175, 0.885, 0.32, 1.275);
const SNAP_EXIT = Easing.bezier(0.55, 0.085, 0.68, 0.53);

// === TYPES ===
type CellPos = { row: number; col: number };

// === ORDERING ===
const SPAWN_ORDER: CellPos[] = [
  { row: 0, col: 1 }, { row: 1, col: 2 }, { row: 2, col: 1 }, { row: 1, col: 0 },
  { row: 0, col: 0 }, { row: 0, col: 2 }, { row: 2, col: 2 }, { row: 2, col: 0 },
];

const FILL_ORDER: CellPos[] = [
  { row: 1, col: 1 },
  { row: 0, col: 1 }, { row: 1, col: 2 }, { row: 2, col: 1 }, { row: 1, col: 0 },
  { row: 0, col: 0 }, { row: 0, col: 2 }, { row: 2, col: 2 }, { row: 2, col: 0 },
];

// === TIMING (120fps) ===
const ARRIVE_DURATION = 48;

const PULSE_START = ARRIVE_DURATION + 20;
const PULSE_DURATION = 36;

const SPAWN_START = PULSE_START + 12;
const SPAWN_PER_CELL = 10;
const SPAWN_DURATION = 40;
const SPAWN_SETTLE = 32;
const SPAWN_ALL_DONE = SPAWN_START + 7 * SPAWN_PER_CELL + SPAWN_DURATION + SPAWN_SETTLE;

const FILL_START = SPAWN_ALL_DONE + 16;
const FILL_PER_CELL = 14;
const FILL_DURATION = 32;
const KNOCK_DISTANCE = 18;
const KNOCK_DURATION = 48;
const FILL_ALL_DONE = FILL_START + 8 * FILL_PER_CELL + FILL_DURATION;

const MERGE_START = FILL_ALL_DONE + 40;
const MERGE_DURATION = 48;
const MERGE_END = MERGE_START + MERGE_DURATION;
const BOUNCE_SETTLE = 56;

const EXIT_START = MERGE_END + BOUNCE_SETTLE;
const EXIT_DURATION = 56;
const EXIT_END = EXIT_START + EXIT_DURATION;
const LOOP_GAP = 24;
export const TOTAL_FRAMES = EXIT_END + LOOP_GAP;

// === HELPERS ===
const isCenterCell = (row: number, col: number) => row === 1 && col === 1;

const getCellOffset = (row: number, col: number) => {
  const stride = CELL_SIZE + GAP;
  return { x: (col - 1) * stride, y: (row - 1) * stride };
};

const getSpawnIndex = (row: number, col: number): number =>
  SPAWN_ORDER.findIndex((p) => p.row === row && p.col === col);

const getFillIndex = (row: number, col: number): number =>
  FILL_ORDER.findIndex((p) => p.row === row && p.col === col);

const getKnockDir = (row: number, col: number) => {
  const dx = col - 1;
  const dy = row - 1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return { dx: dx / len, dy: dy / len };
};

// === PULSE RING ===
const PulseRing: React.FC<{ frame: number }> = ({ frame }) => {
  const progress = interpolate(
    frame,
    [PULSE_START, PULSE_START + PULSE_DURATION + 24],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) },
  );

  if (progress <= 0) return null;

  const size = interpolate(progress, [0, 1], [CELL_SIZE * 0.6, GRID_TOTAL * 2]);
  const opacity = interpolate(progress, [0, 0.2, 1], [0.5, 0.35, 0]);
  const borderW = interpolate(progress, [0, 1], [2.5, 0.5]);

  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        border: `${borderW}px solid ${FILL_COLOR}`,
        opacity,
        left: CELL_SIZE / 2,
        top: CELL_SIZE / 2,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
    />
  );
};

// === CELL ===
const Cell: React.FC<{ pos: CellPos; frame: number; fps: number; mergeProgress: number }> = ({
  pos, frame, fps, mergeProgress,
}) => {
  const { row, col } = pos;
  const center = isCenterCell(row, col);
  const offset = getCellOffset(row, col);
  const fillIndex = getFillIndex(row, col);
  const knock = getKnockDir(row, col);

  // ==============================
  // ENTRANCE
  // ==============================
  let entranceX = 0;
  let entranceY = 0;
  let entranceScale = 1;
  let entranceRot = 0;
  let entranceOpacity = 1;
  let preFill = 0;

  if (center) {
    const arriveSpring = spring({
      frame,
      fps,
      config: { stiffness: 200, damping: 18, mass: 1 },
    });
    entranceScale = arriveSpring;
    entranceOpacity = frame < 2 ? 0 : Math.min(arriveSpring * 2, 1);
    preFill = SOURCE_PREFILL * Math.min(arriveSpring, 1);

    const pulseT = interpolate(
      frame,
      [PULSE_START, PULSE_START + PULSE_DURATION],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    const pulseBump = pulseT <= 0 ? 0 :
      Math.sin(pulseT * Math.PI) * 0.18 * Math.exp(-pulseT * 1.5);
    entranceScale = arriveSpring * (1 + pulseBump);
  } else {
    const spawnIndex = getSpawnIndex(row, col);
    const spawnCellStart = SPAWN_START + spawnIndex * SPAWN_PER_CELL;

    const spawnSpring = frame < spawnCellStart ? 0 : spring({
      frame: frame - spawnCellStart,
      fps,
      config: { stiffness: 280, damping: 22, mass: 0.8 },
    });

    entranceX = interpolate(spawnSpring, [0, 1], [-offset.x, 0]);
    entranceY = interpolate(spawnSpring, [0, 1], [-offset.y, 0]);

    entranceScale = frame < spawnCellStart ? 0 :
      interpolate(spawnSpring, [0, 1], [0.3, 1]);

    const targetAngle = (col - 1 - (row - 1)) * 15;
    entranceRot = frame < spawnCellStart ? 0 :
      interpolate(spawnSpring, [0, 1], [targetAngle, 0]);

    entranceOpacity = frame < spawnCellStart ? 0 :
      Math.min(spawnSpring * 3, 1);
  }

  // ==============================
  // FILL (radial wave from center)
  // ==============================
  const cellFillStart = FILL_START + fillIndex * FILL_PER_CELL;
  const fillProgress = interpolate(
    frame,
    [cellFillStart, cellFillStart + FILL_DURATION],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SNAP_IN },
  );

  const popT = interpolate(
    frame,
    [cellFillStart, cellFillStart + FILL_DURATION],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const fillPop = popT <= 0 ? 1 : 1 + 0.15 * Math.sin(popT * Math.PI) * Math.exp(-popT * 2);

  const knockDist = center ? 0 : KNOCK_DISTANCE;
  const knockT = interpolate(
    frame,
    [cellFillStart, cellFillStart + KNOCK_DURATION],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const knockWave = knockT <= 0 ? 0 :
    Math.sin(knockT * Math.PI * 2) * Math.exp(-knockT * 4);
  const knockX = knock.dx * knockDist * knockWave;
  const knockY = knock.dy * knockDist * knockWave;

  const bgOpacity = Math.max(preFill, fillProgress);

  // ==============================
  // MERGE
  // ==============================
  const gapClose = Math.min(mergeProgress, 1);

  const MERGED_CELL = GRID_TOTAL / GRID_SIZE;
  const OVERLAP = 1.5;
  const cellWidth = interpolate(gapClose, [0, 1], [CELL_SIZE, MERGED_CELL + OVERLAP]);
  const cellHeight = interpolate(gapClose, [0, 1], [CELL_SIZE, MERGED_CELL + OVERLAP]);

  const currentStride = interpolate(gapClose, [0, 1], [CELL_SIZE + GAP, MERGED_CELL]);
  const gapShiftX = (col - 1) * (currentStride - (CELL_SIZE + GAP));
  const gapShiftY = (row - 1) * (currentStride - (CELL_SIZE + GAP));

  const isTop = row === 0;
  const isBottom = row === 2;
  const isLeft = col === 0;
  const isRight = col === 2;
  const MERGED_RADIUS = Math.round(GRID_TOTAL * (CELL_RADIUS / CELL_SIZE));
  const outerR = interpolate(gapClose, [0, 1], [CELL_RADIUS, MERGED_RADIUS]);
  const innerR = interpolate(gapClose, [0, 1], [CELL_RADIUS, 0]);

  const tl = (isTop && isLeft) ? outerR : innerR;
  const tr = (isTop && isRight) ? outerR : innerR;
  const bl = (isBottom && isLeft) ? outerR : innerR;
  const br = (isBottom && isRight) ? outerR : innerR;

  const baseBorder = center
    ? interpolate(gapClose, [0, 0.3], [SOURCE_STROKE_WIDTH, STROKE_WIDTH], { extrapolateRight: "clamp" })
    : STROKE_WIDTH;

  const borderTop = isTop ? baseBorder : interpolate(gapClose, [0, 0.4], [baseBorder, 0], { extrapolateRight: "clamp" });
  const borderBottom = isBottom ? baseBorder : interpolate(gapClose, [0, 0.4], [baseBorder, 0], { extrapolateRight: "clamp" });
  const borderLeft = isLeft ? baseBorder : interpolate(gapClose, [0, 0.4], [baseBorder, 0], { extrapolateRight: "clamp" });
  const borderRight = isRight ? baseBorder : interpolate(gapClose, [0, 0.4], [baseBorder, 0], { extrapolateRight: "clamp" });

  // ==============================
  // COMPOSITE
  // ==============================
  const totalX = offset.x + entranceX + knockX + gapShiftX;
  const totalY = offset.y + entranceY + knockY + gapShiftY;
  const totalScale = entranceScale * fillPop;

  const glowOpacity = bgOpacity * (1 + gapClose * 0.5);
  const glow = [
    `0 0 ${8 + gapClose * 6}px rgba(139, 232, 59, ${0.4 * glowOpacity})`,
    `0 0 ${16 + gapClose * 12}px rgba(139, 232, 59, ${0.2 * glowOpacity})`,
    `0 0 ${30 + gapClose * 20}px rgba(139, 232, 59, ${0.1 * glowOpacity})`,
  ].join(", ");

  return (
    <div
      style={{
        position: "absolute",
        width: cellWidth,
        height: cellHeight,
        borderRadius: `${tl}px ${tr}px ${br}px ${bl}px`,
        borderTop: `${borderTop}px solid ${FILL_COLOR}`,
        borderBottom: `${borderBottom}px solid ${FILL_COLOR}`,
        borderLeft: `${borderLeft}px solid ${FILL_COLOR}`,
        borderRight: `${borderRight}px solid ${FILL_COLOR}`,
        backgroundColor: `rgba(139, 232, 59, ${bgOpacity})`,
        boxShadow: glow,
        transform: `translate(${totalX}px, ${totalY}px) scale(${totalScale}) rotate(${entranceRot}deg)`,
        transformOrigin: "center center",
        opacity: entranceOpacity,
        boxSizing: "border-box",
      }}
    />
  );
};

// === MAIN ===
const GridLoaderInner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cells: CellPos[] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      cells.push({ row, col });
    }
  }

  const mergeProgress = interpolate(
    frame,
    [MERGE_START, MERGE_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) },
  );

  const mergeSpring = frame < MERGE_END ? 0 : spring({
    frame: frame - MERGE_END,
    fps,
    config: {
      stiffness: 800,
      damping: 20,
      mass: 0.8,
      overshootClamping: false,
    },
  });
  const mergeBounce = 1 + (mergeSpring - 1) * 0.1;

  const exitProgress = interpolate(
    frame,
    [EXIT_START, EXIT_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SNAP_EXIT },
  );

  const exitScale = interpolate(exitProgress, [0, 0.4, 0.6, 1], [1, 1.04, 0.85, 0]);
  const exitOpacity = interpolate(exitProgress, [0.3, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitRotation = interpolate(exitProgress, [0, 1], [0, 6]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: CELL_SIZE,
          height: CELL_SIZE,
          transform: `scale(${exitScale * mergeBounce}) rotate(${exitRotation}deg)`,
          opacity: exitOpacity,
        }}
      >
        <PulseRing frame={frame} />
        {cells.map((pos) => (
          <Cell
            key={`${pos.row}-${pos.col}`}
            pos={pos}
            frame={frame}
            fps={fps}
            mergeProgress={mergeProgress}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const GridLoaderComposition: React.FC = () => {
  return (
    <Loop durationInFrames={TOTAL_FRAMES}>
      <GridLoaderInner />
    </Loop>
  );
};
