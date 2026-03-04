"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTrainerStore } from "@/store/trainer-store";
import { useProfileStore } from "@/store/profile-store";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Download,
  Copy,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

function Divider() {
  return <div className="h-6 w-px bg-[var(--cat-border)]" />;
}

// ─── Train page toolbar (review, config, training, complete) ───

function ReviewToolbar() {
  const getSelectedImages = useTrainerStore((s) => s.getSelectedImages);
  const setPhase = useTrainerStore((s) => s.setPhase);
  const selectedCount = getSelectedImages().length;

  return (
    <>
      <span className="text-[11px] font-medium tabular-nums text-[var(--text-dim)]">
        {selectedCount} images
      </span>
      {selectedCount < 20 && (
        <span className="text-[10px] text-destructive">
          {selectedCount < 15 ? "Need 15+" : "Rec 20+"}
        </span>
      )}
      <Divider />
      <Button
        variant="outline"
        size="sm"
        onClick={() => useTrainerStore.getState().setPhase("generating")}
      >
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
        Back
      </Button>
      <Button size="sm" onClick={() => setPhase("training-config")} disabled={selectedCount < 15}>
        Continue
        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
      </Button>
    </>
  );
}

function TrainingConfigToolbar() {
  const profileName = useTrainerStore((s) => s.profileName);
  const triggerWord = useTrainerStore((s) => s.triggerWord);
  const startTraining = useTrainerStore((s) => s.startTraining);
  const setPhase = useTrainerStore((s) => s.setPhase);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setPhase("review")}>
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
        Back
      </Button>
      <Button
        size="sm"
        onClick={startTraining}
        disabled={!profileName.trim() || !triggerWord.trim()}
      >
        <Sparkles className="mr-1.5 h-3.5 w-3.5" />
        Start Training
      </Button>
    </>
  );
}

function TrainingToolbar() {
  return (
    <>
      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--cat-accent)]" />
      <span className="text-[11px] text-[var(--text-dim)]">Training in progress</span>
    </>
  );
}

function CompleteToolbar() {
  const trainingResult = useTrainerStore((s) => s.trainingResult);
  const reset = useTrainerStore((s) => s.reset);

  if (!trainingResult) return null;

  return (
    <>
      <a href={trainingResult.loraUrl} download>
        <Button variant="outline" size="sm">
          <Download className="mr-1.5 h-3.5 w-3.5" />
          LoRA
        </Button>
      </a>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          navigator.clipboard.writeText(trainingResult.loraUrl);
          toast.success("LoRA URL copied");
        }}
      >
        <Copy className="mr-1.5 h-3.5 w-3.5" />
        Copy URL
      </Button>
      <Divider />
      <a
        href="https://fal.ai/models/fal-ai/flux-lora"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button size="sm">
          <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
          Test LoRA
        </Button>
      </a>
      <Divider />
      <Button variant="ghost" size="sm" onClick={reset}>
        <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
        Train Another
      </Button>
    </>
  );
}

function TrainToolbar() {
  const phase = useTrainerStore((s) => s.phase);

  switch (phase) {
    case "review":
      return <ReviewToolbar />;
    case "training-config":
      return <TrainingConfigToolbar />;
    case "training":
      return <TrainingToolbar />;
    case "complete":
      return <CompleteToolbar />;
    default:
      return null;
  }
}

function ProfilesToolbar() {
  const profiles = useProfileStore((s) => s.profiles);

  return (
    <>
      <span className="text-[11px] font-medium tabular-nums text-[var(--text-dim)]">
        {profiles.length} {profiles.length === 1 ? "profile" : "profiles"}
      </span>
      <Divider />
      <a
        href="https://fal.ai/models/fal-ai/flux-lora"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="outline" size="sm">
          <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
          Test LoRA
        </Button>
      </a>
      <Link href="/train">
        <Button size="sm">Train New</Button>
      </Link>
    </>
  );
}

function ToolbarContent({ pathname }: { pathname: string }) {
  if (pathname === "/profiles") return <ProfilesToolbar />;
  return <TrainToolbar />;
}

export function FloatingToolbar() {
  const pathname = usePathname();
  const phase = useTrainerStore((s) => s.phase);

  // Hide toolbar for upload and generation phases (controls are on page)
  const isHiddenPhase = pathname !== "/profiles" && (phase === "upload" || phase === "generating");
  if (isHiddenPhase) return null;

  return (
    <div className="fixed bottom-3.5 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3 rounded-[14px] border border-[var(--cat-border)] bg-[var(--surface)] px-3.5 py-2.5 shadow-[var(--shadow-floating)]">
        <ToolbarContent pathname={pathname} />
      </div>
    </div>
  );
}
