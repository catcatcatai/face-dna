export type WizardPhase =
  | "upload"
  | "generating"
  | "review"
  | "training-config"
  | "training"
  | "complete";

export type Resolution = "2K" | "4K";

export type RoundCount = 4 | 6;

export type RoundType =
  | "expressions"
  | "angles"
  | "outfits"
  | "reinforcement"
  | "accessories"
  | "activities";

export interface RoundConfig {
  type: RoundType;
  label: string;
  description: string;
  prompt: string;
}

export interface CroppedImage {
  id: string;
  blobUrl: string;
  falUrl?: string;
  roundType: RoundType;
  selected: boolean;
}

export interface GridResult {
  originalUrl: string;
  croppedImages: CroppedImage[];
}

export interface TrainingResult {
  loraUrl: string;
  configUrl?: string;
  triggerWord: string;
}

export interface LoraProfile {
  id: string;
  name: string;
  triggerWord: string;
  loraUrl: string;
  configUrl?: string;
  previewImageUrl: string;
  hoverImageUrl?: string;
  createdAt: string;
}

export const ROUND_CONFIGS: RoundConfig[] = [
  {
    type: "expressions",
    label: "Round 1: Expressions",
    description:
      "Different facial expressions to teach the model emotional range",
    prompt:
      "Generate variations of this person's face with different expressions - neutral, smiling, serious, surprised, laughing, eyes closed. Keep the exact same facial features. 3x3 grid.",
  },
  {
    type: "angles",
    label: "Round 2: Angles",
    description: "Different head angles to teach the model 3D structure",
    prompt:
      "Generate this person from different head angles - looking left, looking right, 3/4 view, looking up, looking down, tilted head. Keep the exact same facial features. 3x3 grid.",
  },
  {
    type: "outfits",
    label: "Round 3: Outfits & Lighting",
    description: "Different outfits and lighting conditions for variety",
    prompt:
      "Generate this person in different outfits and lighting conditions - casual clothes, formal wear, t-shirt, outdoor jacket. Keep the exact same facial features and face shape. Do not change the face. 3x3 grid.",
  },
  {
    type: "reinforcement",
    label: "Round 4: Settings & Framing",
    description:
      "Different settings and framings for additional variety",
    prompt:
      "Generate this person in different settings and framings - close-up portrait, upper body shot, outdoor background, indoor background, side profile, looking over shoulder. Keep the exact same facial features and face shape. Do not change the face. 3x3 grid.",
  },
  {
    type: "accessories",
    label: "Round 5: Accessories & Styling",
    description:
      "Accessories teach the model that the face is the constant, not what surrounds it",
    prompt:
      "Generate this person wearing different accessories and styling - wearing glasses, wearing sunglasses, wearing a hat, wearing a scarf, wearing earrings, wearing a headband. Keep the exact same facial features and face shape. Do not change the face. 3x3 grid.",
  },
  {
    type: "activities",
    label: "Round 6: Activities & Natural Poses",
    description:
      "Natural poses break portrait stiffness and add realistic variety",
    prompt:
      "Generate this person in natural activities and poses - reading a book, drinking coffee, talking on the phone, resting chin on hand, laughing with hands up, looking at a laptop. Keep the exact same facial features and face shape. Do not change the face. 3x3 grid.",
  },
];
