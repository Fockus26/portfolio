import { SECTION_IDS } from "@/lib/site";

/** One stop of the page: the entrance, a project room, "Sobre mí" or "Contacto". */
export type SectionEntry = {
  /** The anchor id (`inicio`, `p03`, `sobre-mi`, `contacto`). */
  id: string;
  kind: "entrance" | "project" | "about" | "contact";
  /** Position of a project, starting at 1. */
  order?: number;
  /** Name shown in the index, already in the visitor's language. */
  name: string;
};

export type SectionNames = { entrance: string; about: string; contact: string };

/** `3` → `03`. */
export function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/** Anchor id of a project room (HANDOFF § 3): `p01` … `p09`. */
export function projectSectionId(order: number): string {
  return `p${pad2(order)}`;
}

/** Room number of a project (HANDOFF § 2.10): `03 / 09`. */
export function formatRoomNumber(order: number, total: number): string {
  return `${pad2(order)} / ${pad2(total)}`;
}

/** The whole range, shown outside the rooms: `01–09`. */
export function formatRoomRange(total: number): string {
  return `${pad2(1)}–${pad2(total)}`;
}

/** Every section in page order. */
export function buildSections(
  projects: ReadonlyArray<{ order: number; name: string }>,
  names: SectionNames,
): SectionEntry[] {
  return [
    { id: SECTION_IDS.entrance, kind: "entrance", name: names.entrance },
    ...[...projects]
      .sort((a, b) => a.order - b.order)
      .map(
        (project): SectionEntry => ({
          id: projectSectionId(project.order),
          kind: "project",
          order: project.order,
          name: project.name,
        }),
      ),
    { id: SECTION_IDS.about, kind: "about", name: names.about },
    { id: SECTION_IDS.contact, kind: "contact", name: names.contact },
  ];
}

/**
 * The index rows in groups; a separator goes between groups (HANDOFF § 2.5).
 * Popover (≥768): Inicio · 01–09 · Sobre mí, Contacto. Sheet (<768): 01–09 · the rest.
 */
export function groupIndexRows(
  sections: readonly SectionEntry[],
  layout: "popover" | "sheet",
): SectionEntry[][] {
  const projects = sections.filter((s) => s.kind === "project");
  const entrance = sections.filter((s) => s.kind === "entrance");
  const closing = sections.filter(
    (s) => s.kind === "about" || s.kind === "contact",
  );
  const groups =
    layout === "popover"
      ? [entrance, projects, closing]
      : [projects, [...entrance, ...closing]];
  return groups.filter((group) => group.length > 0);
}

/** What the index trigger reads for the section in view (HANDOFF § 2.5). */
export function triggerLabel(
  current: SectionEntry | undefined,
  total: number,
  projectsLabel: string,
): { number: string; name: string } {
  if (current?.kind === "project" && current.order !== undefined) {
    return {
      number: formatRoomNumber(current.order, total),
      name: current.name,
    };
  }
  return {
    number: formatRoomRange(total),
    name: current && current.kind !== "entrance" ? current.name : projectsLabel,
  };
}
