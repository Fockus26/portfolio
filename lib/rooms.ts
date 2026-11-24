/**
 * The nine project rooms at ≥1024 (HANDOFF § 3). Each room places its window and its text
 * on different grid lines, on purpose: this table is data, not variants to even out.
 */

/** Grid lines `[start, end]` of the 12-column grid, as in `grid-column: start / end`. */
export type GridLines = readonly [start: number, end: number];

export type RoomLayout = {
  window: {
    cols: GridLines;
    /** The window runs through the side padding to the edge of the container. */
    bleed?: "left" | "right";
    /** Side of the 8px reveal: the one that faces the center of the page. */
    reveal: "left" | "right";
  };
  text: {
    cols: GridLines;
    /** 40px of padding between the window and the text. */
    pad?: boolean;
  };
  /** Room 09 only: body, role, links and stack go in a column of their own. */
  detail?: { cols: GridLines; pad?: boolean };
  /** Vertical position, with its padding in px when it is not centered. */
  align:
    | { at: "center" }
    | { at: "start"; offset: number }
    | { at: "end"; offset: number };
  /** Below 1024: 16:9 windows go edge to edge; the vertical ones keep a side. */
  stacked: "bleed" | "left" | "right" | "center";
};

const CENTER = { at: "center" } as const;

export const ROOM_LAYOUTS: Readonly<Record<number, RoomLayout>> = {
  1: {
    window: { cols: [6, 13], bleed: "right", reveal: "left" },
    text: { cols: [1, 6] },
    align: CENTER,
    stacked: "bleed",
  },
  2: {
    window: { cols: [2, 5], reveal: "left" },
    text: { cols: [7, 13] },
    align: CENTER,
    stacked: "left",
  },
  3: {
    window: { cols: [1, 7], bleed: "left", reveal: "right" },
    text: { cols: [7, 13], pad: true },
    align: { at: "end", offset: 112 },
    stacked: "bleed",
  },
  4: {
    window: { cols: [9, 12], reveal: "left" },
    text: { cols: [2, 7] },
    align: CENTER,
    stacked: "right",
  },
  5: {
    window: { cols: [9, 12], reveal: "left" },
    text: { cols: [1, 8] },
    align: { at: "start", offset: 88 },
    stacked: "right",
  },
  6: {
    window: { cols: [1, 4], reveal: "left" },
    text: { cols: [5, 12] },
    align: { at: "end", offset: 96 },
    stacked: "left",
  },
  7: {
    window: { cols: [5, 13], reveal: "left" },
    text: { cols: [1, 5] },
    align: CENTER,
    stacked: "bleed",
  },
  8: {
    window: { cols: [1, 7], bleed: "left", reveal: "right" },
    text: { cols: [7, 13], pad: true },
    align: { at: "start", offset: 88 },
    stacked: "bleed",
  },
  9: {
    window: { cols: [6, 9], reveal: "left" },
    text: { cols: [1, 6] },
    detail: { cols: [9, 13], pad: true },
    align: CENTER,
    stacked: "center",
  },
};

/** The layout of a room; an order without one is a bug in the content, not a fallback. */
export function roomLayout(order: number): RoomLayout {
  const layout = ROOM_LAYOUTS[order];
  if (!layout) throw new Error(`There is no room layout for project ${order}`);
  return layout;
}

const REM = 16;

/**
 * The room's layout as the CSS variables its grid reads (`room-rows`, `col-(--room-…)`).
 * A wall that is not set stays `1fr`, so a centered room sets neither.
 */
export function roomVars(layout: RoomLayout): Record<string, string> {
  const line = ([start, end]: GridLines) => `${start} / ${end}`;
  const vars: Record<string, string> = {
    "--room-window": line(layout.window.cols),
    "--room-text": line(layout.text.cols),
    "--room-detail": line((layout.detail ?? layout.text).cols),
  };
  if (layout.align.at === "start")
    vars["--room-top"] = `${layout.align.offset / REM}rem`;
  if (layout.align.at === "end")
    vars["--room-bottom"] = `${layout.align.offset / REM}rem`;
  return vars;
}

/** HANDOFF § 2.10: a name longer than 18 characters takes the `h2-long` size. */
export function isLongName(name: string): boolean {
  return name.length > 18;
}
