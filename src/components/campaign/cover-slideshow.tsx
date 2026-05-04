"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { CampaignDocument } from "@/types/campaign";

interface CoverSlideshowProps {
  slides: CampaignDocument[];
  fallbackSrc?: string;
  alt: string;
  // Time on each image slide before auto-advancing (ms). Video slides
  // pause auto-advance entirely so the visitor can watch.
  intervalMs?: number;
}

export function CoverSlideshow({
  slides,
  fallbackSrc = "/images/placeholder.jpg",
  alt,
  intervalMs = 5000,
}: CoverSlideshowProps) {
  const [idx, setIdx] = useState(0);
  const safeSlides = slides.filter((s) => s.downloadUrl);
  const count = safeSlides.length;

  useEffect(() => {
    if (count <= 1) return;
    const current = safeSlides[idx];
    if (current?.mimeType?.startsWith("video/")) return; // don't auto-advance on videos
    const t = setTimeout(() => setIdx((i) => (i + 1) % count), intervalMs);
    return () => clearTimeout(t);
  }, [idx, count, safeSlides, intervalMs]);

  // Reset to first slide if the underlying list changes (e.g. doc list refetch)
  useEffect(() => {
    if (idx >= count) setIdx(0);
  }, [count, idx]);

  // Empty state — render the same placeholder behaviour as before
  if (count === 0) {
    return (
      <div className="relative h-[300px] overflow-hidden rounded-2xl md:h-[400px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fallbackSrc}
          alt={alt}
          className="size-full object-cover"
        />
      </div>
    );
  }

  const current = safeSlides[idx]!;
  const isVideo = current.mimeType?.startsWith("video/");

  return (
    <div className="relative h-[300px] overflow-hidden rounded-2xl bg-black md:h-[400px]">
      {isVideo ? (
        <video
          key={current.id}
          src={current.downloadUrl}
          controls
          preload="metadata"
          className="size-full object-contain"
        >
          Your browser does not support embedded video.
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={current.id}
          src={current.downloadUrl}
          alt={current.fileName || alt}
          className="size-full object-cover"
        />
      )}

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
