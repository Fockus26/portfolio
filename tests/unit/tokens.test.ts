import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  COLOR_TOKENS,
  CONTRAST_PAIRS,
  contrastRatio,
  TYPE_ROLES,
} from "@/lib/tokens";

const css = readFileSync("app/globals.css", "utf8");
const scale = readFileSync("app/styles/type-scale.css", "utf8");

function hexOf(token: string): string {
  const match = css.match(new RegExp(`--color-${token}:\\s*(#[0-9a-f]{6});`));
  if (!match) throw new Error(`--color-${token} is not a hex in globals.css`);
  return match[1];
}

test("every color token of the handoff exists in the theme", () => {
  for (const token of COLOR_TOKENS) expect(hexOf(token)).toMatch(/^#/);
});

test("every pair the design uses reaches its WCAG minimum in the real theme", () => {
  for (const [fg, bg, min] of CONTRAST_PAIRS) {
    const ratio = contrastRatio(hexOf(fg), hexOf(bg));
    expect(`${fg} on ${bg}: ${ratio >= min}`).toBe(`${fg} on ${bg}: true`);
  }
});

test("brass never reaches text contrast, so it stays decorative", () => {
  expect(contrastRatio(hexOf("brass"), hexOf("wall"))).toBeLessThan(4.5);
  expect(contrastRatio(hexOf("brass"), hexOf("stone"))).toBeLessThan(3);
});

test("every type role has a fluid size and a text utility", () => {
  for (const role of TYPE_ROLES) {
    expect(scale).toContain(`--fs-${role}:`);
    expect(css).toContain(`--text-${role}: var(--fs-${role});`);
  }
});

test("the default Tailwind palette, breakpoints, radii and shadows are removed", () => {
  for (const ns of ["color", "breakpoint", "radius", "shadow", "text"]) {
    expect(css).toContain(`--${ns}-*: initial;`);
  }
});
