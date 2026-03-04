"use client";

import { useState } from "react";
import { useTrainerStore } from "@/store/trainer-store";
import type { WizardPhase } from "@/types";
import { cn } from "@/lib/utils";
import { MOCK_TRAINING_RESULT, MOCK_SOURCE_IMAGE } from "@/lib/mock-data";

const phases: { value: WizardPhase; label: string; loading?: boolean; empty?: boolean }[] = [
  { value: "upload", label: "Empty", empty: true },
  { value: "upload", label: "Upload" },
  { value: "generating", label: "Generating", loading: true },
  { value: "generating", label: "Generation" },
  { value: "review", label: "Review" },
  { value: "training-config", label: "Config" },
  { value: "training", label: "Training" },
  { value: "complete", label: "Complete" },
];

export function MockPhaseNav() {
  const currentPhase = useTrainerStore((s) => s.phase);

  const [activeIndex, setActiveIndex] = useState(0);

  function jumpTo(phase: WizardPhase, index: number, loading?: boolean, empty?: boolean) {
    setActiveIndex(index);
    const store = useTrainerStore.getState();

    if (phase === "upload" && empty) {
      useTrainerStore.setState({
        phase: "upload",
        sourceImageUrl: null,
        isGenerating: false,
        isTraining: false,
        trainingStatus: "",
        trainingError: null,
        trainingResult: null,
      });
      return;
    }

    // Restore source image if it was cleared by "Empty"
    if (phase === "upload" && !empty && !store.sourceImageUrl) {
      useTrainerStore.setState({
        sourceImageUrl: MOCK_SOURCE_IMAGE,
      });
    }

    if (phase === "generating" && loading) {
      useTrainerStore.setState({
        phase: "generating",
        isGenerating: true,
        generationError: null,
        isTraining: false,
        trainingStatus: "",
        trainingError: null,
        trainingResult: null,
      });
    } else if (phase === "training") {
      store.setPhase("training");
      useTrainerStore.setState({
        isTraining: true,
        trainingStatus: "",
        trainingError: null,
        trainingResult: null,
      });
    } else if (phase === "complete") {
      useTrainerStore.setState({
        phase: "complete",
        isTraining: false,
        trainingStatus: "",
        trainingError: null,
        trainingResult: MOCK_TRAINING_RESULT,
        profileName: store.profileName || "Mock Profile",
      });
    } else {
      store.setPhase(phase);
      useTrainerStore.setState({
        isGenerating: false,
        isTraining: false,
        trainingStatus: "",
        trainingError: null,
        trainingResult: null,
      });
    }
  }

  return (
    <div className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-[14px] border border-[var(--cat-border)] bg-[var(--surface)] px-2 py-1.5 shadow-[var(--shadow-floating)]">
        <span className="px-2 text-[10px] font-semibold tracking-[0.08em] text-[var(--text-dim)]">
          MOCK
        </span>
        {phases.map(({ value, label, loading, empty }, i) => (
          <button
            key={`${value}-${label}`}
            onClick={() => jumpTo(value, i, loading, empty)}
            className={cn(
              "rounded-lg px-3 py-1 text-[10px] font-semibold transition-all duration-[200ms]",
              activeIndex === i
                ? "bg-[var(--cat-accent)] text-[var(--bg)]"
                : "text-[var(--text-dim)] hover:bg-[rgba(0,0,0,0.06)] hover:text-[var(--text)]"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
