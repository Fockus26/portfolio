// Pure logic of the status screens (HANDOFF § 5b): which variant shows for which failure,
// the document title and the language of the screen that has no providers.

export const STATUS_VARIANTS = [
  "not-found",
  "error",
  "error-no-code",
  "offline",
] as const;

export type StatusVariant = (typeof STATUS_VARIANTS)[number];

/** How long "Copiado" replaces the copy button (HANDOFF § 2.12). */
export const COPIED_MS = 2000;

/** The part of every status title after the label: "Error 404 · César León". */
export const SITE_NAME = "César León";

export function isStatusVariant(
  value: string | undefined,
): value is StatusVariant {
  return STATUS_VARIANTS.some((variant) => variant === value);
}

/**
 * The screen an error shows (kit STATUS-SCREENS): no connection wins over everything, the
 * rest is a 500 that carries the error's `digest` when there is one. Never the message.
 */
export function pickErrorVariant(state: {
  online: boolean;
  digest?: string | null;
}): "offline" | "error" | "error-no-code" {
  if (!state.online) return "offline";
  return state.digest ? "error" : "error-no-code";
}

/** The digest of a thrown value, or undefined when it is not a string worth showing. */
export function digestOf(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  const digest = (error as { digest?: unknown }).digest;
  return typeof digest === "string" && digest.length > 0 ? digest : undefined;
}

/** `document.title` of a status screen: label + " · César León". */
export function statusTitle(label: string): string {
  return `${label} · ${SITE_NAME}`;
}

/** The language of a path that has no next-intl around it (`/en/x` → en, else es). */
export function localeFromPath(pathname: string): "es" | "en" {
  return pathname.split("/")[1] === "en" ? "en" : "es";
}
