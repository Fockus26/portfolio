/**
 * The scroll choreography of the project rooms (HANDOFF § 6.1 and § 6.2), as pure math: no
 * DOM. The driver (`components/ui/RoomChoreography.tsx`) measures the page and writes what
 * these functions return; the QA script (`scripts/qa/choreography.mjs`) checks the page
 * against the same functions. Every threshold is a constant here, with its reference.
 */

/** A box in px: relative to the room's stage for the window, as `getBoundingClientRect`. */
export type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/** desktop 16:9 · phone 9:19.5 · chat 9:16 (`content/types.ts` › media.format). */
export type WindowFormat = "desktop" | "phone" | "chat";

/** Width over height of each window format (`--aspect-phone`, `--aspect-chat` in CSS). */
export const WINDOW_RATIO: Readonly<Record<WindowFormat, number>> = {
  desktop: 16 / 9,
  phone: 9 / 19.5,
  chat: 9 / 16,
};

/** § 6.1 `t(p)`: the window rests until 0.15, opens until 0.55, stays open until 0.80. */
export const OPEN_START = 0.15;
export const OPEN_END = 0.55;
export const CLOSE_START = 0.8;

/** § 6.1: the text leaves between p 0.15 and 0.30 and comes back between 0.88 and 1. */
export const TEXT_EXIT_START = 0.15;
export const TEXT_EXIT_END = 0.3;
export const TEXT_RETURN_START = 0.88;

/** § 6.1: the text rises 16px (spacing 4) while it leaves. */
export const TEXT_SHIFT = -16;

/** § 6.1: the reveal is gone at t = 0.3. */
export const REVEAL_FADE_END = 0.3;

/** § 6.1: an opened vertical window leaves 48px (spacing 12) and starts 24px (spacing 6) under the header. */
export const OPEN_VERTICAL_GAP = 48;
export const OPEN_VERTICAL_TOP = 24;

/** `radius-sm` (§ 1.3): the window at rest; an opened 16:9 window reaches 0. */
export const WINDOW_RADIUS = 2;

/**
 * § 6.2: below 1024 the window is clipped 12 % per side while its vertical center is at
 * 90 % of the viewport height or lower, and fully open from 55 % up.
 */
export const STACKED_CLIP = 0.12;
export const STACKED_CLIP_FROM = 0.9;
export const STACKED_CLIP_TO = 0.55;

/** `--ease-in-out` of `app/globals.css` (§ 1.4), as the control points of its cubic-bezier. */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * A CSS `cubic-bezier(x1, y1, x2, y2)` as a function of the input progress, solved for x
 * as browsers do (Newton's method, then bisection when the slope is too flat).
 */
export function cubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): (x: number) => number {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (u: number) => ((ax * u + bx) * u + cx) * u;
  const sampleY = (u: number) => ((ay * u + by) * u + cy) * u;
  const slopeX = (u: number) => (3 * ax * u + 2 * bx) * u + cx;

  function solve(x: number): number {
    let u = x;
    for (let i = 0; i < 8; i++) {
      const error = sampleX(u) - x;
      if (Math.abs(error) < 1e-7) return u;
      const slope = slopeX(u);
      if (Math.abs(slope) < 1e-6) break;
      u -= error / slope;
    }
    let low = 0;
    let high = 1;
    u = x;
    while (high - low > 1e-7) {
      if (sampleX(u) < x) low = u;
      else high = u;
      u = (low + high) / 2;
    }
    return u;
  }

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return sampleY(solve(x));
  };
}

/** The `ease-in-out` token applied to the window's scroll progress (§ 1.4). */
export const easeInOut = cubicBezier(...EASE_IN_OUT);

/**
 * § 6.1 `p`: how far the visitor is through a room's track, 0 at its start and 1 when the
 * stage lets go. `travel` is the sticky distance: the track (200svh) minus the stage
 * (100svh), so one viewport, as in the handoff's formula.
 */
export function trackProgress(
  scrollY: number,
  trackTop: number,
  travel: number,
): number {
  if (travel <= 0) return 0;
  return clamp01((scrollY - trackTop) / travel);
}

/** § 6.1 `t(p)`: how open the window is, 0 in its slot and 1 at its full rect. */
export function openAmount(p: number): number {
  if (p <= OPEN_START || p >= 1) return 0;
  if (p < OPEN_END)
    return easeInOut((p - OPEN_START) / (OPEN_END - OPEN_START));
  if (p <= CLOSE_START) return 1;
  return 1 - easeInOut((p - CLOSE_START) / (1 - CLOSE_START));
}

/** § 6.1: opacity of the room's text, which leaves before the window opens and comes back. */
export function textOpacity(p: number): number {
  if (p < TEXT_RETURN_START)
    return (
      1 - clamp01((p - TEXT_EXIT_START) / (TEXT_EXIT_END - TEXT_EXIT_START))
    );
  return clamp01((p - TEXT_RETURN_START) / (1 - TEXT_RETURN_START));
}

/** § 6.1: the text's vertical offset in px, −16 when it is gone and back to 0 with it. */
export function textShift(p: number): number {
  return TEXT_SHIFT * (1 - textOpacity(p));
}

export type FullRectInput = {
  format: WindowFormat;
  /** The section's client width: the page without its scrollbar (not `100vw`). */
  width: number;
  /** The section's left edge relative to the stage (negative past the 2160px container). */
  left: number;
  /** The viewport height (100svh). */
  viewport: number;
  /** `header-h`: the opened window never goes under the header. */
  header: number;
};

/** § 6.1 `F`: where the window ends when it is fully open, relative to the stage. */
export function fullRect({
  format,
  width,
  left,
  viewport,
  header,
}: FullRectInput): Rect {
  if (format === "desktop")
    return { left, top: header, width, height: viewport - header };
  const height = viewport - header - OPEN_VERTICAL_GAP;
  const windowWidth = height * WINDOW_RATIO[format];
  return {
    left: left + (width - windowWidth) / 2,
    top: header + OPEN_VERTICAL_TOP,
    width: windowWidth,
    height,
  };
}

/** § 6.1: `left/top/width/height` interpolate linearly from `S` to `F` by `t`. */
export function lerpRect(from: Rect, to: Rect, t: number): Rect {
  const mix = (a: number, b: number) => a + (b - a) * t;
  return {
    left: mix(from.left, to.left),
    top: mix(from.top, to.top),
    width: mix(from.width, to.width),
    height: mix(from.height, to.height),
  };
}

/** § 6.1: the reveal fades out over the first 30 % of the opening. */
export function revealOpacity(t: number): number {
  return 1 - clamp01(t / REVEAL_FADE_END);
}

/** § 6.1: radius 2px → 0 at t = 1, for 16:9 windows only. */
export function windowRadius(t: number, format: WindowFormat): number {
  return format === "desktop" ? WINDOW_RADIUS * (1 - clamp01(t)) : WINDOW_RADIUS;
}

export type WindowFrame = {
  rect: Rect;
  /** Opacity of the reveal; its 8px padding shrinks with it, so the screen fills `F`. */
  reveal: number;
  radius: number;
  /** `z-window-open` while the window is out of its slot. */
  raised: boolean;
};

/** Everything the window needs at one `t`: its rect, its reveal and its corners. */
export function windowFrame(
  slot: Rect,
  full: Rect,
  t: number,
  format: WindowFormat,
): WindowFrame {
  return {
    rect: lerpRect(slot, full, t),
    reveal: revealOpacity(t),
    radius: windowRadius(t, format),
    raised: t > 0,
  };
}

/**
 * § 6.2: the stacked window's `clip-path: inset()` per side, as a fraction (0.12 → 0), from
 * its vertical center in the viewport.
 */
export function stackedInset(centerY: number, viewport: number): number {
  if (viewport <= 0) return 0;
  const position = centerY / viewport;
  return (
    STACKED_CLIP *
    clamp01(
      (position - STACKED_CLIP_TO) / (STACKED_CLIP_FROM - STACKED_CLIP_TO),
    )
  );
}

/**
 * A room whose content is taller than one viewport has no track (D025): a stage of exactly
 * one viewport would clip it. Half a pixel absorbs the rounding of `100svh`.
 */
export function fitsViewport(stageHeight: number, viewport: number): boolean {
  return stageHeight <= viewport + 0.5;
}
