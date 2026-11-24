import type { Project } from "@/content/types";

export const project: Project = {
  slug: "melao",
  order: 2,
  name: "Melao",
  kind: { es: "App para aprender a bailar", en: "Dance learning app" },
  sentence: {
    es: "Alumnos de salsa y merengue practican en casa con un coach por voz.",
    en: "Salsa and merengue students practise at home with a voice coach.",
  },
  summary: {
    es: "El alumno sigue un curso en video, baila combinaciones mientras una voz le anuncia cada paso al ritmo de la canción y califica cómo le salió. La app decide qué repasar cada día. El profesor carga pasos, canciones y lecciones desde su panel.",
    en: "A student follows a video course, dances combinations while a voice calls each step in time with the song, and rates how it went. The app decides what to review each day. The teacher loads steps, songs and lessons from a private panel.",
  },
  role: {
    es: "Producto propio: concepto y desarrollo completo.",
    en: "Own product: concept and full development.",
  },
  stack: ["Next.js", "TypeScript", "Supabase", "Postgres", "Web Audio API"],
  links: [{ type: "live", url: "https://melao-two.vercel.app" }],
  media: {
    format: "phone",
    video: "/work/melao/loop",
    poster: "/work/melao/poster.jpg",
  },
  client: { name: "Melao", named: true },
};
