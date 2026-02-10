import { fal } from "@fal-ai/client";

fal.config({
  proxyUrl: "/api/fal/proxy",
});

export function configureFal(apiKey: string | null) {
  if (apiKey) {
    fal.config({ credentials: apiKey });
  } else {
    fal.config({ proxyUrl: "/api/fal/proxy" });
  }
}

export { fal };

export const MODELS = {
  NANO_BANANA: "fal-ai/nano-banana-pro/edit",
  LORA_TRAINING: "fal-ai/flux-lora-fast-training",
} as const;
