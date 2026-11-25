import { useLocale, useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { LightBand } from "@/components/ui/LightBand";
import { TextLink } from "@/components/ui/TextLink";
import { Window } from "@/components/ui/Window";
import type { Project } from "@/content/types";
import { getProjectMedia } from "@/lib/media";
import { isLongName, type RoomLayout, roomLayout, roomVars } from "@/lib/rooms";
import { formatRoomNumber, projectSectionId } from "@/lib/sections";
import { cn } from "@/lib/utils";

// The window spans the room's rows; where it sits follows the text (HANDOFF § 3)
const WINDOW_ROWS: Record<RoomLayout["align"]["at"], string> = {
  center: "lg:row-start-1 lg:row-end-6 lg:self-center",
  start: "lg:row-start-2 lg:row-end-6 lg:self-start",
  end: "lg:row-start-1 lg:row-end-5 lg:self-end",
};

// Below 1024 (HANDOFF § 3): 16:9 edge to edge, the vertical ones at a fixed width on a side
const WINDOW_STACKED: Record<RoomLayout["stacked"], string> = {
  bleed: "-mx-side",
  left: "",
  right: "ml-auto",
  center: "mx-auto",
};

const WINDOW_WIDTH: Record<Project["media"]["format"], string> = {
  desktop: "lg:window-cap-desktop",
  phone: "w-52 max-w-full md:w-70 lg:window-cap-phone",
  chat: "w-57 max-w-full md:w-70 lg:window-cap-chat",
};

// What the browser needs to pick a poster size: the slot is about this wide; at >=1024 a
// 16:9 window opens to the full width (§ 6.1)
const POSTER_SIZES: Record<Project["media"]["format"], string> = {
  desktop: "100vw",
  phone: "(min-width: 48rem) 280px, 208px",
  chat: "(min-width: 48rem) 280px, 228px",
};

type ProjectRoomProps = {
  project: Project;
  /** How many rooms there are, for the `03 / 09` number. */
  total: number;
};

// One project, one screen (HANDOFF § 2.10 and § 3). The section spans the whole viewport so
// its light band is measured against it; the room's grid sits inside, above the band. At
// >=1024 with motion allowed the section is the room's scroll track and the grid its sticky
// stage (`room-track`, `room-stage`); RoomChoreography opens the window and moves the text
// (§ 6.1, § 6.2), finding them by their data attributes. `overflow-clip` (not hidden) keeps
// sticky working.
export function ProjectRoom({ project, total }: ProjectRoomProps) {
  const t = useTranslations("Room");
  const locale = useLocale() as "es" | "en";
  const layout = roomLayout(project.order);
  const media = getProjectMedia(project);
  const id = projectSectionId(project.order);
  const titleId = `${id}-title`;
  const split = layout.detail !== undefined;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="page-section room-track relative overflow-clip"
    >
      <LightBand sectionId={id} />
      <div
        style={roomVars(layout) as CSSProperties}
        className="room-stage z-content container-page py-18 lg:grid-page lg:room-rows lg:min-h-svh lg:pt-header lg:pb-0"
      >
        <div
          data-room-text=""
          className={cn(
            "md:max-w-140 lg:col-(--room-text) lg:row-start-2 lg:max-w-none",
            layout.text.pad && "lg:pl-10",
          )}
        >
          <p className="text-small tracking-num text-graphite tabular-nums">
            {formatRoomNumber(project.order, total)}
          </p>
          <h2
            id={titleId}
            className={cn(
              "mt-2 text-balance wrap-anywhere",
              isLongName(project.name) ? "text-h2-long" : "text-h2",
            )}
          >
            {project.name}
          </h2>
          <p className="mt-3 text-h6 text-graphite">{project.kind[locale]}</p>
        </div>

        <div
          data-room-slot={project.media.format}
          className={cn(
            "mt-8 lg:col-(--room-window) lg:mx-0 lg:mt-0",
            WINDOW_ROWS[layout.align.at],
            WINDOW_STACKED[layout.stacked],
            WINDOW_WIDTH[project.media.format],
            // A window capped by the viewport height stays against its own edge
            layout.window.bleed === "right" &&
              "lg:window-bleed lg:-mr-side lg:justify-self-end",
            layout.window.bleed === "left" &&
              "lg:window-bleed lg:-ml-side lg:justify-self-start",
            !layout.window.bleed && "lg:w-full lg:justify-self-start",
          )}
        >
          <Window
            id={project.slug}
            project={project.name}
            format={project.media.format}
            poster={media.poster}
            posterSizes={POSTER_SIZES[project.media.format]}
            sources={media.sources}
            reveal={layout.window.reveal}
            flushStacked={layout.stacked === "bleed"}
          />
        </div>

        <p
          data-room-text=""
          className={cn(
            "mt-8 text-h5 text-balance md:max-w-140 lg:col-(--room-text) lg:row-start-3 lg:mt-10 lg:max-w-none",
            layout.text.pad && "lg:pl-10",
          )}
        >
          {project.sentence[locale]}
        </p>

        <div
          data-room-text=""
          className={cn(
            "mt-4 md:max-w-140 lg:col-(--room-detail) lg:max-w-none",
            split
              ? // Spans the walls too, so it centers on its own like the window
                "lg:row-start-1 lg:row-end-6 lg:mt-0 lg:self-center"
              : "lg:row-start-4",
            (layout.detail ?? layout.text).pad && "lg:pl-10",
          )}
        >
          <p className="max-w-reading">{project.summary[locale]}</p>
          <p className="mt-6 text-role">
            {t("role", { role: project.role[locale] })}
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-8">
            {project.links.map((link) => (
              <li key={link.type}>
                <TextLink href={link.url} context={project.name}>
                  {t(`links.${link.type}`)}
                </TextLink>
              </li>
            ))}
          </ul>
          <p className="mt-7 border-t border-line pt-3 font-mono text-caption text-graphite">
            {project.stack.join(" · ")}
          </p>
        </div>
      </div>
    </section>
  );
}
