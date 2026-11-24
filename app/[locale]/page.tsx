import { Entrance } from "@/components/sections/Entrance";
import { projects } from "@/content/projects";

// Provisional: the rooms, about and contact arrive in their own units of phase 04.
export default function Home() {
  return <Entrance projects={projects} />;
}
