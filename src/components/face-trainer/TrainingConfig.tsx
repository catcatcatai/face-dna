"use client";

import { useRef } from "react";
import { useTrainerStore } from "@/store/trainer-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowLeft, Sparkles } from "lucide-react";

export function TrainingConfig() {
  const profileName = useTrainerStore((s) => s.profileName);
  const setProfileName = useTrainerStore((s) => s.setProfileName);
  const triggerWord = useTrainerStore((s) => s.triggerWord);
  const setTriggerWord = useTrainerStore((s) => s.setTriggerWord);
  const getSelectedCount = useTrainerStore((s) => s.getSelectedCount);
  const trainingError = useTrainerStore((s) => s.trainingError);
  const startTraining = useTrainerStore((s) => s.startTraining);
  const setPhase = useTrainerStore((s) => s.setPhase);

  const triggerManuallyEdited = useRef(false);
  const selectedCount = getSelectedCount();

  const handleProfileNameChange = (value: string) => {
    setProfileName(value);
    if (!triggerManuallyEdited.current) {
      setTriggerWord(value);
    }
  };

  const handleTriggerWordChange = (value: string) => {
    triggerManuallyEdited.current = true;
    setTriggerWord(value);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-[15px] font-semibold tracking-[0.06em]">Configure Training</h2>
        <p className="text-[11px] text-[var(--text-dim)]">
          Set a name and trigger word for your LoRA, then start training.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-[13px]">
            Training Dataset
            <Badge variant="secondary">{selectedCount} images</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-name" className="text-[10px] font-semibold tracking-[0.08em] text-[var(--text-dim)]">
              Profile Name
            </Label>
            <Input
              id="profile-name"
              placeholder="e.g., Character A, Warrior Princess"
              value={profileName}
              onChange={(e) => handleProfileNameChange(e.target.value)}
            />
            <p className="text-[10px] text-[var(--text-dim)]">
              A name to identify this trained LoRA in your profiles.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trigger-word" className="text-[10px] font-semibold tracking-[0.08em] text-[var(--text-dim)]">
              Trigger Word
            </Label>
            <Input
              id="trigger-word"
              placeholder="Same as profile name"
              value={triggerWord}
              onChange={(e) => handleTriggerWordChange(e.target.value)}
            />
            <p className="text-[10px] text-[var(--text-dim)]">
              A unique word that activates the LoRA in prompts. Use it like:{" "}
              <code className="rounded bg-[var(--surface-2)] px-1" style={{ textTransform: "none" }}>
                a photo of {triggerWord || "TRIGGER"} person on a beach
              </code>
            </p>
          </div>
        </CardContent>
      </Card>

      {trainingError && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-[11px] text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {trainingError}
        </div>
      )}

      <p className="text-[10px] text-[var(--text-dim)]">
        Training typically takes 4-8 minutes and costs ~$2. The model will
        auto-caption your images and create face masks for optimal training.
      </p>

      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" onClick={() => setPhase("review")}>
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Back
        </Button>
        <Button
          onClick={startTraining}
          disabled={!profileName.trim() || !triggerWord.trim()}
        >
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          Start Training
        </Button>
      </div>
    </div>
  );
}
