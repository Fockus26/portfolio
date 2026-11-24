"use client";

import { useLocale, useTranslations } from "next-intl";
import { Fragment } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type LanguageSwitchProps = {
  /** Id of the section in view: the other language opens at the same place (`/en#p03`). */
  sectionId?: string;
  className?: string;
};

// The two language links (HANDOFF § 2.4). The current one is marked by weight and a bar,
// never by color alone.
export function LanguageSwitch({ sectionId, className }: LanguageSwitchProps) {
  const t = useTranslations("LanguageSwitch");
  const current = useLocale();
  const pathname = usePathname();
  const href = sectionId ? `${pathname}#${sectionId}` : pathname;

  return (
    <nav
      aria-label={t("label")}
      className={cn("flex items-center gap-1 text-small", className)}
    >
      {routing.locales.map((locale, index) => {
        const isCurrent = locale === current;
        return (
          <Fragment key={locale}>
            {index > 0 && (
              <span aria-hidden="true" className="text-line-strong">
                /
              </span>
            )}
            <Link
              href={href}
              locale={locale}
              lang={locale}
              hrefLang={locale}
              aria-current={isCurrent ? "true" : undefined}
              className={cn(
                "relative inline-grid h-11 min-w-9 place-items-center rounded-sm underline-offset-5",
                "transition-colors duration-fast ease-out hover:text-ink hover:underline",
                "focus-visible:-outline-offset-4 motion-reduce:transition-none",
                isCurrent
                  ? "font-semibold text-ink after:absolute after:inset-x-2 after:bottom-2 after:h-0.5 after:bg-ink"
                  : "text-graphite",
              )}
            >
              {t(`code.${locale}`)}
            </Link>
          </Fragment>
        );
      })}
    </nav>
  );
}
