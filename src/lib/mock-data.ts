import { nanoid } from "nanoid";
import type { CroppedImage, GridResult, LoraProfile, RoundType, TrainingResult } from "@/types";
import { ROUND_CONFIGS } from "@/types";

// Map round types to their mock image files in /public/mock/
const MOCK_IMAGES: Record<string, string[]> = {
  expressions: Array.from({ length: 9 }, (_, i) => `/mock/var_expressions_${String(i + 1).padStart(3, "0")}.png`),
  angles: Array.from({ length: 9 }, (_, i) => `/mock/var_angles_${String(i + 10).padStart(3, "0")}.png`),
  outfits: Array.from({ length: 9 }, (_, i) => `/mock/var_outfits_${String(i + 19).padStart(3, "0")}.png`),
  reinforcement: Array.from({ length: 9 }, (_, i) => `/mock/var_reinforcement_${String(i + 28).padStart(3, "0")}.png`),
  accessories: Array.from({ length: 9 }, (_, i) => `/mock/var_accessories_${String(i + 37).padStart(3, "0")}.png`),
  activities: Array.from({ length: 9 }, (_, i) => `/mock/var_activities_${String(i + 46).padStart(3, "0")}.png`),
};

export function createMockGridResults(roundCount: number): GridResult[] {
  return ROUND_CONFIGS.slice(0, roundCount).map((config) => {
    const images = MOCK_IMAGES[config.type] ?? [];
    const croppedImages: CroppedImage[] = Array.from({ length: 9 }, (_, i) => ({
      id: nanoid(),
      blobUrl: images[i] ?? `/mock/var_expressions_001.png`,
      falUrl: images[i] ?? `/mock/var_expressions_001.png`,
      roundType: config.type as RoundType,
      selected: i < 7, // first 7 selected, last 2 deselected for realism
    }));

    return {
      originalUrl: images[0] ?? `/mock/var_expressions_001.png`,
      croppedImages,
    };
  });
}

export const MOCK_SOURCE_IMAGE = `/mock/var_expressions_001.png`;

export const MOCK_TRAINING_RESULT: TrainingResult = {
  loraUrl: "https://mock.fal.ai/lora/mock-lora-weights.safetensors",
  configUrl: "https://mock.fal.ai/lora/mock-config.json",
  triggerWord: "TOK",
};

// All 54 mock images paired into cards (2 per card = 27 profiles)
const ALL_MOCK_IMAGES = [
  "var_expressions_001", "var_expressions_002", "var_expressions_003",
  "var_expressions_004", "var_expressions_005", "var_expressions_006",
  "var_expressions_007", "var_expressions_008", "var_expressions_009",
  "var_angles_010", "var_angles_011", "var_angles_012",
  "var_angles_013", "var_angles_014", "var_angles_015",
  "var_angles_016", "var_angles_017", "var_angles_018",
  "var_outfits_019", "var_outfits_020", "var_outfits_021",
  "var_outfits_022", "var_outfits_023", "var_outfits_024",
  "var_outfits_025", "var_outfits_026", "var_outfits_027",
  "var_reinforcement_028", "var_reinforcement_029", "var_reinforcement_030",
  "var_reinforcement_031", "var_reinforcement_032", "var_reinforcement_033",
  "var_reinforcement_034", "var_reinforcement_035", "var_reinforcement_036",
  "var_accessories_037", "var_accessories_038", "var_accessories_039",
  "var_accessories_040", "var_accessories_041", "var_accessories_042",
  "var_accessories_043", "var_accessories_044", "var_accessories_045",
  "var_activities_046", "var_activities_047", "var_activities_048",
  "var_activities_049", "var_activities_050", "var_activities_051",
  "var_activities_052", "var_activities_053", "var_activities_054",
];

const PROFILE_NAMES = [
  "Warrior Princess", "Cyberpunk Hacker", "Fantasy Elf", "Street Samurai",
  "Noir Detective", "Space Pilot", "Desert Nomad", "Ice Queen",
  "Shadow Monk", "Neon Witch", "Forest Ranger", "Chrome Angel",
  "Storm Rider", "Jade Empress", "Void Walker", "Sun Priestess",
  "Iron Wolf", "Silk Dancer", "Rust Prophet", "Glass Thief",
  "Dawn Singer", "Night Sculptor", "Tide Watcher", "Flame Keeper",
  "Wind Chaser", "Stone Dreamer", "Star Weaver",
];

const TRIGGER_WORDS = [
  "WARPRINCESS", "CYBRHACK", "FELF", "STRTSAM",
  "NOIRDET", "SPCPLT", "DSRTNMD", "ICEQUN",
  "SHDWMNK", "NEONWTCH", "FSTRNGR", "CHRMANG",
  "STRMRDR", "JDEMPRS", "VDWLKR", "SUNPRST",
  "IRNWLF", "SLKDNCR", "RSTPRPH", "GLSTHF",
  "DWNSNGR", "NTSCLPT", "TDWTCHR", "FLMKPR",
  "WNDCHSR", "STNDRMR", "STRWVR",
];

export const MOCK_PROFILES: LoraProfile[] = Array.from({ length: 27 }, (_, i) => ({
  id: `mock-${i + 1}`,
  name: PROFILE_NAMES[i],
  triggerWord: TRIGGER_WORDS[i],
  loraUrl: `https://mock.fal.ai/lora/${PROFILE_NAMES[i].toLowerCase().replace(/ /g, "-")}.safetensors`,
  previewImageUrl: `/mock/${ALL_MOCK_IMAGES[i * 2]}.png`,
  hoverImageUrl: `/mock/${ALL_MOCK_IMAGES[i * 2 + 1]}.png`,
  createdAt: new Date(Date.now() - (i + 1) * 2 * 86400000).toISOString(),
}));
