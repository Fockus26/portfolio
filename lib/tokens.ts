// The token names of app/globals.css, for the reference page (/tokens) and the tests.
// The values live in the CSS; this file never repeats a hex.

export const COLOR_TOKENS = [
  "wall",
  "stone",
  "ink",
  "graphite",
  "moss",
  "moss-hover",
  "moss-active",
  "moss-light",
  "brass",
  "line",
  "line-strong",
  "wash",
  "wash-active",
  "stone-hover",
  "reveal",
  "control-hover",
  "selection-bg",
  "selection-fg",
  "selection-bg-stone",
  "selection-fg-stone",
  "scrollbar-track",
  "scrollbar-thumb",
  "scrollbar-thumb-hover",
  "success",
  "warning",
  "error",
  "tag-bg",
  "tag-fg",
  "light-1",
  "light-2",
  "light-3",
  "light-stone",
  "light-p01",
  "light-p02",
  "light-p03",
  "light-p04",
  "light-p06",
  "light-p07",
  "light-p08",
  "light-p09",
] as const;

export const TYPE_ROLES = [
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
] as const;

/** Text/background pairs the design uses, with the minimum ratio each must reach. */
export const CONTRAST_PAIRS: readonly (readonly [string, string, number])[] = [
  ["ink", "wall", 4.5],
  ["ink", "stone", 4.5],
  ["ink", "wash", 4.5],
  ["ink", "wash-active", 4.5],
  ["ink", "stone-hover", 4.5],
  ["ink", "control-hover", 4.5],
  ["graphite", "wall", 4.5],
  ["graphite", "stone", 4.5],
  ["graphite", "wash", 4.5],
  ["graphite", "light-1", 4.5],
  ["graphite", "light-2", 4.5],
  ["graphite", "light-3", 4.5],
  ["graphite", "light-stone", 4.5],
  ["moss", "wall", 4.5],
  ["moss", "stone", 4.5],
  ["moss", "light-3", 4.5],
  ["moss", "light-stone", 4.5],
  ["moss-hover", "wall", 4.5],
  ["moss-hover", "stone", 4.5],
  ["moss-active", "stone", 4.5],
  ["wall", "moss", 4.5],
  ["wall", "moss-hover", 4.5],
  ["wall", "moss-active", 4.5],
  ["wall", "moss-light", 4.5],
  ["selection-fg", "selection-bg", 4.5],
  ["moss", "selection-bg", 4.5],
  ["graphite", "selection-bg", 4.5],
  ["selection-fg-stone", "selection-bg-stone", 4.5],
  ["success", "wall", 4.5],
  ["warning", "wall", 4.5],
  ["error", "wall", 4.5],
  ["tag-fg", "tag-bg", 4.5],
  // Non-text: informative borders, scrollbar thumb, the decorative brass on wall
  ["line-strong", "wall", 3],
  ["line-strong", "stone", 3],
  ["line-strong", "light-stone", 3],
  ["scrollbar-thumb", "scrollbar-track", 3],
  ["scrollbar-thumb-hover", "scrollbar-track", 3],
  ["brass", "wall", 3],
];

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => {
    const v = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/** WCAG 2.1 contrast ratio between two #rrggbb colors. */
export function contrastRatio(a: string, b: string): number {
  const [la, lb] = [luminance(a), luminance(b)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
