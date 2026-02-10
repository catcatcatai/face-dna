---
id: REQ-003
title: Training screen needs time expectation and elapsed timer
status: pending
created_at: 2026-02-10T13:10:00Z
---

# Training screen needs time expectation and elapsed timer

## What
Two improvements to the training-in-progress screen:

1. **Set expectations**: Tell the user training typically takes 5-10 minutes. Currently there's no indication of how long this will take, which causes anxiety.
2. **Elapsed timer**: Show a live timer counting up so the user knows how much time has passed. Something like "3m 42s elapsed" updating in real-time.

## Context
- User's test took just over 6 minutes — within the 5-10 min range
- The `trainingDurationMs` was already added to the store for the completion screen, but there's no live counter during training
- This is the screen with the GridLoader animation and typewriter quips

---
*Source: "on the step where the Lora is getting trained. It took a bit over 6 minutes, so we need to let the user know that it can take 5-10 minutes. Also maybe should add some type of timer, so that the user know how much time has past?"*
