// Public origin of the site, without a trailing slash. Until there is a custom domain
// (HANDOFF § 9, question 4) it falls back to the Vercel production domain.
export function resolveSiteUrl(
  env: Record<string, string | undefined> = process.env,
): string {
  const explicit = env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

/** In-page anchors (HANDOFF § 3). The ids are the same in both languages. */
export const SECTION_IDS = {
  main: "contenido",
  entrance: "inicio",
  about: "sobre-mi",
  contact: "contacto",
} as const;

/** Open Graph locale of each site language (PROJECT_CONTEXT › Language and market). */
export const OG_LOCALES = { es: "es_VE", en: "en_US" } as const;
