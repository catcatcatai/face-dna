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
          <div className="rounded-full bg-muted p-3">
            <KeyRound className="size-6 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">API key required</h2>
            <p className="text-sm text-muted-foreground">
              Onset uses{" "}
              <a
                href="https://fal.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
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
            className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Get a key from fal.ai
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
