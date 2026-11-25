import { Entrance } from "@/components/sections/Entrance";
import { ProjectRoom } from "@/components/sections/ProjectRoom";
import { VideoProvider } from "@/components/ui/VideoProvider";
import { projects } from "@/content/projects";

// The entrance and the nine rooms, in their static version. About and contact arrive in
// their own units of phase 04.
export default function Home() {
  return (
    <>
      <Entrance projects={projects} />
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
