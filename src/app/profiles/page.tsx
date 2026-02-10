"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProfileStore } from "@/store/profile-store";
import { MOCK_PROFILES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/page-loader";
import { Trash2, Copy, Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ProfilesPage() {
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
    // Already hydrated (fast path)
    if (useProfileStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return () => unsub();
  }, []);

  useEffect(() => {
    if (hydrated && isMock && !mockSeeded) {
      // Replace stale mock profiles (missing new fields) and add missing ones
      const store = useProfileStore.getState();
      const mockIds = new Set(MOCK_PROFILES.map((p) => p.id));
      const nonMockProfiles = store.profiles.filter((p) => !mockIds.has(p.id));
      useProfileStore.setState({
        profiles: [...MOCK_PROFILES, ...nonMockProfiles],
      });
      setMockSeeded(true);
    }
  }, [hydrated, isMock, mockSeeded]);

  // Show loader while store hydrates
  if (!hydrated) {
    return <PageLoader />;
  }

  const profiles = storeProfiles;

  if (profiles.length === 0) {
    return (
      <div className="animate-in fade-in duration-300 flex flex-col items-center gap-4 pt-20 text-center">
        <h1 className="text-2xl font-bold tracking-tight">No profiles yet</h1>
        <p className="text-muted-foreground">
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Profiles</h1>
        <div className="flex items-center gap-2">
          <a
            href="https://fal.ai/models/fal-ai/flux-lora"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="sm">
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              Test LoRA
            </Button>
          </a>
          <Link href={isMock ? "/train?mock=true" : "/train"}>
            <Button variant="outline" size="sm">
              Train New
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {profiles.map((profile) => (
          <div key={profile.id} className="group relative aspect-[3/4] overflow-hidden rounded-2xl">
            {/* Full-bleed image with hover swap */}
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
              <div className="absolute inset-0 bg-muted" />
            )}

            {/* Actions — all hover-reveal */}
            <div className="absolute inset-x-0 top-0 flex justify-end gap-1.5 p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <a
                href={profile.loraUrl}
                download
                className="rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              >
                <Download className="h-3.5 w-3.5" />
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(profile.loraUrl);
                  toast.success("LoRA URL copied");
                }}
                className="rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => {
                  removeProfile(profile.id);
                  toast.success("Profile deleted");
                }}
                className="rounded-full bg-red-500/60 p-2 text-white backdrop-blur-sm transition-colors hover:bg-red-500/80"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Bottom gradient overlay with info */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 pt-20">
              <span
                className="mb-2 inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm"
                style={{ boxShadow: "inset 0 0 7px #c9c9c9, inset 0 0 7px #c9c9c9, inset 0 0 8px #c9c9c9" }}
              >
                {profile.triggerWord}
              </span>
              <h3 className="text-base font-bold text-white">{profile.name}</h3>
              <p className="text-[10px] font-medium text-white/70">
                Created {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
