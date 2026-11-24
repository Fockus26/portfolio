import { getTranslations } from "next-intl/server";
import { SECTION_IDS } from "@/lib/site";

// First focusable element of the page (HANDOFF § 2.3). It is always in place and only
// becomes visible, and clickable, while it has the focus.
export async function SkipLink() {
  const t = await getTranslations("Layout");

  return (
    <a
      href={`#${SECTION_IDS.main}`}
      className="pointer-events-none fixed top-2 left-2 z-skip inline-flex min-h-11 items-center rounded-sm bg-wall px-4 text-button text-ink opacity-0 focus:pointer-events-auto focus:opacity-100"
    >
      {t("skipLink")}
    </a>
  );
}
