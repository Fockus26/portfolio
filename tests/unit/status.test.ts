import { expect, test } from "bun:test";
import {
  COPIED_MS,
  digestOf,
  isStatusVariant,
  localeFromPath,
  pickErrorVariant,
  STATUS_VARIANTS,
  statusLight,
  statusTitle,
} from "@/lib/status";

test("without a connection the offline screen wins, with or without a code", () => {
  expect(pickErrorVariant({ online: false, digest: "123" })).toBe("offline");
  expect(pickErrorVariant({ online: false })).toBe("offline");
});

test("online: a digest gives the 500 with code, none gives the one without", () => {
  expect(pickErrorVariant({ online: true, digest: "123" })).toBe("error");
  expect(pickErrorVariant({ online: true })).toBe("error-no-code");
  expect(pickErrorVariant({ online: true, digest: "" })).toBe("error-no-code");
  expect(pickErrorVariant({ online: true, digest: null })).toBe(
    "error-no-code",
  );
});

test("digestOf reads only a non-empty string digest", () => {
  expect(digestOf(Object.assign(new Error("x"), { digest: "abc" }))).toBe(
    "abc",
  );
  expect(digestOf(new Error("x"))).toBeUndefined();
  expect(digestOf("boom")).toBeUndefined();
  expect(digestOf(null)).toBeUndefined();
  expect(digestOf({ digest: 42 })).toBeUndefined();
});

test("the document title is the label and the site name", () => {
  expect(statusTitle("Error 404")).toBe("Error 404 · César León");
});

test("the language comes from the first segment, Spanish by default", () => {
  expect(localeFromPath("/en/whatever")).toBe("en");
  expect(localeFromPath("/es")).toBe("es");
  expect(localeFromPath("/")).toBe("es");
  expect(localeFromPath("/english")).toBe("es");
});

test("variants are recognised by name", () => {
  expect(isStatusVariant("offline")).toBe(true);
  expect(isStatusVariant("live")).toBe(false);
  expect(isStatusVariant(undefined)).toBe(false);
});

test("'Copiado' stays 2 seconds (HANDOFF § 2.12)", () => {
  expect(COPIED_MS).toBe(2000);
});

test("the 404 and the 500 carry the band of the § 5b table, the offline screen none", () => {
  const nf = statusLight("not-found");
  expect(nf?.angle).toBe(-22);
  expect(nf?.left).toEqual({ lg: 84, sm: 150 });
  expect(nf?.width).toEqual({ lg: 360, sm: 135 });
  expect(nf?.tint).toBe("light-p02");
  const err = statusLight("error");
  expect(err?.angle).toBe(-42);
  expect(err?.left).toEqual({ lg: 108, sm: 230 });
  expect(err?.width).toEqual({ lg: 300, sm: 115 });
  expect(err?.tint).toBe("light-p07");
  expect(statusLight("error-no-code")).toBe(err);
  expect(statusLight("offline")).toBeUndefined();
});

test("every tint is a token that exists in globals.css, never a hex", async () => {
  const css = await Bun.file("app/globals.css").text();
  for (const variant of STATUS_VARIANTS) {
    const light = statusLight(variant);
    if (!light) continue;
    expect(light.tint).not.toContain("#");
    expect(css).toContain(`--color-${light.tint}:`);
  }
});
