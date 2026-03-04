# Promo Video Assets

Drop screenshot assets into `public/promo/` (Remotion serves static files from the `public/` directory).

## Required Assets

| File | Description | Used in |
|------|-------------|---------|
| `source-face.png` | The single reference face photo (square crop, ~512px) | Hook, Grid scenes |
| `grid-expressions.png` | Screenshot of a 3x3 grid from the Expressions round | Rounds scene |
| `grid-angles.png` | Screenshot of a 3x3 grid from the Angles round | Rounds scene |
| `grid-outfits.png` | Screenshot of a 3x3 grid from the Outfits round | Rounds scene |
| `grid-settings.png` | Screenshot of a 3x3 grid from the Settings round | Rounds scene |
| `profile-card.png` | Screenshot of a completed LoRA profile card | Result scene |

## Optional Assets

| File | Description | Used in |
|------|-------------|---------|
| `variation-1.png` through `variation-9.png` | Individual cropped face variations for the grid animation (skip 5 — that's the center/original) | Grid scene |

## Directory Structure

```
public/
└── promo/
    ├── source-face.png
    ├── grid-expressions.png
    ├── grid-angles.png
    ├── grid-outfits.png
    ├── grid-settings.png
    ├── profile-card.png
    └── variation-{1-9}.png  (optional)
```

All images will gracefully fall back to labeled placeholders if missing — you can preview animation timing without assets.
