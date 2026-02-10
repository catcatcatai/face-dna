# Architecture

## Overview
Multi-workflow app. Currently: Workflow 1 (LoRA face trainer). Future: image generation workflows consuming trained LoRAs as "profiles."

## Stack
- Next.js 15 (App Router, TypeScript, src/)
- Tailwind CSS v4 + shadcn/ui (new-york, dark mode)
- Zustand (wizard: no persist, profiles: localStorage persist)
- fal.ai (@fal-ai/client + @fal-ai/server-proxy)
- JSZip (server-side ZIP creation)
- Canvas API (client-side grid cropping)

## Key Patterns
- **Dual auth**: User API key (localStorage) takes priority. Falls back to server-side `FAL_KEY` via proxy. Wizard gated until one is available.
- **Proxy pattern**: `/api/fal/proxy` — used when no user key, FAL_KEY stays server-side
- **Client credentials**: When user provides key, `fal.config({ credentials })` bypasses proxy
- **FalConfigProvider**: Wraps app in layout, syncs `api-key-store` → `fal.config()` via useEffect
- **Wizard flow**: Single Zustand store drives linear phase progression
- **Wizard gating**: FaceTrainer checks user key → `/api/fal/status` → ApiKeyPrompt
- **Elimination model**: All images selected by default, user removes bad ones
- **Reference accumulation**: Each round adds selected images to next round's references (capped at 14)
- **Profile persistence**: Completed LoRAs saved to localStorage via Zustand persist
- **Lazy upload**: `startTraining` uploads any images missing `falUrl` on-demand before training
- **Mock mode**: `?mock=true` seeds stores with placeholder data, shows phase navigator, no API calls

## Generation Rounds (4 standard, 6 extended — user-selectable)
1. Expressions (face lock-in)
2. Angles (3D structure)
3. Outfits & Lighting (variety — higher drift risk)
4. Settings & Framing (close-up, upper body, outdoor/indoor, side profile)
5. Accessories & Styling _(extended)_ — forces model to learn face as invariant
6. Activities & Natural Poses _(extended)_ — breaks portrait stiffness

Resolution (2K/4K) and round count (4/6) are user-configurable on the upload step. Stored in trainer-store, not persisted. All rounds use 1:1 aspect ratio, prompt-based 3x3 grid.

## Data Flow
```
Upload → fal.storage.upload() → sourceFalUrl
  ↓
Round 1-N: NanoBanana(image_urls, prompt, resolution) → grid image → Canvas crop → 9 blobs
  ↓ (selected images uploaded to fal.storage between rounds)
Final Review → confirm selections
  ↓
Training Config → profile name + trigger word
  ↓
startTraining → upload any missing images → POST /api/train
  ↓
/api/train: fetch images → JSZip → fal.storage → flux-lora-fast-training
  ↓
Completion → save to profile store (localStorage)
```

## File Structure
- `src/app/` — pages + API routes
- `src/components/face-trainer/` — wizard step components + mock phase nav + how-it-works dialog
- `src/components/layout/` — nav (includes API key button)
- `src/components/providers/` — FalConfigProvider (syncs API key to fal client)
- `src/components/settings/` — ApiKeyDialog, ApiKeyPrompt
- `src/store/` — Zustand stores (trainer-store, profile-store, api-key-store)
- `src/lib/` — fal config (+ configureFal), grid cropper, mock data, utils
- `src/types/` — TypeScript interfaces + round configs
