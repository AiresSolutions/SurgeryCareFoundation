import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Register custom font-size class names from tailwind.config.ts so
// tailwind-merge knows they belong to the "font-size" group and does NOT
// treat them as conflicting with text color utilities like text-white.
// Without this, e.g. cn("text-white", "text-btn") incorrectly drops
// "text-white" and the text renders in the inherited body color.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "body",
            "body-lg",
            "body-sm",
            "btn",
            "btn-lg",
            "label",
            "caption",
            "nav",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
