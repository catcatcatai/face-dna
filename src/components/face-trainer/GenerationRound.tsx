"use client";

import { useEffect, useState } from "react";
import { useTrainerStore } from "@/store/trainer-store";
import { ROUND_CONFIGS } from "@/types";
import { Button } from "@/components/ui/button";
import { ImageGrid } from "./ImageGrid";
import { RoundProgress } from "./RoundProgress";
import { Loader2, RefreshCw, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { GridLoader2 } from "@/components/ui/grid-loader2";
import { toast } from "sonner";

export function GenerationRound() {
  const currentRoundIndex = useTrainerStore((s) => s.currentRoundIndex);
  const gridResults = useTrainerStore((s) => s.gridResults);
  const isGenerating = useTrainerStore((s) => s.isGenerating);
  const generationError = useTrainerStore((s) => s.generationError);
  const generateRound = useTrainerStore((s) => s.generateRound);
  const regenerateRound = useTrainerStore((s) => s.regenerateRound);
  const toggleImageSelection = useTrainerStore((s) => s.toggleImageSelection);
  const confirmRound = useTrainerStore((s) => s.confirmRound);
  const getSelectedCount = useTrainerStore((s) => s.getSelectedCount);
  const roundCount = useTrainerStore((s) => s.roundCount);

  const [isConfirming, setIsConfirming] = useState(false);

  const currentGrid = gridResults[currentRoundIndex];
  const roundConfig = ROUND_CONFIGS[currentRoundIndex];
  const totalSelected = getSelectedCount();

  // Auto-generate when entering a new round with no results
  useEffect(() => {
    if (!currentGrid && !isGenerating && !generationError) {
      generateRound();
    }
  }, [currentRoundIndex, currentGrid, isGenerating, generationError, generateRound]);

  const handleConfirm = async () => {
    const selectedInRound =
      currentGrid?.croppedImages.filter((img) => img.selected).length ?? 0;

    if (selectedInRound === 0) {
      toast.error("Select at least one image to continue");
      return;
    }

    setIsConfirming(true);
    try {
      await confirmRound();
    } catch (error) {
      toast.error("Failed to save selections");
    } finally {
      setIsConfirming(false);
    }
  };

  const handleRegenerate = async () => {
    try {
      await regenerateRound();
    } catch (error) {
      toast.error("Regeneration failed");
    }
  };

  // Check if user has eliminated too many
  const currentSelectedCount =
    currentGrid?.croppedImages.filter((img) => img.selected).length ?? 0;
  const currentTotalCount = currentGrid?.croppedImages.length ?? 9;
  const tooManyEliminated =
    currentGrid && currentSelectedCount < currentTotalCount * 0.5;

  return (
    <div className="flex gap-6">
      {/* Left sidebar — round info & controls */}
      <div className="w-56 shrink-0 space-y-5">
        <div>
          <h2 className="text-lg font-bold tracking-tight">{roundConfig?.label}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{roundConfig?.description}</p>
        </div>

        {/* Vertical progress */}
        <div className="space-y-1.5">
          {ROUND_CONFIGS.slice(0, roundCount).map((round, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`h-7 w-1 rounded-full transition-all ${
                i < currentRoundIndex
                  ? "bg-primary"
                  : i === currentRoundIndex
                    ? "bg-primary shadow-[var(--glow-primary)]"
                    : "bg-muted"
              }`} />
              <span className={`text-xs ${
                i === currentRoundIndex
                  ? "font-semibold text-foreground"
                  : i < currentRoundIndex
                    ? "text-muted-foreground"
                    : "text-muted-foreground/60"
              }`}>
                {round.label.split(": ")[1]}
              </span>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-xs tabular-nums">
          <span className="text-muted-foreground">Selected:</span>{" "}
          <strong>{totalSelected} images</strong>
        </div>

        {currentGrid && !isGenerating && (
          <>
            {tooManyEliminated && (
              <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-3 text-xs text-yellow-200">
                Having trouble? Regenerate for fresh results.
              </div>
            )}

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleRegenerate}
                disabled={isGenerating}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
              <Button
                className="w-full"
                onClick={handleConfirm}
                disabled={isConfirming || currentSelectedCount === 0}
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : currentRoundIndex < roundCount - 1 ? (
                  <>
                    Next Round
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Review All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Right: Grid canvas */}
      <div className="flex-1">
        {/* Loading state — skeleton grid */}
        {isGenerating && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2.5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-lg bg-muted"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <GridLoader2 size={20} />
              <span>Generating {roundConfig?.label.split(": ")[1]}... usually takes 30-60s</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {generationError && !isGenerating && (
          <div className="flex flex-col items-center gap-4 py-16">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <div className="text-center">
              <p className="font-medium">Generation failed</p>
              <p className="text-sm text-muted-foreground">{generationError}</p>
            </div>
            <Button onClick={() => generateRound()}>Try Again</Button>
          </div>
        )}

        {/* Grid display */}
        {currentGrid && !isGenerating && (
          <div className="space-y-4">
            <ImageGrid
              images={currentGrid.croppedImages}
              onToggle={(imageId) =>
                toggleImageSelection(currentRoundIndex, imageId)
              }
            />
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>{roundConfig?.label.split(": ")[1]} generated — tap to deselect</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
