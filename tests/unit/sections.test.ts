import { expect, test } from "bun:test";
import { projects } from "@/content/projects";
import { isPlainClick } from "@/lib/anchors";
import {
  buildSections,
  formatRoomNumber,
  formatRoomRange,
  groupIndexRows,
  pad2,
  projectSectionId,
  triggerLabel,
} from "@/lib/sections";
import { SECTION_IDS } from "@/lib/site";

const NAMES = { entrance: "Inicio", about: "Sobre mí", contact: "Contacto" };
const sections = buildSections(projects, NAMES);

test("room numbers are two digits: 01 / 09", () => {
  expect(pad2(3)).toBe("03");
  expect(pad2(12)).toBe("12");
  expect(formatRoomNumber(1, 9)).toBe("01 / 09");
  expect(formatRoomNumber(9, 9)).toBe("09 / 09");
  expect(formatRoomNumber(3, 12)).toBe("03 / 12");
  expect(formatRoomRange(9)).toBe("01–09");
  expect(projectSectionId(3)).toBe("p03");
});

test("the sections follow the page: entrance, the nine rooms, about, contact", () => {
  expect(sections.map((s) => s.id)).toEqual([
    SECTION_IDS.entrance,
    "p01",
    "p02",
    "p03",
    "p04",
    "p05",
    "p06",
    "p07",
    "p08",
    "p09",
    SECTION_IDS.about,
    SECTION_IDS.contact,
  ]);
  expect(new Set(sections.map((s) => s.id)).size).toBe(sections.length);
  expect(sections[3]).toEqual({
    id: "p03",
    kind: "project",
    order: 3,
    name: "Inversiones JS",
  });
});

test("the sections sort the projects even if they arrive out of order", () => {
  const shuffled = buildSections(
    [
      { order: 2, name: "B" },
      { order: 1, name: "A" },
    ],
    NAMES,
  );
  expect(shuffled.map((s) => s.name)).toEqual([
    "Inicio",
    "A",
    "B",
    "Sobre mí",
    "Contacto",
  ]);
});

test("the popover lists Inicio, the projects, then Sobre mí and Contacto", () => {
  const groups = groupIndexRows(sections, "popover");
  expect(groups.map((g) => g.map((s) => s.kind))).toEqual([
    ["entrance"],
    Array(9).fill("project"),
    ["about", "contact"],
  ]);
});

test("the sheet lists the projects first, then Inicio, Sobre mí and Contacto", () => {
  const groups = groupIndexRows(sections, "sheet");
  expect(groups.map((g) => g.map((s) => s.kind))).toEqual([
    Array(9).fill("project"),
    ["entrance", "about", "contact"],
  ]);
  expect(groups.flat().length).toBe(sections.length);
});

test("the trigger reads the room in a project and the range elsewhere", () => {
  const at = (id?: string) =>
    triggerLabel(
      sections.find((s) => s.id === id),
      9,
      "Proyectos",
    );
  expect(at("p03")).toEqual({ number: "03 / 09", name: "Inversiones JS" });
  expect(at(SECTION_IDS.entrance)).toEqual({
    number: "01–09",
    name: "Proyectos",
  });
  expect(at(undefined)).toEqual({ number: "01–09", name: "Proyectos" });
  expect(at(SECTION_IDS.about)).toEqual({ number: "01–09", name: "Sobre mí" });
  expect(at(SECTION_IDS.contact)).toEqual({
    number: "01–09",
    name: "Contacto",
  });
});

test("only a plain left click is handled by the page", () => {
  const click = {
    button: 0,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
  };
  expect(isPlainClick(click)).toBe(true);
  expect(isPlainClick({ ...click, ctrlKey: true })).toBe(false);
  expect(isPlainClick({ ...click, metaKey: true })).toBe(false);
  expect(isPlainClick({ ...click, button: 1 })).toBe(false);
});
