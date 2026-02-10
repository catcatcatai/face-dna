---
id: REQ-004
title: Audit API key gating and error handling
status: pending
created_at: 2026-02-10T13:10:00Z
---

# Audit API key gating and error handling

## What
Verify and harden the flow when a user doesn't have an API key configured before starting the training process. The current gating logic (check user key → check server key → show ApiKeyPrompt) should prevent this, but user wants confirmation that it's solid.

## Context
- During testing, the "Add API Key" button appeared inactive in the nav, but the trainer was still usable — this is expected behavior when a server-side `FAL_KEY` env var is set (dual auth pattern)
- The wizard gating in `FaceTrainer.tsx` checks: user key OR server key → allow, neither → show `ApiKeyPrompt`
- Need to verify: what happens if neither key exists? Does the user see a clear error? Can they accidentally get partway through the flow and then hit a wall?
- Also verify the training API route (`/api/train`) returns a clear error if no key is provided via header or env

---
*Source: "is there some type of error handling of the user doesn't input his API key before he start training process? During the test, the Add KPI key button was inactive, but it allowed me to use the trainer, so I didn't get to see how this specific moment was handled"*
