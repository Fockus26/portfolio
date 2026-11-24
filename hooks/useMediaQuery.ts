"use client";

import { useSyncExternalStore } from "react";

/** Whether a media query matches. On the server and before hydration it is `false`. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** The breakpoints of the theme (app/globals.css), for behavior that CSS cannot switch. */
export const MEDIA = {
  md: "(min-width: 48rem)",
  lg: "(min-width: 64rem)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
} as const;
