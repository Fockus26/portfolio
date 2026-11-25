import { ArrowDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { FloorNav } from "@/components/sections/FloorNav";
import { Button } from "@/components/ui/button";
import { LightBand } from "@/components/ui/LightBand";
import { SectionLink } from "@/components/ui/SectionLink";
import { projectSectionId } from "@/lib/sections";
import { SECTION_IDS } from "@/lib/site";

type EntranceProps = {
  projects: ReadonlyArray<{ order: number; name: string }>;
};

// The entrance (HANDOFF § 3 · 1): the name, what César does, and the two ways on. The light
// band stays under the content and under the stone floor, as in the artboards. Its first
// paint is the page's one orchestrated moment (§ 6.3): CSS on this server markup
// (`entrance-band`, `entrance-items` in app/globals.css), so it never waits for hydration.
export function Entrance({ projects }: EntranceProps) {
  const t = useTranslations("Entrance");
  const first = projects[0];

  return (
    <section
      id={SECTION_IDS.entrance}
      className="page-section relative flex flex-col overflow-clip lg:entrance-h"
    >
      <LightBand sectionId={SECTION_IDS.entrance} className="entrance-band" />
      <div className="relative z-content container-page grid-page pt-30 lg:pt-34 lg:pb-10">
        <div className="entrance-items col-span-full lg:col-span-9">
          <h1 className="text-display text-balance">{t("name")}</h1>
          <p className="mt-10 max-w-line text-h4 text-balance">{t("line")}</p>
          <p className="mt-4 max-w-support">{t("support")}</p>
          <div className="mt-10 flex flex-wrap gap-3 lg:gap-4">
            <Button asChild>
              <SectionLink sectionId={SECTION_IDS.contact}>
                {t("contact")}
              </SectionLink>
            </Button>
            {first && (
              <Button asChild variant="secondary">
                <SectionLink sectionId={projectSectionId(first.order)}>
                  {t("projects")}
                  <ArrowDown aria-hidden="true" />
                </SectionLink>
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Below 1024 the floor is a plain strip, 120px under the buttons */}
      <div
        aria-hidden="true"
        className="relative z-content surface-stone mt-30 h-10 lg:hidden"
      />
      <div className="relative z-content lg:mt-auto">
        <FloorNav projects={projects} />
      </div>
    </section>
  );
}
