# Project Status

## Phase
`v1-polish` — Core features done, UI polish pass complete, ready for real-world testing

## Current Focus
Polish pass wrapped. Next: real API testing, deployment prep, cleanup.

## What's Done
- Project scaffolded (Next.js 15, Tailwind v4, shadcn/ui)
- Upload step with drag-and-drop
- 4-round generation workflow (expressions, angles, outfits & lighting, settings & framing)
- Optional 6-round extended workflow (+accessories & styling, +activities & natural poses)
- Resolution picker: 2K ($0.15/round) or 4K ($0.30/round)
- Round count picker: 4 (standard) or 6 (extended)
- Grid cropping (Canvas API, 3x3)
- Elimination-based image selection
- Final review with count warnings
- Training config (profile name + trigger word)
- Training API route (ZIP + fal.ai flux-lora-fast-training)
- Training status + completion display
- Profile system (localStorage persist)
- Profiles page with CRUD
- Nav with routing (/train, /profiles)
- **API key settings** — user-provided key via dialog, persisted in localStorage, wizard gated until key available, server FAL_KEY as fallback
- **Cost estimate** — upload step shows generation + training cost breakdown
- **"How it works" dialog** — explains the workflow innovation (3x3 grid, progressive variation, NanoBanana)
- **Mock mode** — `?mock=true` on /train and /profiles, floating phase navigator, placeholder data, no API calls

## Recent Changes (UI Polish + Layout Redesign)
### Visual Identity
- **Font**: Roboto Mono — monospace throughout (replaced Geist/Geist_Mono)
- **Accent color**: Lime `oklch(0.82 0.19 130)` / `#8BE83B` (replaced achromatic → violet → lime)
- Glow custom properties (`--glow-primary`, `--glow-primary-lg`) using lime
- Button `active:scale-[0.98]`, Card softer border + dark shadow

### Layout Redesign (via Design Lab exploration)
- **UploadStep**: Side-by-side grid (image left, options right) after image selected; full-width drop zone before
- **GenerationRound**: Sidebar + canvas layout (controls/progress left sidebar, grid right)
- **Profiles**: Full-bleed image cards with gradient overlay, glassmorphic trigger word chips

### Polish Details
- Phase transition animations (fade-in + slide-in-from-bottom on phase change)
- ImageCell: glow on selected, softer deselect (opacity-50 grayscale-[80%]), hover zoom
- Skeleton grid loader for generation (9 pulsing placeholders)
- **GridLoader** (Remotion) on training screen — 3x3 grid animation with spring physics
- **Typewriter quips** during training — 20 rotating messages, 35ms/char, 8s hold, blinking cursor
- **Download reference images** button on completion — JSZip client-side ZIP of all selected training images
- 4K warning with smooth bidirectional height + opacity animation (grid-template-rows + quint ease-out transforms)
- Profile cards: copy URL always visible, delete hover-only, snappy 200ms hover zoom
- Nav API key text hidden on mobile
- Layout padding adjusted (pt-10 pb-16)

### Design Lab (temporary, needs cleanup)
- `src/app/design-lab/` — currently shows animation variant explorer (5 text animation approaches)
- `src/app/design-lab/layout.tsx` — loads multiple Google Fonts for exploration

## Bug Fixes Applied
- Training "nothing happens" bug: `startTraining` now uploads images missing `falUrl` before sending to API
- Added Round 4 (settings & framing) for additional variety
- React hooks ordering fix in FaceTrainer (conditional return after hooks)
- Turbopack cache corruption — fixed by clearing `.next`

## Next Steps
- [ ] Clean up design lab files (`src/app/design-lab/`, `.claude-design/`)
- [ ] Check if `RoundProgress.tsx` is orphaned after GenerationRound sidebar refactor
- [ ] Continue UI detail refinements as needed
- [ ] Test the trained LoRA with inference
- [ ] Verify Round 4 settings & framing prompt quality
- [ ] Test extended rounds (5 & 6) with real API
- [ ] Test 4K resolution generation quality vs 2K
- [ ] Push to GitHub (public repo)
