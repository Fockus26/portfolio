import { projectSectionId } from "@/lib/sections";
import { SECTION_IDS } from "@/lib/site";

/*
 * The light band along the page (HANDOFF § 2.7 and § 6.4). Pure data and math: no DOM.
 * The tints are tokens of app/globals.css; this file only names them, the hex lives there.
 */

/** Below 1024 the stacked layout, from 1024 the desktop one (the `lg` breakpoint). */
export type LightLayout = "sm" | "lg";

/** One row of the handoff table: the band as it sits at one section's snap position. */
export type LightKey = {
  /** Section id: `inicio`, `p01` … `p09`, `sobre-mi`, `contacto`. */
  id: string;
  /** skewX angle in degrees. */
  angle: number;
  /** x of the top-left corner, 140px above the viewport, in % of the viewport width. */
  left: Record<LightLayout, number>;
  /** Width in px at the reference viewport of each layout (1440 and 390). */
  width: Record<LightLayout, number>;
  /** Color token of the fill (`--color-<tint>`). */
  tint: string;
  /** Background of the section, which also draws the window-frame shadow. */
  surface: "wall" | "stone";
};

/** The twelve keys of HANDOFF § 6.4, in page order. */
export const LIGHT_KEYS: readonly LightKey[] = [
  key(SECTION_IDS.entrance, -14, [70, 400], [80, 150], "light-1"),
  key(projectSectionId(1), -18, [36, 370], [120, 140], "light-p01"),
  key(projectSectionId(2), -22, [64, 350], [150, 135], "light-p02"),
  key(projectSectionId(3), -26, [78, 340], [150, 130], "light-p03"),
  key(projectSectionId(4), -30, [60, 330], [190, 125], "light-p04"),
  key(projectSectionId(5), -34, [80, 320], [230, 125], "light-2"),
  key(projectSectionId(6), -38, [100, 310], [260, 120], "light-p06"),
  key(projectSectionId(7), -42, [90, 300], [250, 115], "light-p07"),
  key(projectSectionId(8), -46, [118, 290], [290, 110], "light-p08"),
  key(projectSectionId(9), -50, [112, 280], [380, 105], "light-p09"),
  key(SECTION_IDS.about, -56, [135, 280], [380, 110], "light-3"),
  key(SECTION_IDS.contact, -62, [170, 270], [520, 105], "light-stone", "stone"),
];

function key(
  id: string,
  angle: number,
  [leftLg, widthLg]: [number, number],
  [leftSm, widthSm]: [number, number],
  tint: string,
  surface: LightKey["surface"] = "wall",
): LightKey {
  return {
    id,
    angle,
    left: { lg: leftLg, sm: leftSm },
    width: { lg: widthLg, sm: widthSm },
    tint,
    surface,
  };
}

/** The key of one section. */
export function lightKey(id: string): LightKey | undefined {
  return LIGHT_KEYS.find((entry) => entry.id === id);
}

/**
 * How the band width scales with the viewport. ≥1024: `W₁₄₄₀ × (vw / 1440)`, clamped to
 * 1024–2560 (HANDOFF § 6.4). <1024 the handoff only gives W at 390: `W₃₉₀ × (vw / 390)`,
 * clamped to 320–1023 (D015). app/globals.css (`.light-band`) applies the same rule.
 */
export const LIGHT_SCALE: Record<
  LightLayout,
  { reference: number; min: number; max: number }
> = {
  lg: { reference: 1440, min: 1024, max: 2560 },
  sm: { reference: 390, min: 320, max: 1023 },
};

/** The layout a viewport width falls in. */
export function lightLayout(viewportWidth: number): LightLayout {
  return viewportWidth >= LIGHT_SCALE.lg.min ? "lg" : "sm";
}

/** Band width in px for a reference width at a viewport width. */
export function bandWidth(width: number, viewportWidth: number): number {
  const scale = LIGHT_SCALE[lightLayout(viewportWidth)];
  const clamped = Math.min(scale.max, Math.max(scale.min, viewportWidth));
  return (width * clamped) / scale.reference;
}

export type Rgb = readonly [number, number, number];

/** `#fffdf2` → `[255, 253, 242]`. */
export function parseHex(hex: string): Rgb {
  const value = hex.trim().replace(/^#/, "");
  const full =
    value.length === 3
      ? [...value].map((digit) => digit + digit).join("")
      : value;
  if (!/^[0-9a-f]{6}$/i.test(full)) throw new Error(`Not a hex color: ${hex}`);
  return [0, 2, 4].map((i) => Number.parseInt(full.slice(i, i + 2), 16)) as [
    number,
    number,
    number,
  ];
}

/** A computed color (`rgb(255, 253, 242)`, `rgb(255 253 242)`) or a hex → channels. */
export function parseColor(value: string): Rgb {
  const channels = value.match(
    /^\s*rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/,
  );
  if (!channels) return parseHex(value);
  return [1, 2, 3].map((i) => Math.round(Number(channels[i]))) as [
    number,
    number,
    number,
  ];
}

/** `[255, 253, 242]` → `rgb(255 253 242)`. */
export function rgbString([r, g, b]: Rgb): string {
  return `rgb(${r} ${g} ${b})`;
}

/** The band in one layout, with its color already resolved. */
export type BandValues = {
  angle: number;
  /** % of the viewport width. */
  left: number;
  /** px at the layout's reference viewport. */
  width: number;
  color: Rgb;
};

/** The keys of one layout, with each tint resolved to its color. */
export function bandValues(
  keys: readonly LightKey[],
  layout: LightLayout,
  colorOf: (tint: string) => Rgb,
): BandValues[] {
  return keys.map((entry) => ({
    angle: entry.angle,
    left: entry.left[layout],
    width: entry.width[layout],
    color: colorOf(entry.tint),
  }));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * The band at a progress along the keys: `2` is the third key, `2.5` halfway to the fourth.
 * Linear in angle, left and width; the color per sRGB channel (HANDOFF § 6.4).
 */
export function interpolate(
  values: readonly BandValues[],
  progress: number,
): BandValues {
  if (values.length === 0) throw new Error("No light keys");
  const last = values.length - 1;
  const at = Math.min(last, Math.max(0, progress));
  const index = Math.min(last, Math.floor(at));
  const t = at - index;
  const from = values[index];
  const to = values[Math.min(last, index + 1)];
  if (t === 0) return from;
  return {
    angle: lerp(from.angle, to.angle, t),
    left: lerp(from.left, to.left, t),
    width: lerp(from.width, to.width, t),
    color: [0, 1, 2].map((c) =>
      Math.round(lerp(from.color[c], to.color[c], t)),
    ) as unknown as Rgb,
  };
}

/**
 * The scroll position where each key applies: the section's snap position, never past the
 * end of the page (a last section shorter than the viewport is reached at the bottom).
 */
export function keyPositions(
  snapTops: readonly number[],
  maxScroll: number,
): number[] {
  let previous = 0;
  return snapTops.map((top) => {
    previous = Math.max(previous, Math.min(maxScroll, Math.max(0, top)));
    return previous;
  });
}

/** Progress along the keys (see `interpolate`) at a scroll position. */
export function scrollProgress(
  positions: readonly number[],
  scrollY: number,
): number {
  if (positions.length === 0) return 0;
  if (scrollY <= positions[0]) return 0;
  for (let i = 0; i < positions.length - 1; i++) {
    const [from, to] = [positions[i], positions[i + 1]];
    if (scrollY < to) return to > from ? i + (scrollY - from) / (to - from) : i;
  }
  return positions.length - 1;
}

/** Share of the viewport height a section covers, 0 to 1. */
export function viewportCoverage(
  top: number,
  bottom: number,
  scrollY: number,
  viewportHeight: number,
): number {
  if (viewportHeight <= 0) return 0;
  const visible =
    Math.min(viewportHeight, bottom - scrollY) - Math.max(0, top - scrollY);
  return Math.max(0, Math.min(1, visible / viewportHeight));
}

/** The frame shadow turns stone once Contacto covers more than half the viewport. */
export const STONE_COVERAGE = 0.5;

/**
 * Custom properties the `.light-band` class reads (app/globals.css). The static band of a
 * section gets them from its key; the fixed layer writes the interpolated ones.
 */
export function bandVars(entry: LightKey): Record<string, string> {
  return {
    "--band-angle": String(entry.angle),
    "--band-left-lg": String(entry.left.lg),
    "--band-left-sm": String(entry.left.sm),
    "--band-w-lg": String(entry.width.lg),
    "--band-w-sm": String(entry.width.sm),
    "--band-tint": `var(--color-${entry.tint})`,
    "--band-cut": `var(--color-${entry.surface})`,
  };
}

/** The same properties for an interpolated position of the fixed layer. */
export function layerVars(
  lg: BandValues,
  sm: BandValues,
  surface: LightKey["surface"],
): Record<string, string> {
  return {
    "--band-angle": String(lg.angle),
    "--band-left-lg": String(lg.left),
    "--band-left-sm": String(sm.left),
    "--band-w-lg": String(lg.width),
    "--band-w-sm": String(sm.width),
    "--band-tint": rgbString(lg.color),
    "--band-cut": `var(--color-${surface})`,
  };
}
