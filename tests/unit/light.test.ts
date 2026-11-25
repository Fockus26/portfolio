import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  bandValues,
  bandVars,
  bandWidth,
  interpolate,
  keyPositions,
  LIGHT_KEYS,
  LIGHT_SCALE,
  lightKey,
  lightLayout,
  parseColor,
  parseHex,
  rgbString,
  scrollProgress,
  viewportCoverage,
} from "@/lib/light";
import { contrastRatio } from "@/lib/tokens";

const css = readFileSync("app/globals.css", "utf8");

function hexOf(token: string): string {
  const match = css.match(new RegExp(`--color-${token}:\\s*(#[0-9a-f]{6});`));
  if (!match) throw new Error(`--color-${token} is not a hex in globals.css`);
  return match[1];
}

function rootVar(name: string): string {
  const match = css.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!match) throw new Error(`--${name} is missing in globals.css`);
  return match[1].trim();
}

// HANDOFF § 6.4, copied from the table: θ, left ≥1024, W at 1440, left <1024, W at 390, tint
const TABLE: [string, number, number, number, number, number, string][] = [
  ["inicio", -14, 70, 400, 80, 150, "#fffdf2"],
  ["p01", -18, 36, 370, 120, 140, "#fffdf1"],
  ["p02", -22, 64, 350, 150, 135, "#fffcf0"],
  ["p03", -26, 78, 340, 150, 130, "#fffcef"],
  ["p04", -30, 60, 330, 190, 125, "#fffcee"],
  ["p05", -34, 80, 320, 230, 125, "#fffbed"],
  ["p06", -38, 100, 310, 260, 120, "#fffbec"],
  ["p07", -42, 90, 300, 250, 115, "#fffaeb"],
  ["p08", -46, 118, 290, 290, 110, "#fffaea"],
  ["p09", -50, 112, 280, 380, 105, "#fffae9"],
  ["sobre-mi", -56, 135, 280, 380, 110, "#fff9e8"],
  ["contacto", -62, 170, 270, 520, 105, "#eae4d8"],
];

const colorOf = (tint: string) => parseHex(hexOf(tint));

describe("the twelve keys", () => {
  test("match the handoff table, in page order", () => {
    expect(LIGHT_KEYS.map((entry) => entry.id)).toEqual(
      TABLE.map((row) => row[0]),
    );
    for (const [id, angle, leftLg, wLg, leftSm, wSm, hex] of TABLE) {
      const entry = lightKey(id);
      expect(entry).toBeDefined();
      if (!entry) continue;
      expect(entry.angle).toBe(angle);
      expect(entry.left).toEqual({ lg: leftLg, sm: leftSm });
      expect(entry.width).toEqual({ lg: wLg, sm: wSm });
      expect(hexOf(entry.tint)).toBe(hex);
    }
  });

  test("only Contacto sits on stone", () => {
    const stone = LIGHT_KEYS.filter((entry) => entry.surface === "stone");
    expect(stone.map((entry) => entry.id)).toEqual(["contacto"]);
  });

  test("ink, graphite and moss keep AA contrast over every tint", () => {
    for (const entry of LIGHT_KEYS) {
      const tint = hexOf(entry.tint);
      for (const fg of ["ink", "graphite", "moss"]) {
        const ratio = contrastRatio(hexOf(fg), tint);
        expect(`${fg} on ${entry.tint}: ${ratio >= 4.5}`).toBe(
          `${fg} on ${entry.tint}: true`,
        );
      }
    }
  });

  test("static band properties name tokens, never a hex", () => {
    const vars = bandVars(LIGHT_KEYS[11]);
    expect(vars["--band-tint"]).toBe("var(--color-light-stone)");
    expect(vars["--band-cut"]).toBe("var(--color-stone)");
    expect(vars["--band-left-sm"]).toBe("520");
    expect(bandVars(LIGHT_KEYS[0])["--band-cut"]).toBe("var(--color-wall)");
  });
});

describe("band width", () => {
  test("scales from 1440 between 1024 and 2560, clamped at both ends", () => {
    expect(bandWidth(400, 1440)).toBe(400);
    expect(bandWidth(400, 1920)).toBeCloseTo(533.33, 2);
    expect(bandWidth(400, 1024)).toBeCloseTo(284.44, 2);
    expect(bandWidth(400, 2560)).toBeCloseTo(711.11, 2);
    expect(bandWidth(400, 3840)).toBe(bandWidth(400, 2560));
  });

  test("scales from 390 below 1024, clamped to 320–1023 (D015)", () => {
    expect(bandWidth(150, 390)).toBe(150);
    expect(bandWidth(150, 768)).toBeCloseTo(295.38, 2);
    expect(bandWidth(150, 320)).toBeCloseTo(123.08, 2);
    expect(bandWidth(150, 280)).toBe(bandWidth(150, 320));
    expect(bandWidth(150, 1023)).toBeCloseTo(393.46, 2);
  });

  test("the layout switches at 1024", () => {
    expect(lightLayout(1023)).toBe("sm");
    expect(lightLayout(1024)).toBe("lg");
  });

  test("app/globals.css applies the same scale", () => {
    for (const layout of ["lg", "sm"] as const) {
      const scale = LIGHT_SCALE[layout];
      expect(rootVar(`light-ref-${layout}`)).toBe(String(scale.reference));
      expect(rootVar(`light-min-${layout}`)).toBe(`${scale.min}px`);
      expect(rootVar(`light-max-${layout}`)).toBe(`${scale.max}px`);
    }
    expect(rootVar("light-overshoot")).toBe("140px");
    expect(rootVar("light-mullion")).toBe("14px");
    expect(rootVar("light-transom")).toBe("10px");
    expect(rootVar("light-transom-at")).toBe("44%");
  });
});

describe("interpolation", () => {
  const lg = bandValues(LIGHT_KEYS, "lg", colorOf);
  const sm = bandValues(LIGHT_KEYS, "sm", colorOf);

  test("every whole progress is its key", () => {
    TABLE.forEach(([, angle, leftLg, wLg, leftSm, wSm, hex], index) => {
      expect(interpolate(lg, index)).toEqual({
        angle,
        left: leftLg,
        width: wLg,
        color: parseHex(hex),
      });
      expect(interpolate(sm, index).left).toBe(leftSm);
      expect(interpolate(sm, index).width).toBe(wSm);
    });
  });

  test("halfway between two keys is the midpoint, color per sRGB channel", () => {
    const mid = interpolate(lg, 10.5);
    expect(mid.angle).toBe(-59);
    expect(mid.left).toBe(152.5);
    expect(mid.width).toBe(275);
    // #FFF9E8 → #EAE4D8: (255+234)/2, (249+228)/2, (232+216)/2
    expect(rgbString(mid.color)).toBe("rgb(245 239 224)");
    expect(interpolate(sm, 0.5).left).toBe(100);
  });

  test("reads the colors the browser computes", () => {
    expect(parseColor("rgb(255, 253, 242)")).toEqual([255, 253, 242]);
    expect(parseColor("rgb(234 228 216)")).toEqual([234, 228, 216]);
    expect(parseColor("#fffdf2")).toEqual([255, 253, 242]);
    expect(() => parseColor("oklch(0.9 0 0)")).toThrow();
  });

  test("progress is clamped to the first and the last key", () => {
    expect(interpolate(lg, -3)).toEqual(lg[0]);
    expect(interpolate(lg, 99)).toEqual(lg[11]);
  });
});

describe("scroll", () => {
  test("progress runs linearly between consecutive snap positions", () => {
    const positions = [0, 900, 1800, 2700];
    expect(scrollProgress(positions, 0)).toBe(0);
    expect(scrollProgress(positions, 450)).toBe(0.5);
    expect(scrollProgress(positions, 900)).toBe(1);
    expect(scrollProgress(positions, 2250)).toBe(2.5);
    expect(scrollProgress(positions, 5000)).toBe(3);
    expect(scrollProgress(positions, -20)).toBe(0);
  });

  test("a key past the end of the page applies at the bottom", () => {
    const positions = keyPositions([0, 900, 1800, 2400], 2100);
    expect(positions).toEqual([0, 900, 1800, 2100]);
    expect(scrollProgress(positions, 2100)).toBe(3);
    // Two keys at the same position never divide by zero
    expect(scrollProgress(keyPositions([0, 900, 900], 2000), 900)).toBe(2);
  });

  test("coverage is the share of the viewport a section fills", () => {
    // Section from 3000 to 4000, viewport 800 high
    expect(viewportCoverage(3000, 4000, 2000, 800)).toBe(0);
    expect(viewportCoverage(3000, 4000, 2600, 800)).toBe(0.5);
    expect(viewportCoverage(3000, 4000, 2601, 800)).toBeGreaterThan(0.5);
    expect(viewportCoverage(3000, 4000, 3100, 800)).toBe(1);
    expect(viewportCoverage(3000, 4000, 3600, 800)).toBe(0.5);
  });
});
