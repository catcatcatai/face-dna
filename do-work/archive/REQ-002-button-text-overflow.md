---
id: REQ-002
title: Round navigation button text too long
status: done
claimed_at: 2026-02-10T13:18:00Z
completed_at: 2026-02-10T13:25:00Z
route: A
created_at: 2026-02-10T13:10:00Z
---

# Round navigation button text too long

## What
On the 5th round of the 6-round training flow, the green "Next" button text reads "Next: Activities & Natural Poses" which overflows/truncates. The button text pattern "Next: [Round Name]" gets too long for some round names.

## Fix
Changed the green "Next" button in `GenerationRound.tsx` from `"Next: {round name}"` to just `"Next Round"` — short, consistent, no overflow risk.

Audited all other buttons in the generation flow:
- "Regenerate" — fine
- "Review All" (last round) — fine
- "Back to Rounds" (FinalReview) — fine
- "Continue to Training" (FinalReview) — fine
- "Back to Review" (TrainingConfig) — fine
- "Start Training" (TrainingConfig) — fine

All labels are short enough for their containers.

## Files changed
- `src/components/face-trainer/GenerationRound.tsx` line 140: `"Next: {round name}"` → `"Next Round"`
