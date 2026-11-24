import { getTranslations } from "next-intl/server";
import { ProjectRoom } from "@/components/sections/ProjectRoom";
import { VideoProvider } from "@/components/ui/VideoProvider";
import { projects } from "@/content/projects";
import { SECTION_IDS } from "@/lib/site";

// The entrance is still provisional (phase 02's container and grid on screen); the nine
// rooms are the static version of phase 04. About and contact arrive next.
export default async function Home() {
  const t = await getTranslations("Entrance");

  return (
    <>
      <section
        id={SECTION_IDS.entrance}
        className="page-section container-page grid-page pt-header"
      >
        <div className="col-span-full flex flex-col gap-10 py-24 lg:col-span-9">
          <h1 className="text-display text-balance">{t("name")}</h1>
          <p className="text-h4 text-balance">{t("line")}</p>
        </div>
      </section>
      <VideoProvider>
        {projects.map((project) => (
          <ProjectRoom
            key={project.slug}
            project={project}
            total={projects.length}
          />
        ))}
      </VideoProvider>
    </>
  );
}
