"use client";

import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

export function HowItWorksDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground hover:text-foreground"
        >
          <CircleHelp className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>How Onset works</DialogTitle>
          <DialogDescription>
            Train a face LoRA from a single photo — no dataset required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm text-muted-foreground">
          <section className="space-y-1.5">
            <h3 className="font-medium text-foreground">The problem</h3>
            <p>
              Training a face LoRA typically requires 20-50+ diverse photos of
              the same person — different angles, expressions, lighting, and
              outfits. Most people don't have that, especially for fictional
              characters or AI-generated faces.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-medium text-foreground">The solution</h3>
            <p>
              Onset bootstraps an entire training dataset from a single
              reference image using fal.ai's NanoBanano model — currently
              the most accurate model for maintaining face consistency across
              generated variations.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-medium text-foreground">
              3x3 grid generation
            </h3>
            <p>
              Each generation produces a 3x3 grid of 9 face variations in a
              single API call, then crops them into individual images. This
              means 9 training images for the price of 1 generation —
              dramatically reducing cost compared to generating images
              one-by-one.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-medium text-foreground">
              Progressive variation
            </h3>
            <p>
              Each round targets a specific type of variation — expressions,
              then angles, then outfits, then framing. Previous selections
              are fed back as references, so the model stays anchored to the
              face while progressively expanding diversity. You curate at each
              step, eliminating any images where the face drifted.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-medium text-foreground">Cost breakdown</h3>
            <div className="rounded-md border border-border bg-muted/50 p-3 text-xs">
              <div className="grid grid-cols-2 gap-y-1">
                <span>4 rounds at 2K:</span>
                <span className="text-right">~$0.60</span>
                <span>4 rounds at 4K:</span>
                <span className="text-right">~$1.20</span>
                <span>LoRA training:</span>
                <span className="text-right">~$2.00</span>
                <div className="col-span-2 my-1 border-t border-border" />
                <span className="font-medium text-foreground">Total (2K):</span>
                <span className="text-right font-medium text-foreground">
                  ~$2.60
                </span>
              </div>
            </div>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-medium text-foreground">The result</h3>
            <p>
              A trained LoRA model you can use in any Flux-compatible pipeline
              with a simple trigger word. From one photo to a production-ready
              face model in under 10 minutes.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
