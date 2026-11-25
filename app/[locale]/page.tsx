import { Contact } from "@/components/sections/Contact";
import { Entrance } from "@/components/sections/Entrance";
import { ProjectRoom } from "@/components/sections/ProjectRoom";
import { VideoProvider } from "@/components/ui/VideoProvider";
import { projects } from "@/content/projects";

// The entrance, the nine rooms and contact, in their static version.
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
      <Contact />
    </>
  );
}
