# Project Plan

## Goals
Build a web app that bootstraps a LoRA training dataset from a single face image, then trains a face-only LoRA via fal.ai. Iterative human-in-the-loop: AI generates, user eliminates bad outputs, face locks in tighter each round.

## Scope
### In Scope
- Single face image upload
- 4 or 6-round generation (user-selectable)
- Resolution picker (2K or 4K, with cost transparency)
- Elimination-based curation (all selected by default)
- LoRA training via fal.ai
- Profile system for saving trained LoRAs
- Dark mode UI
- User API key settings (localStorage, with server key fallback)
- Cost estimate display on upload step
- "How it works" explainer dialog
- Mock/design mode (`?mock=true`)

### Out of Scope (V1)
- Multi-character support
- Caption review/editing
- Intelligence layer (LLM analyzing selections)
- NSFW support
- Auto image enhancement/preprocessing
- Vercel deployment optimization (queue+poll)

## Phases
- [x] Phase A: Scaffolding
- [x] Phase B: Upload step
- [x] Phase C: Generation + cropping (4 rounds)
- [x] Phase D: Final review
- [x] Phase E: Training + profiles
- [x] Phase F: Bug fixes (training flow, Round 4, error display)
- [x] Phase G: API key settings + wizard gating + mock mode + cost/info UX
- [ ] Phase H: UI design polish
- [ ] Phase I: Full end-to-end testing + GitHub push
