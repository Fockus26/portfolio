import { useTranslations } from "next-intl";
import { SectionLink } from "@/components/ui/SectionLink";
import { pad2, projectSectionId } from "@/lib/sections";

type FloorNavProps = {
  projects: ReadonlyArray<{ order: number; name: string }>;
};

// The stone floor of the entrance (HANDOFF § 2.6): the nine projects as links to jump to.
// From 1024 only; below it the strip is plain and the index sheet does the job. The two
// rows it may wrap into at 1024 fit in its 96px, so no link is ever clipped.
export function FloorNav({ projects }: FloorNavProps) {
  const t = useTranslations("Entrance");

  return (
    <nav aria-label={t("floorLabel")} className="surface-stone hidden lg:block">
      <ul className="container-page flex min-h-24 flex-wrap content-center items-center justify-between gap-x-4">
        {projects.map((project) => (
          <li key={project.order}>
            <SectionLink
              sectionId={projectSectionId(project.order)}
              className="inline-flex min-h-11 items-center gap-2 rounded-sm text-small text-ink decoration-1 underline-offset-5 hover:underline focus-visible:outline-ink"
            >
              <span className="tracking-num text-graphite tabular-nums">
                {pad2(project.order)}
              </span>
              {project.name}
            </SectionLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
