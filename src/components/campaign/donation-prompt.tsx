"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShareIcon, HeartFilledIcon } from "@/components/ui/icons";

interface DonationPromptProps {
  slug: string;
  patientName: string;
  coverImageUrl: string | null;
  // Reuse the parent page's share/save handlers so the popup doesn't
  // re-implement (or fork) the canonical behaviour.
  onShare: () => void;
  onSave: () => void;
  isSaved: boolean;
  isSaving: boolean;
}

const SHOW_AFTER_MS = 10_000;
const THROTTLE_MS = 6 * 60 * 60 * 1000;
const STORAGE_KEY_PREFIX = "donation_prompt_dismissed:";

function readDismissedAt(slug: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${slug}`);
    if (!raw) return 0;
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

function recordDismissed(slug: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`${STORAGE_KEY_PREFIX}${slug}`, String(Date.now()));
  } catch {
    // localStorage may be blocked (Safari private mode etc) — fall through.
    // Worst case the prompt appears once per page load instead of once per day.
  }
}

export function DonationPrompt({
  slug,
  patientName,
  coverImageUrl,
  onShare,
  onSave,
  isSaved,
  isSaving,
}: DonationPromptProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const since = Date.now() - readDismissedAt(slug);
    if (since < THROTTLE_MS) return;
    const t = window.setTimeout(() => setOpen(true), SHOW_AFTER_MS);
    return () => window.clearTimeout(t);
  }, [slug]);

  // Close on Escape; lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleClose() {
    recordDismissed(slug);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Help ${patientName}`}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-5">
            <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative h-56 w-full overflow-hidden bg-surface-page">
          {coverImageUrl ? (
            <>
              {/* Blurred backdrop fills the dead space around portrait
                  shots so the actual image can stay object-contain
                  (never clipped) — same trick the cause cards use. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImageUrl}
                alt=""
                aria-hidden
                className="absolute inset-0 size-full scale-110 object-cover blur-2xl"
              />
              <Image
                src={coverImageUrl}
                alt={patientName}
                fill
                className="object-contain"
                sizes="(min-width: 640px) 28rem, 100vw"
                priority={false}
              />
            </>
          ) : (
            <div className="flex size-full items-center justify-center text-slate-light">
              No image
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-h4 font-black text-white">
              Your donation can save {patientName}&apos;s life
            </p>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <p className="text-btn text-slate-medium">
            Every contribution brings {patientName} one step closer to the
            surgery they need. Even a small amount helps.
          </p>

          <Link
            href={`/causes/${slug}/checkout`}
            onClick={() => recordDismissed(slug)}
            className="flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 text-btn-lg font-black text-primary transition-colors hover:bg-accent/90"
          >
            Donate Now
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onShare}
              className="flex items-center justify-center gap-2 rounded-full border border-surface-border px-4 py-2 text-btn font-bold text-primary transition-colors hover:border-accent hover:text-accent"
            >
              <ShareIcon className="size-4" />
              Share
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 rounded-full border border-surface-border px-4 py-2 text-btn font-bold text-primary transition-colors hover:border-accent hover:text-accent disabled:opacity-60"
            >
              <HeartFilledIcon className={`size-4 ${isSaved ? "text-red-500" : "text-slate-light"}`} />
              {isSaving ? "..." : isSaved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
