import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LoraProfile } from "@/types";

interface ProfileState {
  profiles: LoraProfile[];
  addProfile: (profile: LoraProfile) => void;
  removeProfile: (id: string) => void;
  getProfile: (id: string) => LoraProfile | undefined;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profiles: [],

      addProfile: (profile) =>
        set((state) => ({
          profiles: [profile, ...state.profiles],
        })),

      removeProfile: (id) =>
        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== id),
        })),

      getProfile: (id) => get().profiles.find((p) => p.id === id),
    }),
    {
      name: "onset-profiles",
    }
  )
);
