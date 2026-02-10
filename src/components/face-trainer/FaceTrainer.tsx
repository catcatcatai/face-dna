"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTrainerStore } from "@/store/trainer-store";
import { useApiKeyStore } from "@/store/api-key-store";
import { ApiKeyPrompt } from "@/components/settings/ApiKeyPrompt";
import { UploadStep } from "./UploadStep";
import { GenerationRound } from "./GenerationRound";
import { FinalReview } from "./FinalReview";
import { TrainingConfig } from "./TrainingConfig";
import { TrainingStatus } from "./TrainingStatus";
import { MockPhaseNav } from "./MockPhaseNav";
import {
  createMockGridResults,
  MOCK_SOURCE_IMAGE,
} from "@/lib/mock-data";
import { PageLoader } from "@/components/ui/page-loader";

export function FaceTrainer() {
  const searchParams = useSearchParams();
  const isMock = searchParams.get("mock") === "true";

  const phase = useTrainerStore((s) => s.phase);
  const falApiKey = useApiKeyStore((s) => s.falApiKey);
  const [hasServerKey, setHasServerKey] = useState<boolean | null>(null);
  const [mockSeeded, setMockSeeded] = useState(false);

  // Seed mock data once
  useEffect(() => {
    if (isMock && !mockSeeded) {
      const roundCount = 6;
      const mockGrids = createMockGridResults(roundCount);

      useTrainerStore.setState({
        sourceImageUrl: MOCK_SOURCE_IMAGE,
        sourceFalUrl: "https://mock.fal.ai/source.png",
        resolution: "4K",
        roundCount,
        currentRoundIndex: 0,
        gridResults: mockGrids,
        isGenerating: false,
        generationError: null,
        profileName: "Mock Profile",
        triggerWord: "TOK",
      });

      setMockSeeded(true);
    }
  }, [isMock, mockSeeded]);

  // Check server key when no user key (skip in mock mode)
  useEffect(() => {
    if (!isMock && !falApiKey) {
      fetch("/api/fal/status")
        .then((r) => r.json())
        .then((data) => setHasServerKey(data.hasServerKey))
        .catch(() => setHasServerKey(false));
    }
  }, [isMock, falApiKey]);

  // Mock mode
  if (isMock) {
    if (!mockSeeded) return <PageLoader />;
    return (
      <>
        <div key={phase} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <WizardRouter phase={phase} />
        </div>
        <MockPhaseNav />
      </>
    );
  }

  // Normal mode
  if (falApiKey || hasServerKey) {
    return (
      <div key={phase} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        <WizardRouter phase={phase} />
      </div>
    );
  }

  if (hasServerKey === null) {
    return <PageLoader />;
  }

  return <ApiKeyPrompt />;
}

function WizardRouter({ phase }: { phase: string }) {
  switch (phase) {
    case "upload":
      return <UploadStep />;
    case "generating":
      return <GenerationRound />;
    case "review":
      return <FinalReview />;
    case "training-config":
      return <TrainingConfig />;
    case "training":
    case "complete":
      return <TrainingStatus />;
    default:
      return <UploadStep />;
  }
}
