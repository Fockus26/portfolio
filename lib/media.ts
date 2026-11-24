import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Project } from "@/content/types";
import { type ProjectMedia, resolveProjectMedia } from "@/lib/video";

/**
 * Server only: the poster and video files of a project that exist under `public/`. Until
 * César records a video (CONTENT_CHECKLIST #3, #4, #13, #25) its window gets no sources and
 * shows the provisional poster, instead of a request that fails.
 */
export function getProjectMedia(project: Pick<Project, "media">): ProjectMedia {
  return resolveProjectMedia(project.media, (publicPath) =>
    existsSync(join(process.cwd(), "public", publicPath)),
  );
}
