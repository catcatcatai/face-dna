"use client";

import { useEffect } from "react";
import { useApiKeyStore } from "@/store/api-key-store";
import { configureFal } from "@/lib/fal";

export function FalConfigProvider({ children }: { children: React.ReactNode }) {
  const falApiKey = useApiKeyStore((s) => s.falApiKey);

  useEffect(() => {
    configureFal(falApiKey);
  }, [falApiKey]);

  return <>{children}</>;
}
