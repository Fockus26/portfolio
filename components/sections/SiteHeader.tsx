import { getTranslations } from "next-intl/server";
import { SiteHeaderBar } from "@/components/sections/SiteHeaderBar";
import { projects } from "@/content/projects";
import { buildSections } from "@/lib/sections";

// The fixed bar (HANDOFF § 2.3): solid wall, never transparent or blurred, so no text or
// control ever overlaps a video. The project names come from content/projects; only the
// order and the name of each one travel to the browser.
export async function SiteHeader() {
  const t = await getTranslations("Sections");
  const sections = buildSections(
    projects.map(({ order, name }) => ({ order, name })),
    {
      entrance: t("entrance"),
      about: t("about"),
      contact: t("contact"),
    },
  );

  return (
    <header className="fixed inset-x-0 top-0 z-header h-header bg-wall">
      <SiteHeaderBar sections={sections} />
    </header>
  );
}
