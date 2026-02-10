"use client";

import React from "react";
import { Player } from "@remotion/player";
import {
  GridLoaderComposition,
  TOTAL_FRAMES,
} from "@/components/ui/grid-loader-composition";

interface GridLoaderProps {
  size?: number;
  className?: string;
}

export const GridLoader: React.FC<GridLoaderProps> = ({
  size = 200,
  className,
}) => {
  return (
    <Player
      component={GridLoaderComposition}
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
