import type { Project } from "@/content/types";

export const project: Project = {
  slug: "krea",
  order: 7,
  name: "KREA",
  kind: { es: "Portal de notas", en: "Grades portal" },
  sentence: {
    es: "Cada estudiante entiende su nota y sigue el ranking en vivo.",
    en: "Each student understands their grade and follows the live ranking.",
  },
  summary: {
    es: "Reemplaza la hoja de cálculo de notas de la escuela. Cada estudiante ve desde el teléfono cómo se evaluó cada pregunta, entrega sus tareas y sigue el puesto de su equipo; los profesores crean tareas, evalúan y ajustan puntos.",
    en: "It replaces the school's grades spreadsheet. Each student sees on their phone how every question was graded, hands in their tasks and follows their team's rank; teachers create tasks, grade them and adjust points.",
  },
  role: { es: "Desarrollo completo.", en: "Full development." },
  stack: ["Next.js", "TypeScript", "Postgres", "Drizzle", "Tailwind"],
  links: [
    { type: "live", url: "https://krea.fockus.dev" },
    { type: "code", url: "https://github.com/Fockus26/krea" },
  ],
  media: {
    format: "desktop",
    video: "/work/krea/loop",
    poster: "/work/krea/poster.jpg",
  },
  client: { name: "Escuela Creativa", named: true },
};
