import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_HUE, PRIMARY_C } from "@/lib/color";

const DIM_RATIO = 0.05 / 0.19;

function syncCss(hue: number, chroma: number) {
  if (typeof document !== "undefined") {
    const s = document.documentElement.style;
    s.setProperty("--accent-hue", String(hue));
    s.setProperty("--accent-chroma", String(chroma));
    s.setProperty("--accent-chroma-dim", String(chroma * DIM_RATIO));
  }
}

interface AccentState {
  hue: number;
  chroma: number;
  setAccent: (hue: number, chroma?: number) => void;
  resetAccent: () => void;
}

export const useAccentStore = create<AccentState>()(
  persist(
    (set) => ({
      hue: DEFAULT_HUE,
      chroma: PRIMARY_C,
      setAccent: (hue, chroma = PRIMARY_C) => {
        syncCss(hue, chroma);
        set({ hue, chroma });
      },
      resetAccent: () => {
        syncCss(DEFAULT_HUE, PRIMARY_C);
        set({ hue: DEFAULT_HUE, chroma: PRIMARY_C });
      },
    }),
    {
      name: "onset-accent",
      onRehydrateStorage: () => (state) => {
        if (state) syncCss(state.hue, state.chroma);
      },
    }
  )
);
