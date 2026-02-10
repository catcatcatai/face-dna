# Decisions Log

## NanoBanana over PuLID
**Date:** 2026-02-06
**Context:** Need AI model for face variation generation
**Options:** PuLID, NanoBanana
**Choice:** NanoBanana (fal-ai/nano-banana-pro/edit)
**Rationale:** PuLID produced generic "AI pretty girl" faces, lost distinctive features. NanoBanana maintains identity, accepts multiple references, outputs configurable grids.

## Prompt-based 3x3 grid approach
**Date:** 2026-02-06
**Context:** Need 9 images per round, NanoBanana max num_images is 4
**Options:** Multiple API calls (2-3x per round), prompt-based grid (1 call + crop)
**Choice:** Prompt-based grid with Canvas crop
**Rationale:** Tested and produces perfect grids. Cheaper (1 call vs 3). Simple divide-by-3 crop algorithm. Regenerate button as fallback.

## flux-lora-fast-training for LoRA training
**Date:** 2026-02-06
**Context:** Multiple fal.ai LoRA training endpoints available
**Options:** flux-lora-fast-training ($2), flux-2-trainer ($8), flux-lora-portrait-trainer ($2.40)
**Choice:** flux-lora-fast-training
**Rationale:** Cheapest, includes auto face masking (create_masks: true), auto captioning. Good enough for face LoRAs.

## Blocking training route (not queue+poll)
**Date:** 2026-02-06
**Context:** LoRA training takes 5-10 min
**Options:** Blocking fal.subscribe in API route, queue.submit + client polling
**Choice:** Blocking for V1
**Rationale:** Simpler. Works for local dev. Known limitation: will timeout on Vercel (60s). Switch to queue+poll when deploying.

## Multi-workflow routing from day 1
**Date:** 2026-02-06
**Context:** This trainer is workflow 1 of many. LoRAs become "profiles" for other workflows.
**Options:** Single page app, route-based multi-page
**Choice:** Route-based (/train, /profiles, future /generate)
**Rationale:** Minimal extra work now. Profiles persist in localStorage. Clean separation for future workflows.

## 4 rounds instead of 3
**Date:** 2026-02-06
**Context:** First real test showed Round 3 (outfits & lighting) has higher face drift. User eliminated more photos, ending with 23 total — close to the minimum.
**Options:** Keep 3 rounds (accept lower counts), add Round 4
**Choice:** Added Round 4 — "Settings & Framing" (different framings, backgrounds, angles)
**Rationale:** 4 rounds x 9 = 36 candidates, comfortable margin even with heavy elimination. Round 4 adds variety via framing (close-up, upper body, side profile) and settings (outdoor, indoor) rather than repeating Round 1's expression focus — redundant data doesn't help the LoRA.

## Round 3 prompt: outfits over lighting-only
**Date:** 2026-02-06
**Context:** Originally Round 3 was lighting variations only
**Options:** Lighting-only prompt, outfits + lighting prompt
**Choice:** Outfits + lighting: "casual clothes, formal wear, t-shirt, outdoor jacket"
**Rationale:** User preference. More variety in training data. Face-only LoRA — body/clothing not locked in, so outfit variation during training helps the model learn to keep face consistent regardless of clothing.

## 2K resolution (not 4K) → user-selectable
**Date:** 2026-02-06, **Updated:** 2026-02-07
**Context:** Generation resolution affects cost and training image quality
**Options:** 2K (~683px per cell), 4K (~1365px per cell)
**Choice:** User-selectable on upload step. 2K default, 4K opt-in with cost warning ($0.30/round vs $0.15/round).
**Rationale:** Originally hardcoded 2K. Made configurable so users can choose quality vs cost tradeoff.

## Configurable round count (4 or 6)
**Date:** 2026-02-07
**Context:** 4 rounds produce ~36 candidates. More rounds = more variety but more cost/time.
**Options:** Fixed 4 rounds, fixed 6 rounds, user-selectable
**Choice:** User-selectable on upload step. 4 rounds default, 6 rounds opt-in.
**Rationale:** Round 5 (Accessories & Styling) teaches model face-is-invariant by adding glasses/hats/scarves. Round 6 (Activities & Natural Poses) breaks portrait stiffness with natural body language. Both are genuinely useful for LoRA robustness but not essential — let the user decide.

## Client-side API key over server-only
**Date:** 2026-02-09
**Context:** Going public on GitHub. Users need to provide their own fal.ai key — no shared key.
**Options:** Server-only (.env.local required), client-side key in localStorage, OAuth flow
**Choice:** Client-side key in localStorage + server fallback
**Rationale:** Self-hosted app — user's own key, their own browser. `fal.config({ credentials })` bypasses proxy when key is present. Server `FAL_KEY` still works as fallback for personal/dev use. Training route receives key via `x-fal-key` header since it runs server-side. No auth server needed.

## Mock mode for design iteration
**Date:** 2026-02-09
**Context:** Need to iterate on UI design without burning fal.ai API tokens
**Options:** Storybook, mock API middleware, query param mock mode
**Choice:** `?mock=true` query param that seeds stores with placeholder data + floating phase navigator
**Rationale:** Zero additional deps. Seeds trainer-store with SVG placeholder images, profile-store with mock profiles. Phase nav pill bar lets you jump to any wizard screen instantly. Lives alongside real app — no separate build step.

## Roboto Mono as app font
**Date:** 2026-02-09
**Context:** Default Geist/Geist_Mono felt generic. Explored 10 fonts via design lab (Geist, Inter, DM Sans, Plus Jakarta Sans, Outfit, Sora, Courier Prime, Rubik, Arvo, Lato, Roboto Mono).
**Options:** All 10 fonts tested side-by-side
**Choice:** Roboto Mono
**Rationale:** User preference. Monospace gives the app a technical/hacker aesthetic that fits the AI training theme. Clean, highly legible at small sizes, good weight range.

## Lime accent color
**Date:** 2026-02-09
**Context:** App started achromatic, moved to violet, then explored 8 accent colors via design lab (Violet, Cyan, Emerald, Amber, Rose, Blue, Lime, Orange).
**Choice:** Lime — `oklch(0.82 0.19 130)` / hex ~`#8BE83B`
**Rationale:** User preference. Lime + dark mode + monospace font = cyberpunk/terminal aesthetic. High contrast against dark backgrounds. Used for primary buttons, selection rings, glow effects, progress bars.

## Typewriter animation for training quips
**Date:** 2026-02-09
**Context:** Static "Training in progress..." text during 5-10 min training wait. Explored 5 animation styles via design lab (Scramble Decode, Typewriter, Slide Up, Blur Reveal, Fade).
**Choice:** Typewriter — characters appear one at a time (35ms/char), blinking cursor, 8s hold between messages, 20 rotating quips.
**Rationale:** User preference. Terminal-output feel matches monospace font. More engaging than static text during a long wait. Random start index prevents repetitive experience.

## GridLoader (Remotion) for training loading
**Date:** 2026-02-09
**Context:** Training screen needed a visually engaging loader. Had a custom Remotion GridLoader component already built (3x3 grid with entrance, fill, merge, exit animations at 120fps).
**Choice:** Use GridLoader via `@remotion/player` inline
**Rationale:** Already built, matches lime accent color (`#8BE83B`), spring physics feel premium. Remotion Player embeds as a React component — no video file needed.

## Round 5 & 6 content choices
**Date:** 2026-02-07
**Context:** Needed 2 extra rounds that add genuine variety without redundancy.
**Options considered:** Lighting moods, accessories, activities, age variation, hair variation
**Choice:** Accessories & Styling (R5), Activities & Natural Poses (R6)
**Rationale:** Accessories force model to learn face separate from adornments (glasses, hats etc.). Activities add realistic variety in body language that prevents stiff-portrait bias. Lighting moods rejected because Round 3 already partially covers it. Age/hair variation rejected — too high drift risk with NanoBanana.
