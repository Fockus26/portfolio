import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  CLOSE_START,
  cubicBezier,
  EASE_IN_OUT,
  easeInOut,
  fitsViewport,
  fullRect,
  lerpRect,
  OPEN_END,
  OPEN_START,
  openAmount,
  type Rect,
  revealOpacity,
  STACKED_CLIP,
  stackedInset,
  TEXT_SHIFT,
  textOpacity,
  textShift,
  trackProgress,
  WINDOW_RADIUS,
  WINDOW_RATIO,
  windowFrame,
  windowRadius,
} from "@/lib/choreography";

const css = readFileSync("app/globals.css", "utf8");

function cssVar(name: string): string {
  const match = css.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!match) throw new Error(`--${name} is missing in globals.css`);
  return match[1].trim();
}

describe("track progress p (HANDOFF § 6.1)", () => {
  test("0 at the track's start, 1 one viewport later, clamped outside", () => {
    expect(trackProgress(1000, 1000, 900)).toBe(0);
    expect(trackProgress(1450, 1000, 900)).toBe(0.5);
    expect(trackProgress(1900, 1000, 900)).toBe(1);
    expect(trackProgress(400, 1000, 900)).toBe(0);
    expect(trackProgress(4000, 1000, 900)).toBe(1);
  });

  test("a track without travel never opens", () => {
    expect(trackProgress(1200, 1000, 0)).toBe(0);
  });
});

describe("ease-in-out", () => {
  test("is the same cubic-bezier as the --ease-in-out token", () => {
    const token = cssVar("ease-in-out").match(/cubic-bezier\(([^)]+)\)/);
    expect(token).not.toBeNull();
    const points = (token?.[1] ?? "").split(",").map(Number);
    expect(points).toEqual([...EASE_IN_OUT]);
  });

  test("starts at 0, ends at 1 and is symmetric around the middle", () => {
    expect(easeInOut(0)).toBe(0);
    expect(easeInOut(1)).toBe(1);
    expect(easeInOut(0.5)).toBeCloseTo(0.5, 6);
    for (const x of [0.1, 0.25, 0.4]) {
      expect(easeInOut(x) + easeInOut(1 - x)).toBeCloseTo(1, 6);
    }
  });

  test("is monotonic and slow at both ends", () => {
    let last = 0;
    for (let i = 1; i <= 100; i++) {
      const value = easeInOut(i / 100);
      expect(value).toBeGreaterThanOrEqual(last);
      last = value;
    }
    expect(easeInOut(0.1)).toBeLessThan(0.1);
    expect(easeInOut(0.9)).toBeGreaterThan(0.9);
  });

  test("the solver matches known curves", () => {
    const linear = cubicBezier(0, 0, 1, 1);
    expect(linear(0.3)).toBeCloseTo(0.3, 6);
    // `ease` (0.25, 0.1, 0.25, 1) at 0.5 is 0.8024 in every browser
    expect(cubicBezier(0.25, 0.1, 0.25, 1)(0.5)).toBeCloseTo(0.8024, 3);
  });
});

describe("t(p): the four segments", () => {
  test("rests until 0.15", () => {
    expect(openAmount(0)).toBe(0);
    expect(openAmount(0.1)).toBe(0);
    expect(openAmount(OPEN_START)).toBe(0);
  });

  test("opens with the easing between 0.15 and 0.55", () => {
    expect(openAmount(0.35)).toBeCloseTo(easeInOut(0.5), 6);
    expect(openAmount(0.25)).toBeCloseTo(easeInOut(0.25), 6);
    expect(openAmount(OPEN_END - 1e-9)).toBeCloseTo(1, 6);
  });

  test("stays open between 0.55 and 0.80", () => {
    expect(openAmount(OPEN_END)).toBe(1);
    expect(openAmount(0.7)).toBe(1);
    expect(openAmount(CLOSE_START)).toBe(1);
  });

  test("closes with the easing between 0.80 and 1", () => {
    expect(openAmount(0.9)).toBeCloseTo(1 - easeInOut(0.5), 6);
    expect(openAmount(1 - 1e-9)).toBeCloseTo(0, 6);
    expect(openAmount(1)).toBe(0);
  });

  test("is continuous at every boundary", () => {
    for (const edge of [OPEN_START, OPEN_END, CLOSE_START, 1]) {
      expect(openAmount(edge - 1e-7)).toBeCloseTo(openAmount(edge), 4);
      if (edge < 1)
        expect(openAmount(edge + 1e-7)).toBeCloseTo(openAmount(edge), 4);
    }
  });
});

describe("the room's text", () => {
  test("opacity at 0.15 / 0.30 / 0.88 / 1", () => {
    expect(textOpacity(0)).toBe(1);
    expect(textOpacity(0.15)).toBe(1);
    expect(textOpacity(0.225)).toBeCloseTo(0.5, 6);
    expect(textOpacity(0.3)).toBe(0);
    expect(textOpacity(0.6)).toBe(0);
    expect(textOpacity(0.88)).toBe(0);
    expect(textOpacity(0.94)).toBeCloseTo(0.5, 6);
    expect(textOpacity(1)).toBe(1);
  });

  test("rises 16px while it leaves and comes back to 0", () => {
    expect(TEXT_SHIFT).toBe(-16);
    expect(textShift(0.15)).toBeCloseTo(0, 6);
    expect(textShift(0.225)).toBeCloseTo(-8, 6);
    expect(textShift(0.3)).toBe(-16);
    expect(textShift(0.88)).toBe(-16);
    expect(textShift(1)).toBeCloseTo(0, 6);
  });
});

describe("full rect F", () => {
  const base = { width: 1428, left: 0, viewport: 900, header: 72 };

  test("16:9 fills the stage under the header", () => {
    expect(fullRect({ ...base, format: "desktop" })).toEqual({
      left: 0,
      top: 72,
      width: 1428,
      height: 828,
    });
  });

  test("a phone window is 48px shorter, centered, 24px under the header", () => {
    const rect = fullRect({ ...base, format: "phone" });
    expect(rect.height).toBe(780);
    expect(rect.width).toBeCloseTo((780 * 9) / 19.5, 6);
    expect(rect.top).toBe(96);
    expect(rect.left + rect.width / 2).toBeCloseTo(714, 6);
  });

  test("a chat window follows its 9:16 ratio", () => {
    const rect = fullRect({ ...base, format: "chat" });
    expect(rect.height).toBe(780);
    expect(rect.width).toBeCloseTo((780 * 9) / 16, 6);
    expect(rect.left + rect.width / 2).toBeCloseTo(714, 6);
  });

  test("past the 2160px container F reaches the section's edges", () => {
    const rect = fullRect({
      format: "desktop",
      width: 2548,
      left: -194,
      viewport: 1440,
      header: 72,
    });
    expect(rect.left).toBe(-194);
    expect(rect.width).toBe(2548);
  });

  test("the ratios are the CSS ones", () => {
    expect(cssVar("aspect-phone")).toBe("9 / 19.5");
    expect(cssVar("aspect-chat")).toBe("9 / 16");
    expect(WINDOW_RATIO.phone).toBe(9 / 19.5);
    expect(WINDOW_RATIO.chat).toBe(9 / 16);
    expect(WINDOW_RATIO.desktop).toBe(16 / 9);
  });
});

describe("the window between S and F", () => {
  const slot: Rect = { left: 700, top: 300, width: 728, height: 418 };
  const full: Rect = { left: 0, top: 72, width: 1428, height: 828 };

  test("interpolates linearly", () => {
    expect(lerpRect(slot, full, 0)).toEqual(slot);
    expect(lerpRect(slot, full, 1)).toEqual(full);
    expect(lerpRect(slot, full, 0.5)).toEqual({
      left: 350,
      top: 186,
      width: 1078,
      height: 623,
    });
  });

  test("the reveal is gone at t = 0.3", () => {
    expect(revealOpacity(0)).toBe(1);
    expect(revealOpacity(0.15)).toBeCloseTo(0.5, 6);
    expect(revealOpacity(0.3)).toBe(0);
    expect(revealOpacity(1)).toBe(0);
  });

  test("only 16:9 loses its radius", () => {
    expect(cssVar("radius-sm")).toBe(`${WINDOW_RADIUS}px`);
    expect(windowRadius(0, "desktop")).toBe(2);
    expect(windowRadius(0.5, "desktop")).toBe(1);
    expect(windowRadius(1, "desktop")).toBe(0);
    expect(windowRadius(1, "phone")).toBe(2);
    expect(windowRadius(1, "chat")).toBe(2);
  });

  test("is raised over the room only while it is out of its slot", () => {
    expect(windowFrame(slot, full, 0, "desktop").raised).toBe(false);
    expect(windowFrame(slot, full, 0.01, "desktop").raised).toBe(true);
    expect(windowFrame(slot, full, 1, "phone")).toEqual({
      rect: full,
      reveal: 0,
      radius: 2,
      raised: true,
    });
  });
});

describe("stacked clip (HANDOFF § 6.2)", () => {
  test("12 % while entering, open from 55 % of the viewport up", () => {
    expect(STACKED_CLIP).toBe(0.12);
    expect(stackedInset(844, 844)).toBeCloseTo(0.12, 6);
    expect(stackedInset(0.9 * 844, 844)).toBeCloseTo(0.12, 6);
    expect(stackedInset(0.725 * 844, 844)).toBeCloseTo(0.06, 6);
    expect(stackedInset(0.55 * 844, 844)).toBeCloseTo(0, 6);
    expect(stackedInset(100, 844)).toBe(0);
    expect(stackedInset(-200, 844)).toBe(0);
  });
});

describe("rooms that do not fit one viewport (D025)", () => {
  test("a stage of one viewport fits, a taller one does not", () => {
    expect(fitsViewport(900, 900)).toBe(true);
    expect(fitsViewport(900.4, 900)).toBe(true);
    expect(fitsViewport(901, 900)).toBe(false);
  });

  test("the track is two viewports tall", () => {
    expect(cssVar("track-h")).toBe("200svh");
  });
});
