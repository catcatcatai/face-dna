# Onset

Train a face LoRA from a single photo. Onset bootstraps a complete training dataset — expressions, angles, outfits, lighting — from one reference image, then trains a LoRA model via fal.ai.

## Features

- **One-photo dataset** — upload a single face image, get 36-54 curated training images across 4-6 variation rounds
- **Progressive generation** — expressions, angles, outfits, framing, accessories, poses. Each round feeds prior selections as anchors
- **Manual curation** — select/deselect individual images per round before moving on
- **Configurable** — 2K or 4K generation resolution, 4 or 6 rounds, cost estimate upfront
- **LoRA training** — bundles your curated dataset and submits to fal.ai Flux LoRA training
- **Profile library** — saved LoRAs with trigger words, downloadable weights, hover image previews

## Quick Start

```bash
git clone https://github.com/catcatcatai/onset.git
cd onset
npm install
npm run dev
```

Opens at `http://localhost:3000`. You'll need a [fal.ai API key](https://fal.ai/dashboard/keys) to generate images and train.

## How It Works

1. Upload a clear, front-facing photo
2. Onset generates a 3x3 grid of face variations per round using NanoBanana
3. You curate — keep the good ones, drop the drifted faces
4. After all rounds, review the full dataset and configure your LoRA (name, trigger word)
5. Training runs on fal.ai (~$2, ~5-10 min) and saves to your profile library

## Tech Stack

| | |
|---|---|
| Framework | Next.js 15, App Router, TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| State | Zustand (session + localStorage) |
| AI | fal.ai (NanoBanana generation + Flux LoRA training) |
| Font | [Roboto Mono](https://fonts.google.com/specimen/Roboto+Mono) |

## Cost

| | |
|---|---|
| Generation (4K) | ~$0.30/round |
| Generation (2K) | ~$0.15/round |
| LoRA training | ~$2.00 |
| **Total (6 rounds, 4K)** | **~$3.80** |

## License

MIT
