"use client";

import { useLayoutEffect, useRef } from "react";
import { useHydrated } from "@/hooks/useHydrated";
import { MEDIA, useMediaQuery } from "@/hooks/useMediaQuery";
import {
  type BandValues,
  bandValues,
  interpolate,
  keyPositions,
  LIGHT_KEYS,
  type LightKey,
  layerVars,
  parseColor,
  STONE_COVERAGE,
  scrollProgress,
  viewportCoverage,
} from "@/lib/light";
import { SECTION_IDS } from "@/lib/site";

type Measured = {
  positions: number[];
  lg: BandValues[];
  sm: BandValues[];
  contact?: { top: number; bottom: number };
};

// The fixed light band of the whole page (HANDOFF § 6.4), only when motion is allowed. Its
// values are keyed to each section's snap position and interpolated by scroll. It reads
// the scroll at most once per frame from passive listeners and writes custom properties on
// the band: no re-render, no wheel or touch listener, the scroll stays native (D002, D017).
// It goes after the sections: the content above it is in `relative z-content` wrappers.
export function LightBandLayer() {
  const reducedMotion = useMediaQuery(MEDIA.reducedMotion);
  const hydrated = useHydrated();
  const active = hydrated && !reducedMotion;
  const bandRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const band = bandRef.current;
    if (!active || !band) return;
    const root = document.documentElement;
    // The tints live in the theme: the browser resolves each token to its rgb() once
    const probe = document.createElement("span");
    band.append(probe);
    const colorOf = (tint: string) => {
      probe.style.color = `var(--color-${tint})`;
      return parseColor(getComputedStyle(probe).color);
    };

    let measured: Measured | undefined;
    let frame = 0;

    function measure() {
      const present: { entry: LightKey; element: HTMLElement }[] = [];
      for (const entry of LIGHT_KEYS) {
        const element = document.getElementById(entry.id);
        if (element) present.push({ entry, element });
      }
      const y = window.scrollY;
      const tops = present.map(({ element }) => {
        const margin = Number.parseFloat(
          getComputedStyle(element).scrollMarginTop,
        );
        return (
          element.getBoundingClientRect().top +
          y -
          (Number.isNaN(margin) ? 0 : margin)
        );
      });
      const contact = document
        .getElementById(SECTION_IDS.contact)
        ?.getBoundingClientRect();
      const keys = present.map(({ entry }) => entry);
      measured = {
        positions: keyPositions(tops, root.scrollHeight - window.innerHeight),
        lg: bandValues(keys, "lg", colorOf),
        sm: bandValues(keys, "sm", colorOf),
        contact: contact && {
          top: contact.top + y,
          bottom: contact.bottom + y,
        },
      };
    }

    function update() {
      frame = 0;
      if (!measured || !band || measured.lg.length === 0) return;
      const y = window.scrollY;
      const progress = scrollProgress(measured.positions, y);
      const { contact } = measured;
      const stone =
        contact !== undefined &&
        viewportCoverage(contact.top, contact.bottom, y, window.innerHeight) >
          STONE_COVERAGE;
      const surface = stone ? "stone" : "wall";
      const vars = layerVars(
        interpolate(measured.lg, progress),
        interpolate(measured.sm, progress),
        surface,
      );
      for (const [name, value] of Object.entries(vars)) {
        band.style.setProperty(name, value);
      }
      band.dataset.surface = surface;
    }

    function schedule() {
      if (frame === 0) frame = requestAnimationFrame(update);
    }

    function remeasure() {
      measure();
      schedule();
    }

    measure();
    update();

    // Only now the static bands step aside: the layer already shows the same values. While
    // the entrance's band is still arriving on screen (HANDOFF § 6.3, D026) the layer waits
    // hidden and takes over when that animation ends, so the arrival is never cut.
    let waiting = true;
    function takeOver() {
      if (!waiting || !band) return;
      waiting = false;
      band.style.visibility = "";
      root.dataset.lightLayer = "";
    }
    const arriving = document.querySelector<HTMLElement>(".entrance-band");
    const animations =
      arriving && arriving.getBoundingClientRect().bottom > 0
        ? arriving
            .getAnimations()
            .filter((animation) => animation.playState !== "finished")
        : [];
    if (animations.length > 0) {
      band.style.visibility = "hidden";
      Promise.all(animations.map((animation) => animation.finished)).then(
        takeOver,
        takeOver,
      );
    } else {
      takeOver();
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });
    const resize = new ResizeObserver(remeasure);
    for (const entry of LIGHT_KEYS) {
      const element = document.getElementById(entry.id);
      if (element) resize.observe(element);
    }

    return () => {
      waiting = false;
      band.style.visibility = "";
      delete root.dataset.lightLayer;
      probe.remove();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      resize.disconnect();
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      data-light-layer=""
      className="pointer-events-none fixed inset-0 z-light overflow-hidden"
    >
      <div ref={bandRef} className="light-band" />
    </div>
  );
}
