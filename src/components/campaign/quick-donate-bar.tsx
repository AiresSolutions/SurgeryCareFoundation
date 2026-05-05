"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PRESETS = [500, 1000, 2500, 5000, 10000, 25000] as const;
const DEFAULT_PRESET = 2500;

interface QuickDonateBarProps {
  slug: string;
}

// Mobile-only sticky donate bar. Hidden on lg+ because the desktop layout
// already has a sticky sidebar with a Donate Now button. Two ways to pick:
//   1. Tap a preset chip (scrollable row).
//   2. Type any amount in the custom input — the chip highlight clears
//      and the typed value drives the CTA.
// Deep-links to /checkout?amount=<n>; checkout's existing ?amount=
// handler routes a non-preset value into its "Other Amount" field, so
// no payment-flow logic is duplicated here.
export function QuickDonateBar({ slug }: QuickDonateBarProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<number>(DEFAULT_PRESET);
  const [custom, setCustom] = useState<string>("");

  const customNum = custom ? Number(custom) : NaN;
  const hasValidCustom = Number.isFinite(customNum) && customNum > 0;
  const effectiveAmount = hasValidCustom ? customNum : selected;
  const canDonate = effectiveAmount > 0;

  function handleDonate() {
    if (!canDonate) return;
    router.push(`/causes/${slug}/checkout?amount=${effectiveAmount}`);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-border bg-primary shadow-[0_-8px_24px_rgba(0,0,0,0.18)] lg:hidden">
      <div className="mx-auto max-w-screen-md px-4 py-3">
        {/* Preset chips — scrollable so we can offer more options without
            wrapping or shrinking too small to tap. pb-2 leaves room for
            the native scrollbar (when shown on iOS Safari etc) so it
            doesn't crowd the chips. */}
        <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
          {PRESETS.map((amt) => {
            const isActive = !hasValidCustom && selected === amt;
            return (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  setSelected(amt);
                  setCustom("");
                }}
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

        {/* Amount input + Donate, side by side. */}
        <div className="flex items-stretch gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 focus-within:border-accent">
            <span className="text-btn-lg font-bold text-white">&#8377;</span>
            <span className="h-5 w-px bg-white/30" aria-hidden />
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={custom}
              onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder={selected.toLocaleString("en-IN")}
              aria-label="Custom donation amount in rupees"
              className="w-full bg-transparent py-3 text-btn font-bold text-white placeholder:text-white/40 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <button
            type="button"
            onClick={handleDonate}
            disabled={!canDonate}
            className="shrink-0 rounded-full bg-accent px-6 py-3 text-btn-lg font-black text-primary transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Donate
          </button>
        </div>
      </div>
    </div>
  );
}
