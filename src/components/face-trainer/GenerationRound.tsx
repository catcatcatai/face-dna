"use client";

import { useEffect, useState } from "react";
import { useTrainerStore } from "@/store/trainer-store";
import { ROUND_CONFIGS } from "@/types";
import { Button } from "@/components/ui/button";
import { ImageGrid } from "./ImageGrid";
import { AlertCircle, CheckCircle2, RefreshCw, ArrowRight, Loader2 } from "lucide-react";
import { GridLoader2 } from "@/components/ui/grid-loader2";
import { toast } from "sonner";

const TOTAL_CELLS = 9;

function useProgressiveReveal(active: boolean) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (!active) {
      setRevealed(0);
      return;
    }
    if (revealed >= TOTAL_CELLS) return;
    const timer = setTimeout(
      () => setRevealed((prev) => prev + 1),
      3500 + Math.random() * 3000
    );
    return () => clearTimeout(timer);
  }, [active, revealed]);

  return revealed;
}

function ShimmerCell({ resolved, index }: { resolved: boolean; index: number }) {
  return (
    <div
      className={`relative aspect-square overflow-hidden rounded-lg transition-all duration-700 ${
        resolved
          ? "bg-[var(--surface-2)] border-2 border-[var(--cat-accent)]"
          : "bg-[var(--surface-2)]/40"
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      {!resolved && (
        <div className="absolute inset-0 bg-[var(--surface-2)]">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(110deg, transparent 30%, rgba(0,0,0,0.04) 50%, transparent 70%)",
              backgroundSize: "200% 100%",
              animation: "shimmer-sweep 1.8s ease-in-out infinite",
              animationDelay: `${index * 150}ms`,
            }}
          />
        </div>
      )}
      {resolved && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface)]">
          <span className="text-xs font-medium text-[var(--text-dim)]/50">
            {index + 1}
          </span>
        </div>
      )}
    </div>
  );
}

export function GenerationRound() {
  const currentRoundIndex = useTrainerStore((s) => s.currentRoundIndex);
  const gridResults = useTrainerStore((s) => s.gridResults);
  const isGenerating = useTrainerStore((s) => s.isGenerating);
  const generationError = useTrainerStore((s) => s.generationError);
  const generateRound = useTrainerStore((s) => s.generateRound);
  const toggleImageSelection = useTrainerStore((s) => s.toggleImageSelection);
  const roundCount = useTrainerStore((s) => s.roundCount);
  const regenerateRound = useTrainerStore((s) => s.regenerateRound);
  const confirmRound = useTrainerStore((s) => s.confirmRound);

  const [isConfirming, setIsConfirming] = useState(false);
  const revealed = useProgressiveReveal(isGenerating);

  const currentGrid = gridResults[currentRoundIndex];
  const roundConfig = ROUND_CONFIGS[currentRoundIndex];
  const selectedInRound = currentGrid?.croppedImages.filter((img) => img.selected).length ?? 0;
  const totalInRound = currentGrid?.croppedImages.length ?? 9;

  // Total selected across all rounds
  const totalSelected = gridResults.reduce((sum, grid) => {
    if (!grid) return sum;
    return sum + grid.croppedImages.filter((img) => img.selected).length;
  }, 0);

  // Auto-generate when entering a new round with no results
  useEffect(() => {
    if (!currentGrid && !isGenerating && !generationError) {
      generateRound();
    }
  }, [currentRoundIndex, currentGrid, isGenerating, generationError, generateRound]);

  const handleConfirm = async () => {
    if (selectedInRound === 0) {
      toast.error("Select at least one image to continue");
      return;
    }
    setIsConfirming(true);
    try {
      await confirmRound();
    } catch {
      toast.error("Failed to save selections");
    } finally {
      setIsConfirming(false);
    }
  };

  const handleRegenerate = async () => {
    try {
      await regenerateRound();
    } catch {
      toast.error("Regeneration failed");
    }
  };

  return (
    <div className="flex gap-8">
      {/* Left sidebar: round info + navigation */}
      <div className="w-[220px] shrink-0 space-y-5">
        <div className="space-y-1">
          <h2 className="text-[15px] font-semibold tracking-[0.06em]">
            {roundConfig?.label}
          </h2>
          <p className="text-[11px] text-[var(--text-dim)]">
            {roundConfig?.description}
          </p>
        </div>

        {/* Round navigation */}
        <div className="space-y-0.5">
          {ROUND_CONFIGS.slice(0, roundCount).map((config, i) => (
            <div
              key={config.type}
              className={`py-1.5 text-[11px] transition-all duration-[200ms] ${
                i === currentRoundIndex
                  ? "border-l-2 border-[var(--cat-accent)] pl-3 font-semibold text-[var(--text)]"
                  : i < currentRoundIndex
                    ? "border-l-2 border-[var(--cat-border)] pl-3 text-[var(--text-dim)]"
                    : "border-l-2 border-transparent pl-3 text-[var(--text-dim)]/50"
              }`}
            >
              {config.label.split(": ")[1] || config.label}
            </div>
          ))}
        </div>

        {/* Actions */}
        {currentGrid && !isGenerating && (
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" className="w-full" onClick={handleRegenerate}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Regenerate
            </Button>
            <Button size="sm" className="w-full" onClick={handleConfirm} disabled={isConfirming || selectedInRound === 0}>
              {isConfirming ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
              {currentRoundIndex < roundCount - 1 ? "Next Round" : "Review All"}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Right: grid content */}
      <div className="flex-1 space-y-4">
        {/* Loading state */}
        {isGenerating && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GridLoader2 size={20} />
                <p className="text-[11px] text-[var(--text-dim)]">
                  Generating{" "}
                  <span className="tabular-nums font-semibold text-[var(--text)]">
                    {revealed}
                  </span>{" "}
                  of {TOTAL_CELLS}
                </p>
              </div>
              {revealed < TOTAL_CELLS && (
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--cat-accent)]" />
                  <span className="text-[10px] text-[var(--text-dim)]">Processing</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {Array.from({ length: TOTAL_CELLS }).map((_, i) => (
                <ShimmerCell key={i} resolved={i < revealed} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {generationError && !isGenerating && (
          <div className="flex flex-col items-center gap-4 py-16">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <div className="text-center">
              <p className="text-[13px] font-medium">Generation failed</p>
              <p className="text-[11px] text-[var(--text-dim)]">{generationError}</p>
            </div>
            <Button onClick={() => generateRound()}>Try Again</Button>
          </div>
        )}

        {/* Grid display with inline controls */}
        {currentGrid && !isGenerating && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[11px] text-[var(--text-dim)]">
              <CheckCircle2 className="h-3.5 w-3.5 text-[var(--cat-accent)]" />
              <span>{selectedInRound}/{totalInRound} selected — tap to deselect</span>
            </div>
            <ImageGrid
              images={currentGrid.croppedImages}
              onToggle={(imageId) =>
                toggleImageSelection(currentRoundIndex, imageId)
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
