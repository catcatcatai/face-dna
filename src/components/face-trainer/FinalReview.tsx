"use client";

import { useTrainerStore } from "@/store/trainer-store";
import { ROUND_CONFIGS } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageCell } from "./ImageCell";
import { AlertTriangle, ArrowLeft, ArrowRight } from "lucide-react";

export function FinalReview() {
  const gridResults = useTrainerStore((s) => s.gridResults);
  const toggleFinalReviewImage = useTrainerStore(
    (s) => s.toggleFinalReviewImage
  );
  const getSelectedImages = useTrainerStore((s) => s.getSelectedImages);

  const setPhase = useTrainerStore((s) => s.setPhase);

  const selectedImages = getSelectedImages();
  const selectedCount = selectedImages.length;

  const roundCount = useTrainerStore((s) => s.roundCount);

  const imagesByRound = ROUND_CONFIGS.slice(0, roundCount).map((config, i) => ({
    config,
    images:
      gridResults[i]?.croppedImages.filter((img) => img.selected) ?? [],
  }));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold tracking-[0.06em]">Final Review</h2>
          <p className="text-[11px] text-[var(--text-dim)]">
            Remove any remaining images you don't want in the training set.
          </p>
        </div>
        <Badge variant={selectedCount >= 20 ? "default" : "destructive"}>
          {selectedCount} images
        </Badge>
      </div>

      {selectedCount < 20 && (
        <div
          className={`rounded-lg border p-3 text-[11px] ${
            selectedCount < 15
              ? "border-destructive/30 bg-destructive/5 text-destructive"
              : "border-[var(--cat-border)] bg-[var(--surface-2)] text-[var(--text-dim)]"
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            {selectedCount < 15 ? (
              <span>
                Minimum 15 images required for training. You have{" "}
                {selectedCount}. Go back and regenerate rounds with more
                variety.
              </span>
            ) : (
              <span>
                Recommended: 20+ images for best results. You have{" "}
                {selectedCount}.
              </span>
            )}
          </div>
        </div>
      )}

      {imagesByRound.map(({ config, images }) => (
        <div key={config.type} className="space-y-3">
          <h3 className="text-[10px] font-semibold tracking-[0.08em] text-[var(--text-dim)]">
            {config.label} ({images.length} images)
          </h3>
          <div className="grid grid-cols-4 gap-2.5">
            {images.map((image) => (
              <ImageCell
                key={image.id}
                imageUrl={image.blobUrl}
                selected={image.selected}
                onToggle={() => toggleFinalReviewImage(image.id)}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          onClick={() => setPhase("generating")}
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Back
        </Button>
        <Button onClick={() => setPhase("training-config")} disabled={selectedCount < 15}>
          Continue
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
