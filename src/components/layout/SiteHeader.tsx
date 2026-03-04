"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HowItWorksDialog } from "@/components/face-trainer/HowItWorksDialog";
import { ApiKeyDialog } from "@/components/settings/ApiKeyDialog";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <>
      {/* Top-left: tool name + nav */}
      <div className="fixed top-3.5 left-4 z-50 flex items-center gap-4" style={{ textTransform: "none" }}>
        <Link
          href="/train"
          className="text-[13px] font-normal tracking-[0.06em] text-[#a8a7a2] no-underline transition-colors duration-[250ms] hover:text-[var(--text-dim)]"
        >
          /face-dna
        </Link>
        <div className="h-4 w-px bg-[var(--cat-border)]" />
        <Link
          href="/train"
          className={`text-[13px] font-medium tracking-[0.08em] no-underline transition-colors duration-[250ms] ${
            pathname === "/train" || pathname === "/"
              ? "text-[var(--text-dim)]"
              : "text-[#a8a7a2] hover:text-[var(--text-dim)]"
          }`}
        >
          train
        </Link>
        <Link
          href="/profiles"
          className={`text-[13px] font-medium tracking-[0.08em] no-underline transition-colors duration-[250ms] ${
            pathname === "/profiles"
              ? "text-[var(--text-dim)]"
              : "text-[#a8a7a2] hover:text-[var(--text-dim)]"
          }`}
        >
          profiles
        </Link>
      </div>

      {/* Top-right: utilities + branding */}
      <div className="fixed top-3 right-4 z-50 flex items-center gap-3" style={{ textTransform: "none" }}>
        <div className="flex items-center gap-0.5 rounded-lg border border-[var(--cat-border)]/40 px-1 py-0.5">
          <HowItWorksDialog />
          <ApiKeyDialog />
        </div>
        <a
          href="https://catcatcat.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] text-[#a8a7a2] no-underline transition-colors duration-[250ms] hover:text-[var(--text-dim)]"
        >
          <strong>
            &gt;catcatcat.ai
            <span className="ml-0.5" style={{ animation: "blink 1s step-end infinite" }}>
              &#x25AE;
            </span>
          </strong>
        </a>
      </div>
    </>
  );
}
