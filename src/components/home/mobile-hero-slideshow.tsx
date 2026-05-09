"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const IMAGES = [
  { src: "/images/hero-1.jpg", alt: "Children smiling together" },
  { src: "/images/hero-2.jpg", alt: "Child in need of medical care" },
  { src: "/images/hero-3.jpg", alt: "Elderly patient receiving care" },
  { src: "/images/hero-4.jpg", alt: "Community support for patients" },
] as const;

const ROTATE_MS = 10_000;

export function MobileHeroSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
    }
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % IMAGES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="mb-6 lg:hidden">
      <div className="relative mx-auto h-[300px] w-full max-w-sm overflow-hidden rounded-image">
        {IMAGES.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            fill
            priority={i === 0}
            sizes="(max-width: 1023px) 384px, 0px"
            className={`object-cover transition-opacity duration-700 ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-2" aria-hidden="true">
        {IMAGES.map((img, i) => (
          <span
            key={img.src}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-accent-mint" : "w-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
