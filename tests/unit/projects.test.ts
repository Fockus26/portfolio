import { expect, test } from "bun:test";
import { projects } from "@/content/projects";

test("the nine projects are in order, with unique slugs", () => {
  expect(projects.map((p) => p.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
});

test("every project has both languages and at least one public link", () => {
  for (const p of projects) {
    for (const text of [p.kind, p.sentence, p.summary, p.role]) {
      expect(text.es.length).toBeGreaterThan(0);
      expect(text.en.length).toBeGreaterThan(0);
    }
    expect(p.links.length).toBeGreaterThan(0);
    expect(p.stack.length).toBeGreaterThanOrEqual(3);
    expect(p.stack.length).toBeLessThanOrEqual(5);
  }
});

test("the client-facing texts stay short enough for one screen", () => {
  for (const p of projects) {
    expect(p.sentence.es.length).toBeLessThanOrEqual(80);
    expect(p.sentence.en.length).toBeLessThanOrEqual(80);
    expect(p.summary.es.length).toBeLessThanOrEqual(260);
    expect(p.summary.en.length).toBeLessThanOrEqual(260);
  }
});
