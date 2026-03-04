"use client";

import React from "react";
import { Player } from "@remotion/player";
import {
  GridLoader2Composition,
  TOTAL_FRAMES,
} from "@/components/ui/grid-loader2-composition";

interface GridLoader2Props {
  size?: number;
  className?: string;
}

const inputProps = { fillColor: "#111" };

export const GridLoader2: React.FC<GridLoader2Props> = ({
  size = 200,
  className,
}) => {
  return (
    <Player
      component={GridLoader2Composition}
      inputProps={inputProps}
      compositionWidth={500}
      compositionHeight={500}
      durationInFrames={TOTAL_FRAMES}
      fps={120}
      loop
      autoPlay
      style={{ width: size, height: size }}
      className={className}
    />
  );
};
