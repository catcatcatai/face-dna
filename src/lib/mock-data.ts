import { nanoid } from "nanoid";
import type { CroppedImage, GridResult, LoraProfile, RoundType, TrainingResult } from "@/types";
import { ROUND_CONFIGS } from "@/types";

// Generate a colored placeholder data URI (no external deps)
function placeholderImage(hue: number, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <rect width="512" height="512" fill="hsl(${hue}, 30%, 25%)"/>
    <text x="256" y="256" text-anchor="middle" dominant-baseline="central" fill="hsl(${hue}, 40%, 70%)" font-family="system-ui" font-size="24">${label}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function createMockGridResults(roundCount: number): GridResult[] {
  return ROUND_CONFIGS.slice(0, roundCount).map((config, roundIndex) => {
    const baseHue = roundIndex * 60;
    const croppedImages: CroppedImage[] = Array.from({ length: 9 }, (_, i) => ({
      id: nanoid(),
      blobUrl: placeholderImage(baseHue + i * 8, `${config.type} ${i + 1}`),
      falUrl: `https://mock.fal.ai/${config.type}_${i}.png`,
      roundType: config.type as RoundType,
      selected: i < 7, // first 7 selected, last 2 deselected for realism
    }));

    return {
      originalUrl: placeholderImage(baseHue, config.label),
      croppedImages,
    };
  });
}

export const MOCK_SOURCE_IMAGE = placeholderImage(200, "Source Face");

export const MOCK_TRAINING_RESULT: TrainingResult = {
  loraUrl: "https://mock.fal.ai/lora/mock-lora-weights.safetensors",
  configUrl: "https://mock.fal.ai/lora/mock-config.json",
  triggerWord: "TOK",
};

export const MOCK_PROFILES: LoraProfile[] = [
  {
    id: "mock-1",
    name: "Warrior Princess",
    triggerWord: "WARPRINCESS",
    loraUrl: "https://mock.fal.ai/lora/warrior-princess.safetensors",
    configUrl: "https://mock.fal.ai/lora/warrior-princess-config.json",
    previewImageUrl: placeholderImage(280, "Warrior Princess"),
    hoverImageUrl: placeholderImage(300, "WP — Smiling"),
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "mock-2",
    name: "Cyberpunk Hacker",
    triggerWord: "CYBRHACK",
    loraUrl: "https://mock.fal.ai/lora/cyberpunk-hacker.safetensors",
    previewImageUrl: placeholderImage(160, "Cyberpunk Hacker"),
    hoverImageUrl: placeholderImage(180, "CH — Serious"),
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "mock-3",
    name: "Fantasy Elf",
    triggerWord: "FELF",
    loraUrl: "https://mock.fal.ai/lora/fantasy-elf.safetensors",
    configUrl: "https://mock.fal.ai/lora/fantasy-elf-config.json",
    previewImageUrl: placeholderImage(100, "Fantasy Elf"),
    hoverImageUrl: placeholderImage(120, "FE — Laughing"),
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
];
