"use client";

import React, { useMemo } from "react";
import { Player } from "@remotion/player";
import {
  GridLoaderComposition,
  TOTAL_FRAMES,
} from "@/components/ui/grid-loader-composition";
import { useAccentStore } from "@/store/accent-store";
import { primaryHexForHue } from "@/lib/color";

interface GridLoaderProps {
  size?: number;
  className?: string;
}

export const GridLoader: React.FC<GridLoaderProps> = ({
  size = 200,
  className,
}) => {
  const hue = useAccentStore((s) => s.hue);
  const chroma = useAccentStore((s) => s.chroma);
  const inputProps = useMemo(() => ({ fillColor: primaryHexForHue(hue, chroma) }), [hue, chroma]);

  return (
    <Player
      component={GridLoaderComposition}
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
