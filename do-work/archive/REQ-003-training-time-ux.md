---
id: REQ-003
title: Training screen needs time expectation and elapsed timer
status: done
claimed_at: 2026-02-10T13:26:00Z
completed_at: 2026-02-10T13:30:00Z
route: A
created_at: 2026-02-10T13:10:00Z
---

# Training screen needs time expectation and elapsed timer

## Fix
Added two elements below the typewriter quips on the training-in-progress screen:

1. **Live elapsed timer**: `useElapsedTimer` hook starts when `isTraining` becomes true, ticks every second. Displays "3m 42s elapsed" using existing `formatDuration()`.
2. **Time expectation**: Static text "typically takes 5–10 min".

Layout: `{elapsed} · typically takes 5–10 min` in muted text below the quip line.

Timer resets to 0 when training stops (success or error).

## Files changed
- `src/components/face-trainer/TrainingStatus.tsx`: Added `useElapsedTimer` hook, wired into training screen UI
