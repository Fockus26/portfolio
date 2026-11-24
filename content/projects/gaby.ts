import type { Project } from "@/content/types";

export const project: Project = {
  slug: "gaby",
  order: 4,
  name: "Gaby",
  kind: { es: "Asistente de WhatsApp", en: "WhatsApp assistant" },
  sentence: {
    es: "Los clientes eligen teléfono, cotizan su póliza y agendan cita por WhatsApp.",
    en: "Customers pick a phone, get a policy quote and book a visit on WhatsApp.",
  },
  summary: {
    es: "Gaby responde en el WhatsApp de la tienda: muestra los equipos disponibles con sus cuotas, cotiza la póliza del vehículo y agenda citas. Avisa al equipo de cada solicitud, recuerda citas y vencimientos, y se calla cuando el dueño escribe.",
    en: "Gaby answers on the store's WhatsApp: it shows the phones in stock with their instalments, quotes vehicle insurance and books appointments. It alerts the team to each request, sends reminders, and goes quiet when the owner writes.",
  },
  role: { es: "Desarrollo completo.", en: "Full development." },
  stack: ["Bun", "TypeScript", "Evolution API", "Postgres", "Google Calendar"],
  links: [{ type: "code", url: "https://github.com/Fockus26/inversiones-js" }],
  media: {
    format: "chat",
    video: "/work/gaby/loop",
    poster: "/work/gaby/poster.jpg",
  },
  client: { name: "Inversiones JS", named: true },
};
