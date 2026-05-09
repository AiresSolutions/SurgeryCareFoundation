"use client";

import { useEffect, useState } from "react";

const TAGLINES = [
  "Surgery, when survival can't wait.",
  "No family should choose between treatment and survival.",
  "Healing should never depend on a bank balance.",
] as const;

const ROTATE_MS = 7_000;

export function RotatingTagline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
    }
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % TAGLINES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span aria-live="polite" aria-atomic="true" className="block">
      <span key={index} className="block animate-tagline-in">
        {TAGLINES[index]}
      </span>
    </span>
  );
}
