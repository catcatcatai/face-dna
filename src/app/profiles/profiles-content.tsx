"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProfileStore } from "@/store/profile-store";
import { MOCK_PROFILES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/page-loader";
import { Trash2, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function ProfilesContent() {
  const searchParams = useSearchParams();
  const isMock = searchParams.get("mock") === "true";

  const storeProfiles = useProfileStore((s) => s.profiles);
  const removeProfile = useProfileStore((s) => s.removeProfile);
  const [hydrated, setHydrated] = useState(false);
  const [mockSeeded, setMockSeeded] = useState(false);

  // Wait for Zustand localStorage hydration
  useEffect(() => {
    const unsub = useProfileStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    if (useProfileStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return () => unsub();
  }, []);

  useEffect(() => {
    if (hydrated && isMock && !mockSeeded) {
      const store = useProfileStore.getState();
      const mockIds = new Set(MOCK_PROFILES.map((p) => p.id));
      const nonMockProfiles = store.profiles.filter((p) => !mockIds.has(p.id));
      useProfileStore.setState({
        profiles: [...MOCK_PROFILES, ...nonMockProfiles],
      });
      setMockSeeded(true);
    }
  }, [hydrated, isMock, mockSeeded]);

  if (!hydrated) {
    return <PageLoader />;
  }

  const profiles = storeProfiles;

  if (profiles.length === 0) {
    return (
      <div className="animate-in fade-in duration-300 flex flex-col items-center gap-4 pt-20 text-center">
        <h2 className="text-[13px] font-semibold tracking-[0.06em]">No profiles yet</h2>
        <p className="text-[11px] text-[var(--text-dim)]">
          Train a LoRA to create your first character profile.
        </p>
        <Link href={isMock ? "/train?mock=true" : "/train"}>
          <Button>Train a LoRA</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-[13px] font-semibold tracking-[0.06em]">Profiles</h2>
        <p className="text-[11px] text-[var(--text-dim)]">
          Your trained face LoRAs.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="group relative overflow-hidden rounded-lg border border-[var(--cat-border)] bg-[var(--surface)]"
          >
            {/* Full-bleed image with hover swap */}
            <div className="relative aspect-[3/4]">
              {profile.previewImageUrl ? (
                <>
                  <img
                    src={profile.previewImageUrl}
                    alt={profile.name}
                    className="absolute inset-0 h-full w-full object-cover transition-all duration-300 ease-out group-hover:scale-105 group-hover:opacity-0"
                  />
                  {profile.hoverImageUrl && (
                    <img
                      src={profile.hoverImageUrl}
                      alt={profile.name}
                      className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-300 ease-out group-hover:scale-105 group-hover:opacity-100"
                    />
                  )}
                </>
              ) : (
                <div className="absolute inset-0 bg-[var(--surface-2)]" />
              )}

              {/* Actions — hover-reveal */}
              <div className="absolute inset-x-0 top-0 flex justify-end gap-1.5 p-3 opacity-0 transition-opacity duration-[200ms] group-hover:opacity-100">
                <a
                  href={profile.loraUrl}
                  download
                  className="rounded-full bg-[var(--surface)]/80 p-2 text-[var(--text-dim)] backdrop-blur-sm transition-colors duration-[200ms] hover:text-[var(--text)]"
                >
                  <Download className="h-3.5 w-3.5" />
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(profile.loraUrl);
                    toast.success("LoRA URL copied");
                  }}
                  className="rounded-full bg-[var(--surface)]/80 p-2 text-[var(--text-dim)] backdrop-blur-sm transition-colors duration-[200ms] hover:text-[var(--text)]"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => {
                    removeProfile(profile.id);
                    toast.success("Profile deleted");
                  }}
                  className="rounded-full bg-destructive/10 p-2 text-destructive backdrop-blur-sm transition-colors duration-[200ms] hover:bg-destructive/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Solid info strip */}
            <div className="bg-[var(--surface)] px-4 py-3">
              <span className="text-[10px] font-semibold tracking-[0.08em] text-[var(--text-dim)]">
                {profile.triggerWord}
              </span>
              <h3 className="text-[13px] font-medium text-[var(--text)]">{profile.name}</h3>
              <p className="text-[10px] text-[var(--text-dim)]">
                Created {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
