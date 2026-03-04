"use client";

import { useTrainerStore } from "@/store/trainer-store";
import { ROUND_CONFIGS } from "@/types";
import { Badge } from "@/components/ui/badge";

interface RoundProgressProps {
  currentRound: number;
  totalSelected: number;
}

export function RoundProgress({
  currentRound,
  totalSelected,
}: RoundProgressProps) {
  const roundCount = useTrainerStore((s) => s.roundCount);
  const config = ROUND_CONFIGS[currentRound];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">{config?.label}</h2>
        <Badge variant="outline" className="tabular-nums">{totalSelected} images total</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{config?.description}</p>
      <div className="flex gap-1">
        {ROUND_CONFIGS.slice(0, roundCount).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all ${
              i < currentRound
                ? "bg-primary"
                : i === currentRound
                  ? "bg-primary"
                  : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
