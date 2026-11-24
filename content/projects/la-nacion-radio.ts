import type { Project } from "@/content/types";

export const project: Project = {
  slug: "la-nacion-radio",
  order: 9,
  name: "La Nación Radio",
  kind: {
    es: "App móvil de radio y noticias",
    en: "Radio and news mobile app",
  },
  sentence: {
    es: "La emisora reúne su radio en vivo, programas y noticias en una app.",
    en: "The station brings its live radio, shows and news into one app.",
  },
  summary: {
    es: "La Nación Radio lleva su señal en vivo, sus programas y las noticias del diario a un solo lugar. El oyente sigue escuchando mientras lee o busca un negocio en el directorio, y los anunciantes de la emisora aparecen en cada sección.",
    en: "La Nación Radio puts its live signal, its shows and the newspaper's news in one place. Listeners keep listening while they read or look up a business in the directory, and the station's advertisers appear in every section.",
  },
  role: { es: "Desarrollo de la app móvil.", en: "Mobile app development." },
  stack: ["Flutter", "Dart", "Provider", "just_audio", "WordPress"],
  links: [
    {
      type: "case-study",
      url: "https://github.com/Fockus26/la-nacion-radio-mobile-case-study",
    },
  ],
  media: {
    format: "phone",
    video: "/work/la-nacion-radio/loop",
    poster: "/work/la-nacion-radio/poster.jpg",
  },
  client: { name: "La Nación Radio", named: true },
};
