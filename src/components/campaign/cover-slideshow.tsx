"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { CampaignDocument } from "@/types/campaign";

interface CoverSlideshowProps {
  // Only image documents — videos belong in their own section below.
  slides: CampaignDocument[];
  fallbackSrc?: string;
  alt: string;
  intervalMs?: number;
}

export function CoverSlideshow({
  slides,
  fallbackSrc = "/images/placeholder.jpg",
  alt,
  intervalMs = 6000,
}: CoverSlideshowProps) {
  const [idx, setIdx] = useState(0);
  const safeSlides = slides.filter((s) => s.downloadUrl);
  const count = safeSlides.length;

  useEffect(() => {
    if (count <= 1) return;
    const t = setTimeout(() => setIdx((i) => (i + 1) % count), intervalMs);
    return () => clearTimeout(t);
  }, [idx, count, intervalMs]);

  // Reset to first slide if the underlying list shrinks
  useEffect(() => {
    if (idx >= count) setIdx(0);
  }, [count, idx]);

  // Empty state — placeholder fallback
  if (count === 0) {
    return (
      <div className="relative h-[300px] overflow-hidden rounded-2xl bg-surface-page md:h-[400px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fallbackSrc}
          alt={alt}
          className="size-full object-contain"
        />
      </div>
    );
  }

  const current = safeSlides[idx]!;

  return (
    <div className="relative h-[300px] overflow-hidden rounded-2xl bg-surface-page md:h-[400px]">
      {/* Blurred backdrop fills the dead space around portrait photos
          instead of leaving harsh black bars. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={`bg-${current.id}`}
        src={current.downloadUrl}
        alt=""
        aria-hidden
        className="absolute inset-0 size-full scale-110 object-cover blur-2xl"
      />
      <div className="absolute inset-0 bg-black/20" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={current.id}
        src={current.downloadUrl}
        alt={current.fileName || alt}
        className="relative size-full object-contain"
      />


      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => setIdx((i) => (i - 1 + count) % count)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition-colors hover:bg-black/60"
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-5"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setIdx((i) => (i + 1) % count)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition-colors hover:bg-black/60"
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-5"><path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>

          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
            {safeSlides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIdx(i)}
                className={cn(
                  "size-2 rounded-full transition-all",
                  i === idx ? "w-6 bg-white" : "bg-white/50 hover:bg-white/80",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
