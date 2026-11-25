import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Entrance } from "@/components/sections/Entrance";
import { ProjectRoom } from "@/components/sections/ProjectRoom";
import { VideoProvider } from "@/components/ui/VideoProvider";
import { projects } from "@/content/projects";

// The whole page in its static version: entrance, nine rooms, about and contact.
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
    </>
  );
}
