---
id: REQ-004
title: Audit API key gating and error handling
status: done
claimed_at: 2026-02-10T13:31:00Z
completed_at: 2026-02-10T13:35:00Z
route: B
created_at: 2026-02-10T13:10:00Z
---

# Audit API key gating and error handling

## Audit Result: SOLID — No changes needed

### Entry Gate (FaceTrainer.tsx)
- Checks `falApiKey` (user, localStorage) OR `hasServerKey` (server env, via `/api/fal/status`)
- If neither exists → shows `ApiKeyPrompt` with "Add API key" + link to fal.ai dashboard
- While checking server key → shows `PageLoader` (no blank flash)
- Re-evaluates reactively — if user removes key mid-flow, gets bounced to prompt

### Generation Phase (client-side fal.subscribe)
- User key → direct to fal.ai
- No user key → proxy route uses server `FAL_KEY`
- Error caught in `generateRound()` → shown with AlertCircle + "Try Again" button

### Training Phase (/api/train server route)
- Independent key check: `userKey || process.env.FAL_KEY`
- If neither → 401: "No API key provided. Add one in Settings or set FAL_KEY in .env.local."
- Error surfaces in TrainingStatus error UI with "Try Again" / "Start Over"

### Why user's observation was expected
"Add API Key button was inactive" = the nav button shows as inactive/muted when no user key is set.
"But trainer still worked" = server-side `FAL_KEY` was configured, so the gate allowed entry via `hasServerKey === true`.
This is the designed dual-auth behavior — not a bug.

### Edge cases verified
- No key at all → blocked at gate, never enters wizard
- Key removed mid-flow → FaceTrainer re-renders, bounces to ApiKeyPrompt
- Key removed mid-training → in-flight request already has key in header, completes fine
- Proxy without FAL_KEY → fal.ai returns auth error, caught and displayed
