import type { Project } from "@/content/types";

export const project: Project = {
  slug: "inversiones-js",
  order: 3,
  name: "Inversiones JS",
  kind: { es: "Panel de gestión", en: "Management panel" },
  sentence: {
    es: "La tienda actualiza su catálogo y lleva sus créditos desde el teléfono.",
    en: "The store updates its catalogue and tracks its credit sales by phone.",
  },
  summary: {
    es: "La tienda cambia equipos, cuotas y existencias, y su asistente de WhatsApp responde con esos datos en menos de un minuto. También lleva las cuotas de cada cliente, las pólizas por vencer y las solicitudes que llegan del chat.",
    en: "The store changes phones, instalments and stock, and its WhatsApp assistant answers with that data in under a minute. It also tracks each customer's instalments, policies about to expire and the requests coming in from the chat.",
  },
  role: { es: "Desarrollo completo.", en: "Full development." },
  stack: ["Next.js", "TypeScript", "Postgres", "Drizzle", "Tailwind"],
  links: [{ type: "code", url: "https://github.com/Fockus26/inversiones-js" }],
  media: {
    format: "desktop",
    video: "/work/inversiones-js/loop",
    poster: "/work/inversiones-js/poster.jpg",
  },
  client: { name: "Inversiones JS", named: true },
};
