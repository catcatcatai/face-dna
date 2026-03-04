"use client";

import { useTrainerStore } from "@/store/trainer-store";
import { useProfileStore } from "@/store/profile-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
} from "lucide-react";
import { GridLoader } from "@/components/ui/grid-loader";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import JSZip from "jszip";
import { useCallback, useEffect, useRef, useState } from "react";

function formatDuration(ms: number): string {
  const totalSec = Math.round(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min === 0) return `${sec}s`;
  return `${min}m ${sec}s`;
}

const TRAINING_QUIPS = [
  "Teaching pixels what a face looks like...",
  "Convincing neurons to pay attention...",
  "Adjusting 42 million parameters, give or take...",
  "Your face is now a math problem. A beautiful one.",
  "Gradient descending into greatness...",
  "Whispering sweet nothings to the latent space...",
  "Turning selfies into science...",
  "Making the model memorize your vibe...",
  "Crunching tensors like a protein shake...",
  "This is the part where the AI squints really hard...",
  "Backpropagating through the multiverse...",
  "Optimizing the difference between you and not-you...",
  "Loading your face into the matrix...",
  "Burning GPU cycles so you don't have to...",
  "Fine-tuning: like regular tuning, but fancier...",
  "Stochastically descending toward your likeness...",
  "Almost there. Probably. Time is an illusion.",
  "The weights are shifting. Literally.",
  "Teaching a neural net your best angles...",
  "Baking your identity into an 87MB file...",
];

function useElapsedTimer(active: boolean) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setElapsed(0);
      startRef.current = null;
      return;
    }

    startRef.current = Date.now();
    const id = setInterval(() => {
      if (startRef.current) {
        setElapsed(Date.now() - startRef.current);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  return elapsed;
}

function useTypewriter(texts: string[], intervalMs: number, active: boolean) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * texts.length));
  const [display, setDisplay] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const target = texts[index];
    if (charIndex <= target.length) {
      const id = setTimeout(() => {
        setDisplay(target.slice(0, charIndex));
        setCharIndex((p) => p + 1);
      }, 35);
      return () => clearTimeout(id);
    } else {
      const id = setTimeout(() => {
        setIndex((p) => (p + 1) % texts.length);
        setCharIndex(0);
        setDisplay("");
      }, intervalMs);
      return () => clearTimeout(id);
    }
  }, [charIndex, index, texts, intervalMs, active]);

  return display;
}

export function TrainingStatus() {
  const phase = useTrainerStore((s) => s.phase);
  const isTraining = useTrainerStore((s) => s.isTraining);
  const trainingStatus = useTrainerStore((s) => s.trainingStatus);
  const trainingError = useTrainerStore((s) => s.trainingError);
  const trainingResult = useTrainerStore((s) => s.trainingResult);
  const profileName = useTrainerStore((s) => s.profileName);
  const sourceImageUrl = useTrainerStore((s) => s.sourceImageUrl);
  const sourceFalUrl = useTrainerStore((s) => s.sourceFalUrl);
  const trainingDurationMs = useTrainerStore((s) => s.trainingDurationMs);
  const getSelectedImages = useTrainerStore((s) => s.getSelectedImages);
  const startTraining = useTrainerStore((s) => s.startTraining);
  const reset = useTrainerStore((s) => s.reset);
  const addProfile = useProfileStore((s) => s.addProfile);

  const savedRef = useRef(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Auto-save profile on completion
  useEffect(() => {
    if (phase === "complete" && trainingResult && !savedRef.current) {
      savedRef.current = true;

      const round1Images = getSelectedImages().filter(
        (img) => img.roundType === "expressions" && img.falUrl
      );
      const previewUrl = round1Images[0]?.falUrl || sourceFalUrl || "";
      const hoverUrl =
        round1Images.length > 1
          ? round1Images[1].falUrl!
          : sourceFalUrl || "";

      addProfile({
        id: nanoid(),
        name: profileName || "Untitled",
        triggerWord: trainingResult.triggerWord,
        loraUrl: trainingResult.loraUrl,
        configUrl: trainingResult.configUrl,
        previewImageUrl: previewUrl,
        hoverImageUrl: hoverUrl !== previewUrl ? hoverUrl : undefined,
        createdAt: new Date().toISOString(),
      });
      toast.success("Profile saved!");
    }
  }, [phase, trainingResult, profileName, sourceFalUrl, addProfile, getSelectedImages]);

  const downloadReferenceImages = async () => {
    setIsDownloading(true);
    try {
      const images = getSelectedImages();
      if (images.length === 0) {
        toast.error("No reference images available");
        return;
      }

      const zip = new JSZip();

      await Promise.all(
        images.map(async (img, i) => {
          const url = img.falUrl || img.blobUrl;
          const response = await fetch(url);
          const blob = await response.blob();
          const ext = blob.type === "image/webp" ? "webp" : "png";
          zip.file(`${img.roundType}_${String(i + 1).padStart(3, "0")}.${ext}`, await blob.arrayBuffer());
        })
      );

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${profileName || "lora"}-reference-images.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${images.length} reference images`);
    } catch (error) {
      toast.error("Failed to download images");
    } finally {
      setIsDownloading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  const typedQuip = useTypewriter(TRAINING_QUIPS, 8000, isTraining);
  const elapsedMs = useElapsedTimer(isTraining);

  // Training in progress
  if (isTraining) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center gap-6 py-16">
          <GridLoader size={160} />
          <div className="text-center">
            <h2 className="text-[13px] font-semibold tracking-[0.06em]">Training Your LoRA</h2>
            <p className="mt-2 text-[11px] text-[var(--text-dim)]" style={{ textTransform: "none" }}>
              {trainingStatus || typedQuip}
              {!trainingStatus && <span className="animate-pulse">▌</span>}
            </p>
            <div className="mt-4 flex items-center justify-center gap-3 text-[10px] text-[var(--text-dim)]">
              <span className="tabular-nums">{formatDuration(elapsedMs)} elapsed</span>
              <span className="text-[var(--cat-border)]">·</span>
              <span>typically takes 5–10 min</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (trainingError) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center gap-6 py-16">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <div className="text-center">
            <h2 className="text-[13px] font-semibold tracking-[0.06em]">Training Failed</h2>
            <p className="mt-2 text-[11px] text-[var(--text-dim)]" style={{ textTransform: "none" }}>
              {trainingError}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={reset}>
              Start Over
            </Button>
            <Button onClick={startTraining}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  // Completion state
  if (trainingResult) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex flex-col items-center gap-4 py-8">
          <CheckCircle2 className="h-10 w-10 text-[var(--cat-accent)]" />
          <div className="text-center">
            <h2 className="text-[13px] font-semibold tracking-[0.06em]">LoRA Trained</h2>
            <p className="text-[11px] text-[var(--text-dim)]">
              Your face LoRA is ready. Saved to profiles.
              {trainingDurationMs != null && (
                <> Completed in {formatDuration(trainingDurationMs)}.</>
              )}
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <p className="text-[10px] font-semibold tracking-[0.08em] text-[var(--text-dim)]">
                Trigger Word
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {trainingResult.triggerWord}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() =>
                    copyToClipboard(
                      trainingResult.triggerWord,
                      "Trigger word"
                    )
                  }
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-semibold tracking-[0.08em] text-[var(--text-dim)]">
                LoRA URL
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 truncate rounded bg-[var(--surface-2)] px-2 py-1 text-[10px]" style={{ textTransform: "none" }}>
                  {trainingResult.loraUrl}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 flex-shrink-0"
                  onClick={() =>
                    copyToClipboard(trainingResult.loraUrl, "LoRA URL")
                  }
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <a
                href={trainingResult.loraUrl}
                download
                className="flex-1"
              >
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download LoRA
                </Button>
              </a>
              <Button
                variant="outline"
                className="flex-1"
                onClick={downloadReferenceImages}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Zipping...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Reference Images
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
