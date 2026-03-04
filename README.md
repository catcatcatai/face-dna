# face-dna

Train a face LoRA from a single photo. face-dna bootstraps a complete training dataset — expressions, angles, outfits, lighting — from one reference image, then trains a LoRA model via fal.ai.

<img width="1040" height="770" alt="4" src="https://github.com/user-attachments/assets/7172006c-ed8c-48f8-b45d-cc7ce092c86a" />


## Features

- **One-photo dataset** — upload a single face image, get 36-54 curated training images across 4-6 variation rounds
- **Progressive generation** — expressions, angles, outfits, framing, accessories, poses. Each round feeds prior selections as anchors
- **Manual curation** — select/deselect individual images per round before moving on
- **Configurable** — 2K or 4K generation resolution, 4 or 6 rounds, cost estimate upfront
- **LoRA training** — bundles your curated dataset and submits to fal.ai Flux LoRA training
- **Profile library** — saved LoRAs with trigger words, downloadable weights, hover image previews

## Quick Start

```bash
git clone https://github.com/catcatcatai/face-dna.git
cd face-dna
npm install
npm run dev
```

Opens at `http://localhost:3000`. You'll need a [fal.ai API key](https://fal.ai/dashboard/keys) to generate images and train.

## How It Works

1. Upload a clear, front-facing photo
2. face-dna generates a 3x3 grid of face variations per round using NanoBanano
3. You curate — keep the good ones, drop the drifted faces
4. After all rounds, review the full dataset and configure your LoRA (name, trigger word)
5. Training runs on fal.ai (~$2, ~5-10 min) and saves to your profile library

## Tech Stack

| | |
|---|---|
| Framework | Next.js 15, App Router, TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Design | cat-1a (warm greige, IBM Plex Mono, monochrome) |
| State | Zustand (session + localStorage) |
| AI | fal.ai (NanoBanana generation + Flux LoRA training) |

## Cost

| | |
|---|---|
| Generation (4K) | ~$0.30/round |
| Generation (2K) | ~$0.15/round |
| LoRA training | ~$2.00 |
| **Total (6 rounds, 4K)** | **~$3.80** |

## License

MIT
