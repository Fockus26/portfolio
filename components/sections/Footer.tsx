import { ArrowUp } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SectionLink } from "@/components/ui/SectionLink";
import { textLinkVariants } from "@/components/ui/TextLink";
import { SECTION_IDS } from "@/lib/site";
import { cn } from "@/lib/utils";

// The year is read inside a cached function: with Cache Components a `new Date()` in the
// prerendered shell is a build error.
async function currentYear(): Promise<number> {
  "use cache";
  return new Date().getFullYear();
}

// The foot of the page, inside Contacto (HANDOFF § 2.14)
export async function Footer({ className }: { className?: string }) {
  const t = await getTranslations("Contact");
  const year = await currentYear();

  return (
    <footer
      className={cn(
        "flex min-h-18 flex-wrap items-center justify-between gap-x-6",
        className,
      )}
    >
      <p className="text-small">{t("footer", { year: String(year) })}</p>
      <SectionLink
        sectionId={SECTION_IDS.entrance}
        className={textLinkVariants({ variant: "quiet" })}
      >
        {t("backToTop")}
        <ArrowUp aria-hidden="true" />
      </SectionLink>
    </footer>
  );
}
