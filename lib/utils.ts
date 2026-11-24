import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Font-size tokens of the theme (`--text-*` in app/globals.css). tailwind-merge reads an
 * unknown `text-<name>` as a color, so `text-button` next to `text-wall` lost one of the
 * two. tests/unit/utils.test.ts walks the stylesheet and fails if a size is missing here.
 */
export const TEXT_SIZES = [
  "display",
  "h1",
  "h1-status",
  "h2",
  "h2-long",
  "h3",
  "h4",
  "h5",
  "h6",
  "body",
  "body-lg",
  "role",
  "small",
  "caption",
  "button",
  "micro",
  "button-lg",
  "code",
  "contact",
  "contact-lg",
  "wordmark",
  "tag",
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [...TEXT_SIZES],
      radius: ["none", "sm", "md"],
      shadow: ["focus-halo", "control-hover", "current-row"],
    },
    classGroups: {
      duration: [
        "duration-fast",
        "duration-base",
        "duration-slow",
        "duration-entrance",
      ],
      z: [
        "z-light",
        "z-content",
        "z-window-open",
        "z-header",
        "z-popover",
        "z-scrim",
        "z-sheet",
        "z-skip",
      ],
    },
  },
});

/** Conditional class names, with the later class winning a conflict. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
