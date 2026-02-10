"use client";

import { useState } from "react";
import { useTrainerStore } from "@/store/trainer-store";
import type { WizardPhase } from "@/types";
import { cn } from "@/lib/utils";
import { MOCK_TRAINING_RESULT } from "@/lib/mock-data";

const phases: { value: WizardPhase; label: string; loading?: boolean }[] = [
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

  function jumpTo(phase: WizardPhase, index: number, loading?: boolean) {
    setActiveIndex(index);
    const store = useTrainerStore.getState();

    if (phase === "generating" && loading) {
      // Show the skeleton/loading state
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
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-border bg-background/95 px-2 py-1.5 shadow-lg backdrop-blur">
        <span className="px-2 text-xs font-medium text-muted-foreground">
          MOCK
        </span>
        {phases.map(({ value, label, loading }, i) => (
          <button
            key={`${value}-${label}`}
            onClick={() => jumpTo(value, i, loading)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              activeIndex === i
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
