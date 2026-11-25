import { ArrowDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { SectionLink } from "@/components/ui/SectionLink";
import { SECTION_IDS } from "@/lib/site";

const PARAGRAPHS = ["work", "products", "way"] as const;

// "Sobre mí" (HANDOFF § 3 · 11): who César is in one sentence, three short paragraphs
// under the brass rule, and the way to contact. Without the optional portrait (§ 9, 6).
export function About() {
  const t = useTranslations("About");
  const sections = useTranslations("Sections");
  const titleId = `${SECTION_IDS.about}-title`;

  return (
    <section
      id={SECTION_IDS.about}
      aria-labelledby={titleId}
      // One viewport from 1024, never shorter than 720px: the same floor as the entrance
      className="page-section lg:entrance-h lg:pt-header"
    >
      <div className="container-page py-24 lg:grid-page lg:pt-30 lg:pb-10">
        <h2 id={titleId} className="text-h6 text-graphite lg:col-span-full">
          {sections("about")}
        </h2>
        <p className="mt-4 text-h3 text-balance lg:col-span-9 lg:mt-6">
          {t("statement")}
        </p>
        {/* brass is never text: here it is only a rule */}
        <div
          aria-hidden="true"
          className="mt-10 h-px bg-brass lg:col-span-full lg:mt-18"
        />
        {PARAGRAPHS.map((key, index) => (
          <p
            key={key}
            className={
              index === 0
                ? "mt-6 text-body-lg lg:col-span-4"
                : "mt-4 text-body-lg lg:col-span-4 lg:mt-6"
            }
          >
            {t(`paragraphs.${key}`)}
          </p>
        ))}
        <div className="mt-10 lg:col-span-full lg:mt-14">
          <Button asChild>
            <SectionLink sectionId={SECTION_IDS.contact}>
              {t("contact")}
              <ArrowDown aria-hidden="true" />
            </SectionLink>
          </Button>
        </div>
      </div>
    </section>
  );
}
