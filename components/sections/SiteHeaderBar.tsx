"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { ProjectIndex } from "@/components/ui/ProjectIndex";
import { SectionLink } from "@/components/ui/SectionLink";
import { useCurrentSection } from "@/hooks/useCurrentSection";
import { useScrolled } from "@/hooks/useScrolled";
import { Link, usePathname } from "@/i18n/navigation";
import type { SectionEntry } from "@/lib/sections";
import { SECTION_IDS } from "@/lib/site";
import { cn } from "@/lib/utils";

/** The header's hairline appears once the page has moved this many px (HANDOFF § 2.3). */
const SCROLL_LINE_AT = 8;

/**
 * On a status screen (404, 500, offline: HANDOFF § 5b) the header is the wordmark as text
 * and the language, nothing else. The screen marks its root with `data-status-screen` and
 * the bar looks for it from the body with `:has()`: no JavaScript, so no flash. The classes
 * are written out in full (`[body:has([data-status-screen])_&]:…`) so Tailwind finds them.
 */

type SiteHeaderBarProps = {
  /** Every section of the page, in order, with its name in the visitor's language. */
  sections: readonly SectionEntry[];
};

// The interactive part of the header (HANDOFF § 2.3): wordmark · project index · language
// and "Contacto". It follows the section in view; the bar itself is solid, never blurred.
export function SiteHeaderBar({ sections }: SiteHeaderBarProps) {
  const t = useTranslations("Header");
  const currentId = useCurrentSection(sections.map((section) => section.id));
  const scrolled = useScrolled(SCROLL_LINE_AT);
  // Off the home page (a status screen, the dev galleries) "inicio" is not on the page
  const isHome = usePathname() === "/";
  const wordmarkClass =
    "inline-flex min-h-11 min-w-11 items-center rounded-sm text-wordmark tracking-wordmark text-ink focus-visible:outline-offset-4 max-md:justify-center max-md:focus-visible:outline-offset-2 [body:has([data-status-screen])_&]:justify-start";
  const wordmark = (
    <>
      {/* The mark is a drawing, not a label: its letters come from CSS so the link's
          name stays "César León, inicio" for everyone (HANDOFF § 2.3) */}
      <span
        aria-hidden="true"
        data-mark={t("monogram")}
        className="grid size-8 place-items-center rounded-sm bg-moss text-monogram tracking-monogram text-wall before:content-[attr(data-mark)] md:hidden [body:has([data-status-screen])_&]:hidden"
      />
      <span className="max-md:hidden [body:has([data-status-screen])_&]:inline">
        {t("wordmark")}
      </span>
    </>
  );

  return (
    <nav
      aria-label={t("navLabel")}
      className="relative mx-auto flex h-full w-full max-w-page items-center justify-between gap-1 px-4 md:gap-4 md:px-side"
    >
      {isHome ? (
        <SectionLink
          sectionId={SECTION_IDS.entrance}
          aria-label={t("wordmarkLabel")}
          className={wordmarkClass}
        >
          {wordmark}
        </SectionLink>
      ) : (
        <Link
          href="/"
          aria-label={t("wordmarkLabel")}
          className={wordmarkClass}
        >
          {wordmark}
        </Link>
      )}

      <ProjectIndex
        sections={sections}
        currentId={currentId}
        className="[body:has([data-status-screen])_&]:hidden"
      />

      <div className="flex items-center gap-1 md:gap-6">
        <LanguageSwitch sectionId={isHome ? currentId : undefined} />
        <Button
          asChild
          size="sm"
          className="[body:has([data-status-screen])_&]:hidden"
        >
          <SectionLink sectionId={SECTION_IDS.contact}>
            {t("contact")}
          </SectionLink>
        </Button>
      </div>

      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-px bg-line opacity-0 transition-opacity duration-fast ease-out motion-reduce:transition-none",
          scrolled && "opacity-100",
        )}
      />
    </nav>
  );
}
