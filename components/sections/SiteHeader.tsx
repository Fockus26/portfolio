import { getTranslations } from "next-intl/server";
import { SECTION_IDS } from "@/lib/site";

// Structure only (phase 02): the fixed bar, its landmark and the wordmark. The project
// index, the language switch and the "Contacto" button arrive in phase 03 (HANDOFF § 2.3–2.5).
export async function SiteHeader() {
  const t = await getTranslations("Header");

  return (
    <header className="fixed inset-x-0 top-0 z-header h-header bg-wall">
      <nav
        aria-label={t("navLabel")}
        className="mx-auto flex h-full w-full max-w-page items-center justify-between px-4 md:px-side"
      >
        <a
          href={`#${SECTION_IDS.entrance}`}
          aria-label={t("wordmarkLabel")}
          className="inline-flex min-h-11 items-center rounded-sm text-wordmark tracking-wordmark text-ink"
        >
          {t("wordmark")}
        </a>
      </nav>
    </header>
  );
}
