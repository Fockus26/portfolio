import { expect, test } from "bun:test";
import { projects } from "@/content/projects";
import { isLongName, ROOM_LAYOUTS, roomLayout, roomVars } from "@/lib/rooms";

test("every project has a room, and every room a project", () => {
  expect(Object.keys(ROOM_LAYOUTS).map(Number)).toEqual(
    projects.map((p) => p.order),
  );
  expect(() => roomLayout(10)).toThrow();
});

test("the grid lines are the handoff's table (§ 3)", () => {
  const table = projects.map((p) => {
    const { window, text, detail } = roomLayout(p.order);
    return [p.order, window.cols, text.cols, detail?.cols ?? null];
  });
  expect(table).toEqual([
    [1, [6, 13], [1, 6], null],
    [2, [2, 5], [7, 13], null],
    [3, [1, 7], [7, 13], null],
    [4, [9, 12], [2, 7], null],
    [5, [9, 12], [1, 8], null],
    [6, [1, 4], [5, 12], null],
    [7, [5, 13], [1, 5], null],
    [8, [1, 7], [7, 13], null],
    [9, [6, 9], [1, 6], [9, 13]],
  ]);
});

test("window and text never share a column, and stay inside the 12", () => {
  for (const layout of Object.values(ROOM_LAYOUTS)) {
    const spans = [layout.window.cols, layout.text.cols];
    if (layout.detail) spans.push(layout.detail.cols);
    const used = spans.flatMap(([start, end]) => {
      expect(start).toBeGreaterThanOrEqual(1);
      expect(end).toBeLessThanOrEqual(13);
      expect(end).toBeGreaterThan(start);
      return Array.from({ length: end - start }, (_, i) => start + i);
    });
    expect(new Set(used).size).toBe(used.length);
  }
});

test("a window that bleeds touches that edge and shows the reveal on the other side", () => {
  for (const { window } of Object.values(ROOM_LAYOUTS)) {
    if (window.bleed === "left") {
      expect(window.cols[0]).toBe(1);
      expect(window.reveal).toBe("right");
    }
    if (window.bleed === "right") {
      expect(window.cols[1]).toBe(13);
      expect(window.reveal).toBe("left");
    }
  }
});

test("16:9 windows go edge to edge when stacked; vertical ones keep a side", () => {
  for (const p of projects) {
    const { stacked } = roomLayout(p.order);
    expect(stacked === "bleed").toBe(p.media.format === "desktop");
  }
});

test("the CSS variables carry the lines and only the wall that is fixed", () => {
  expect(roomVars(roomLayout(1))).toEqual({
    "--room-window": "6 / 13",
    "--room-text": "1 / 6",
    "--room-detail": "1 / 6",
  });
  expect(roomVars(roomLayout(3))["--room-bottom"]).toBe("7rem");
  expect(roomVars(roomLayout(6))["--room-bottom"]).toBe("6rem");
  expect(roomVars(roomLayout(5))["--room-top"]).toBe("5.5rem");
  expect(roomVars(roomLayout(9))["--room-detail"]).toBe("9 / 13");
});

test("only a name over 18 characters is long", () => {
  expect(isLongName("Inversiones JL22")).toBe(false);
  expect(isLongName("a".repeat(18))).toBe(false);
  expect(isLongName("a".repeat(19))).toBe(true);
});
