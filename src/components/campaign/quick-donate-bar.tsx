"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PRESETS = [1000, 2500, 5000, 10000] as const;

interface QuickDonateBarProps {
  slug: string;
}

// Mobile-only sticky donate bar. Hidden on lg+ because the desktop layout
// already has a sticky sidebar with a Donate Now button — showing both
// would crowd the screen and double the CTA. Deep-links to the existing
// checkout page with ?amount= so we don't duplicate any payment logic.
export function QuickDonateBar({ slug }: QuickDonateBarProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<number>(2500);

  function handleDonate() {
    router.push(`/causes/${slug}/checkout?amount=${selected}`);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-border bg-primary shadow-[0_-8px_24px_rgba(0,0,0,0.18)] lg:hidden">
      <div className="mx-auto max-w-screen-md px-4 py-3">
        <div className="mb-3 flex gap-2 overflow-x-auto">
          {PRESETS.map((amt) => {
            const isActive = selected === amt;
            return (
              <button
                key={amt}
                type="button"
                onClick={() => setSelected(amt)}
                className={`shrink-0 rounded-full px-4 py-2 text-btn font-bold transition-colors ${
                  isActive
                    ? "bg-accent text-primary"
                    : "border border-white/30 bg-transparent text-white hover:bg-white/10"
                }`}
              >
                &#8377;{amt.toLocaleString("en-IN")}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={handleDonate}
          className="w-full rounded-full bg-accent px-6 py-3 text-btn-lg font-black text-primary transition-colors hover:bg-accent/90"
        >
          Donate &#8377;{selected.toLocaleString("en-IN")}
        </button>
      </div>
    </div>
  );
}
