import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { routing } from "@/i18n/routing";
import { OG_LOCALES, resolveSiteUrl } from "@/lib/site";

type Tree = { [key: string]: string | Tree };

function load(locale: string): Tree {
  return JSON.parse(readFileSync(`messages/${locale}.json`, "utf8"));
}

/** Every leaf as "Namespace.key". */
function keysOf(tree: Tree, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === "string"
      ? [`${prefix}${key}`]
      : keysOf(value, `${prefix}${key}.`),
  );
}

function valuesOf(tree: Tree): string[] {
  return Object.values(tree).flatMap((value) =>
    typeof value === "string" ? [value] : valuesOf(value),
  );
}

test("Spanish is the default language and both carry a message file", () => {
  expect(routing.defaultLocale).toBe("es");
  expect([...routing.locales]).toEqual(["es", "en"]);
  for (const locale of routing.locales) {
    expect(keysOf(load(locale)).length).toBeGreaterThan(0);
  }
});

test("every language has exactly the same message keys", () => {
  const reference = keysOf(load(routing.defaultLocale)).sort();
  for (const locale of routing.locales) {
    expect(keysOf(load(locale)).sort()).toEqual(reference);
  }
});

test("no message is empty or left as a template placeholder", () => {
  for (const locale of routing.locales) {
    for (const value of valuesOf(load(locale))) {
      expect(value.trim()).not.toBe("");
      expect(value).not.toMatch(/\{\{|PENDING|lorem/i);
    }
  }
});

test("every language has its Open Graph locale", () => {
  for (const locale of routing.locales) {
    expect(OG_LOCALES[locale]).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
  }
});

test("the site URL prefers the explicit variable, then Vercel, then localhost", () => {
  expect(
    resolveSiteUrl({
      NEXT_PUBLIC_SITE_URL: "https://example.com/",
      VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app",
    }),
  ).toBe("https://example.com");
  expect(
    resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app" }),
  ).toBe("https://x.vercel.app");
  expect(resolveSiteUrl({})).toBe("http://localhost:3000");
});
