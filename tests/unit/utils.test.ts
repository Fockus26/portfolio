import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { buttonVariants } from "@/components/ui/button";
import { isExternalHref } from "@/lib/links";
import { cn, TEXT_SIZES } from "@/lib/utils";

const css = readFileSync("app/globals.css", "utf8");

/** Every `--text-<name>` size of the theme (not its line-height or weight modifiers). */
const themeSizes = [...css.matchAll(/--text-([a-z0-9-]+):/g)]
  .map((match) => match[1])
  .filter((name) => !name.includes("--"));

test("every font size of the theme is registered in cn()", () => {
  expect(themeSizes.length).toBeGreaterThan(10);
  expect([...TEXT_SIZES].sort() as string[]).toEqual(
    [...new Set(themeSizes)].sort(),
  );
});

test("cn() keeps a font size next to a text color", () => {
  for (const size of TEXT_SIZES) {
    expect(cn(`text-${size}`, "text-wall")).toBe(`text-${size} text-wall`);
    expect(cn("text-moss", `text-${size}`)).toBe(`text-moss text-${size}`);
  }
});

test("cn() lets the later class win inside one group", () => {
  expect(cn("text-h1", "text-h2")).toBe("text-h2");
  expect(cn("text-ink", "text-graphite")).toBe("text-graphite");
  expect(cn("rounded-sm", "rounded-none")).toBe("rounded-none");
  expect(cn("duration-fast", "duration-slow")).toBe("duration-slow");
  expect(cn("z-header", "z-sheet")).toBe("z-sheet");
  expect(cn("px-6", false, undefined, "px-3")).toBe("px-3");
});

test("the button takes the focus ring of its own ink", () => {
  expect(buttonVariants({ variant: "primary" })).toContain(
    "focus-visible:outline-moss",
  );
  expect(buttonVariants({ variant: "secondary" })).toContain(
    "focus-visible:outline-ink",
  );
});

test("every button size keeps a 44px target", () => {
  expect(buttonVariants({ size: "sm" })).toContain("min-h-11");
  expect(buttonVariants({ size: "md" })).toContain("min-h-12");
  expect(buttonVariants({ size: "lg" })).toContain("min-h-14");
  // 36px high, extended to 44px by its pseudo-element
  expect(buttonVariants({ size: "xs" })).toContain("after:-inset-y-1.25");
});

test("only http(s) links count as external", () => {
  expect(isExternalHref("https://example.com")).toBe(true);
  expect(isExternalHref("http://example.com")).toBe(true);
  expect(isExternalHref("mailto:nombre@example.com")).toBe(false);
  expect(isExternalHref("#contacto")).toBe(false);
  expect(isExternalHref("/en")).toBe(false);
});
