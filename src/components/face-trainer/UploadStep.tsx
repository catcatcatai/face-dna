"use client";

import { useCallback, useState } from "react";
import { useTrainerStore } from "@/store/trainer-store";
import { ImageIcon, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function SettingCard({
  active,
  onClick,
  label,
  sublabel,
  detail,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sublabel?: string;
  detail: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border px-4 py-3.5 text-left transition-all duration-[200ms] ${
        active
          ? "border-[var(--cat-accent)] bg-[rgba(0,0,0,0.04)]"
          : "border-[var(--cat-border)] bg-[var(--surface)] hover:border-[var(--text-dim)]"
      }`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[13px] font-semibold text-[var(--text)]">{label}</span>
          {sublabel && (
            <span className="text-[10px] font-semibold tracking-[0.1em] text-[var(--text-dim)]">{sublabel}</span>
          )}
        </div>
        <span className="text-[11px] text-[var(--text-dim)]">{detail}</span>
      </div>
    </button>
  );
}

export function UploadStep() {
  const sourceImageUrl = useTrainerStore((s) => s.sourceImageUrl);
  const setSourceImage = useTrainerStore((s) => s.setSourceImage);
  const resolution = useTrainerStore((s) => s.resolution);
  const setResolution = useTrainerStore((s) => s.setResolution);
  const roundCount = useTrainerStore((s) => s.roundCount);
  const setRoundCount = useTrainerStore((s) => s.setRoundCount);
  const uploadSourceImage = useTrainerStore((s) => s.uploadSourceImage);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setSourceImage(file);
    },
    [setSourceImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const openFilePicker = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  };

  const handleStart = async () => {
    setIsUploading(true);
    try {
      await uploadSourceImage();
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const generationCost = roundCount * (resolution === "2K" ? 0.15 : 0.3);
  const trainingCost = 2;
  const totalCost = generationCost + trainingCost;

  if (!sourceImageUrl) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-[13px] font-semibold tracking-[0.06em]">
            Train a Face LoRA
          </h1>
          <p className="text-[13px] text-[var(--text-dim)]">
            One photo is all you need. Face-dna generates a complete training
            dataset — expressions, angles, outfits — from a single reference
            image.
          </p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={openFilePicker}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-6 py-16 sm:p-16 transition-all duration-[200ms] ${
            isDragOver
              ? "border-[var(--text-dim)] bg-[rgba(0,0,0,0.03)]"
              : "border-[var(--cat-border)] hover:border-[var(--text-dim)]"
          }`}
        >
          <div className="mb-4 rounded-full bg-[var(--surface-2)] p-4">
            <ImageIcon className="h-8 w-8 text-[var(--text-dim)]" />
          </div>
          <p className="text-[11px] font-semibold tracking-[0.08em] text-[var(--text)]">
            Drop an image here, or click to browse
          </p>
          <p className="mt-1 text-[10px] text-[var(--text-dim)]">
            PNG, JPG, or WebP
          </p>
        </div>

        <p className="text-[10px] text-[var(--text-dim)]">
          Tip: Use a well-lit, front-facing photo with the face clearly
          visible. AI-generated faces (from Midjourney, etc.) work great.
        </p>
      </div>
    );
  }

  // Two-column layout: image left, settings right
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-[13px] font-semibold tracking-[0.06em]">
          Train a Face LoRA
        </h1>
        <p className="text-[13px] text-[var(--text-dim)]">
          Configure your training settings, then start generating.
        </p>
      </div>

      <div className="grid grid-cols-[1.2fr_1fr] gap-6">
        {/* Left: Image preview */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={openFilePicker}
          className={`flex cursor-pointer items-center justify-center rounded-lg border border-dashed p-6 transition-all duration-[200ms] ${
            isDragOver
              ? "border-[var(--text-dim)] bg-[rgba(0,0,0,0.03)]"
              : "border-[var(--cat-border)] hover:border-[var(--text-dim)]"
          }`}
        >
          <img
            src={sourceImageUrl}
            alt="Reference face"
            className="max-h-[400px] rounded-lg object-contain"
          />
        </div>

        {/* Right: Settings */}
        <div className="space-y-5">
          {/* Resolution */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-semibold tracking-[0.08em] text-[var(--text)]">
              Generation Resolution
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <SettingCard
                active={resolution === "4K"}
                onClick={() => setResolution("4K")}
                label="4K"
                detail="$0.30/round"
              />
              <SettingCard
                active={resolution === "2K"}
                onClick={() => setResolution("2K")}
                label="2K"
                sublabel="LITE"
                detail="$0.15/round"
              />
            </div>
          </div>

          {/* Rounds */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-semibold tracking-[0.08em] text-[var(--text)]">
              Training Rounds
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <SettingCard
                active={roundCount === 6}
                onClick={() => setRoundCount(6)}
                label="6 Rounds"
                detail="~54 images"
              />
              <SettingCard
                active={roundCount === 4}
                onClick={() => setRoundCount(4)}
                label="4 Rounds"
                sublabel="LITE"
                detail="~36 images"
              />
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="rounded-lg border border-[var(--cat-border)] bg-[var(--surface)] p-3 text-[11px]">
            <div className="space-y-1">
              <div className="flex justify-between text-[var(--text-dim)]">
                <span>{roundCount} rounds at {resolution}</span>
                <span>~${generationCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[var(--text-dim)]">
                <span>LoRA training</span>
                <span>~$2.00</span>
              </div>
              <div className="mt-1 border-t border-[var(--cat-border)] pt-1">
                <div className="flex justify-between font-semibold text-[var(--text)]">
                  <span>Estimated total</span>
                  <span>~${totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={openFilePicker}>
              Change Image
            </Button>
            <Button onClick={handleStart} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Uploading
                </>
              ) : (
                <>
                  <Upload className="mr-1.5 h-3.5 w-3.5" />
                  Start Training Dataset
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
