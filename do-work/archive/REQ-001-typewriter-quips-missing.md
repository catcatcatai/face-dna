---
id: REQ-001
title: Typewriter quips missing on training screen
status: completed
completed_at: 2026-02-10T13:18:00Z
claimed_at: 2026-02-10T13:15:00Z
route: A
created_at: 2026-02-10T13:10:00Z
---

# Typewriter quips missing on training screen

## What
On the training screen (the step where the LoRA is actively being trained), the rotating typewriter microcopy that was implemented earlier is not displaying. The training quips should be cycling while the user waits.

## Context
- Tested using the 6-round training flow
- The typewriter animation was previously working — this is a regression
- The `TrainingStatus` component has a `useTypewriter` hook and `TRAINING_QUIPS` array that should be driving this

---
*Source: "On the training screen, on step when the Lora get's trained, the rotating typewriter microcopy that we implemented before is not there anymore (btw I tested on the 6 rounds option"*
