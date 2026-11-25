import { About } from "@/components/sections/About";
import { Entrance } from "@/components/sections/Entrance";
import { ProjectRoom } from "@/components/sections/ProjectRoom";
import { VideoProvider } from "@/components/ui/VideoProvider";
import { projects } from "@/content/projects";

// The entrance, the nine rooms and "Sobre mí", in their static version. Contact arrives in
// its own unit of phase 04.
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
      <About />
    </>
  );
}
