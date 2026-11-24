import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const css = readFileSync("app/globals.css", "utf8");
const REM = 16;

/** HANDOFF § 4: breakpoint → columns, gutter and side padding, all in px. */
const GRID = [
  { at: 360, cols: 4, gutter: 16, side: 24 },
  { at: 768, cols: 8, gutter: 24, side: 40 },
  { at: 1024, cols: 12, gutter: 24, side: 48 },
  { at: 1440, cols: 12, gutter: 24, side: 80 },
  { at: 1920, cols: 12, gutter: 24, side: 120 },
  { at: 2560, cols: 12, gutter: 32, side: 200 },
];

/** Reads the `:root` blocks of the theme and resolves a variable at a viewport width. */
function valueAt(name: string, width: number): string {
  const blocks = [
    ...css.matchAll(
      /(?:@media \(min-width: ([\d.]+)rem\) \{\s*)?:root \{([^}]*)\}/g,
    ),
  ];
  let value = "";
  for (const [, min, body] of blocks) {
    if (min && Number(min) * REM > width) continue;
    const found = body.match(new RegExp(`--${name}:\\s*([^;]+);`));
    if (found) value = found[1].trim();
  }
  return value;
}

function px(value: string, width: number): number {
  // The only computed value: the padding that keeps the content at 1760px
  const fluid = value.match(
    /^calc\(\(min\(100vw, ([\d.]+)rem\) - ([\d.]+)rem\) \/ 2\)$/,
  );
  if (fluid) {
    return (
      (Math.min(width, Number(fluid[1]) * REM) - Number(fluid[2]) * REM) / 2
    );
  }
  return Number.parseFloat(value) * REM;
}

test("columns, gutter and side padding match the handoff at every breakpoint", () => {
  for (const row of GRID) {
    expect({
      at: row.at,
      cols: Number(valueAt("grid-cols", row.at)),
      gutter: px(valueAt("gutter", row.at), row.at),
      side: px(valueAt("side-pad", row.at), row.at),
    }).toEqual(row);
  }
});

test("the container is 2160px with its padding and the content never passes 1760px", () => {
  const container =
    Number(css.match(/--container-page: ([\d.]+)rem/)?.[1]) * REM;
  expect(container).toBe(2160);

  for (let width = 320; width <= 3840; width += 20) {
    const side = px(valueAt("side-pad", width), width);
    const content = Math.min(width, container) - 2 * side;
    expect(`${width}: ${content <= 1760}`).toBe(`${width}: true`);
    expect(side).toBeGreaterThanOrEqual(24);
  }
});

test("the content keeps at least 272px at 320px wide", () => {
  expect(320 - 2 * px(valueAt("side-pad", 320), 320)).toBe(272);
});

test("sections land under the header when stacked and at the top on desktop", () => {
  const section =
    css.match(/@utility page-section \{([\s\S]*?)\n\}/)?.[1] ?? "";
  expect(section).toContain("scroll-margin-top: var(--header-h);");
  expect(section).toMatch(
    /@media \(min-width: 64rem\) \{\s*scroll-margin-top: 0;\s*scroll-snap-align: start;/,
  );
});
