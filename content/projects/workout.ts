import type { Project } from "@/content/types";

export const project: Project = {
  slug: "workout",
  order: 6,
  name: "Workout",
  kind: { es: "App web de entrenamiento", en: "Workout tracking web app" },
  sentence: {
    es: "Anotas cada serie en el gym y la app calcula tu próxima sesión.",
    en: "Log each set at the gym and the app works out your next session.",
  },
  summary: {
    es: "Abres el día, ves qué te toca y anotas cada serie desde el teléfono, entre descansos. Al terminar eliges cómo progresar y la próxima sesión queda lista. Sigue guardando sin señal y sube todo cuando vuelve la red.",
    en: "Open the day, see what is next and log each set from your phone between rests. When you finish you choose how to progress and the next session is ready. It keeps saving with no signal and sends everything once you are back online.",
  },
  role: {
    es: "Producto propio: desarrollo completo.",
    en: "Own product: full development.",
  },
  stack: ["Next.js", "TypeScript", "Postgres", "PWA", "Tailwind"],
  links: [{ type: "live", url: "https://workout-two-psi.vercel.app" }],
  media: {
    format: "phone",
    video: "/work/workout/loop",
    poster: "/work/workout/poster.jpg",
  },
  client: { name: "Workout", named: true },
};
