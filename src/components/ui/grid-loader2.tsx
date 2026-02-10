"use client";

import React, { useMemo } from "react";
import { Player } from "@remotion/player";
import {
  GridLoader2Composition,
  TOTAL_FRAMES,
} from "@/components/ui/grid-loader2-composition";
import { useAccentStore } from "@/store/accent-store";
import { primaryHexForHue } from "@/lib/color";

interface GridLoader2Props {
  size?: number;
  className?: string;
}

export const GridLoader2: React.FC<GridLoader2Props> = ({
  size = 200,
  className,
}) => {
  const hue = useAccentStore((s) => s.hue);
  const chroma = useAccentStore((s) => s.chroma);
  const inputProps = useMemo(() => ({ fillColor: primaryHexForHue(hue, chroma) }), [hue, chroma]);

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
