import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ApiKeyState {
  falApiKey: string | null;
  setFalApiKey: (key: string) => void;
  clearFalApiKey: () => void;
}

export const useApiKeyStore = create<ApiKeyState>()(
  persist(
    (set) => ({
      falApiKey: null,
      setFalApiKey: (key) => set({ falApiKey: key }),
      clearFalApiKey: () => set({ falApiKey: null }),
    }),
    {
      name: "face-dna-api-key",
    }
  )
);
