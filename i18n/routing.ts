import { defineRouting } from "next-intl/routing";

// D001: Spanish by default, English second; both always carry their prefix (/es, /en).
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
