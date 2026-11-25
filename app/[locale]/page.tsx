import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Entrance } from "@/components/sections/Entrance";
import { ProjectRoom } from "@/components/sections/ProjectRoom";
import { LightBandLayer } from "@/components/ui/LightBandLayer";
import { VideoProvider } from "@/components/ui/VideoProvider";
import { projects } from "@/content/projects";

// The whole page: entrance, nine rooms, about and contact. Each section brings its static
// light band; with motion allowed the fixed layer takes over. It goes last so that it is
// drawn over the sections' backgrounds and under their content (HANDOFF § 6.4).
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
      <Contact />
      <LightBandLayer />
    </>
  );
}
