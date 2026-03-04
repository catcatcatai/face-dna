"use client";

import { KeyRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ApiKeyDialog } from "./ApiKeyDialog";

export function ApiKeyPrompt() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-md">
        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
          <div className="rounded-full bg-[var(--surface-2)] p-3">
            <KeyRound className="size-6 text-[var(--text-dim)]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-[15px] font-semibold tracking-[0.06em]">API key required</h2>
            <p className="text-[11px] text-[var(--text-dim)]">
              face-dna uses{" "}
              <a
                href="https://fal.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text)] underline underline-offset-4 hover:text-[var(--text-dim)]"
              >
                fal.ai
              </a>{" "}
              for image generation and LoRA training. Add your API key to get
              started.
            </p>
          </div>
          <ApiKeyDialog
            trigger={<Button size="lg">Add API key</Button>}
          />
          <a
            href="https://fal.ai/dashboard/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-[var(--text-dim)] underline underline-offset-4 hover:text-[var(--text)]"
          >
            Get a key from fal.ai
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
