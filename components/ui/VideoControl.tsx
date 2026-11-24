import { Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import type * as React from "react";
import { cn } from "@/lib/utils";

type VideoControlProps = Omit<
  React.ComponentProps<"button">,
  "children" | "aria-label" | "aria-pressed"
> & {
  /** true → the button pauses; false → it plays. The accessible name changes with it. */
  playing: boolean;
  /** Project name, for the accessible name ("Pausar el video de Maranatha"). */
  project: string;
  /** Solid label to the left of the button: "En pausa" or "Ver el video". */
  label?: string;
};

// The only element that sits on a video (HANDOFF § 2.9): a solid wall panel, so no text is
// ever placed on a frame. The focus ring is ink on a wall halo, visible on any frame.
export function VideoControl({
  playing,
  project,
  label,
  className,
  ...props
}: VideoControlProps) {
  const t = useTranslations("Video");
  const Icon = playing ? Pause : Play;

  return (
    <div
      className={cn(
        "absolute right-3 bottom-3 flex items-center gap-2 md:right-4 md:bottom-4",
        className,
      )}
    >
      {label && (
        <span className="inline-flex h-11 items-center rounded-sm bg-wall px-3 text-small whitespace-nowrap text-ink">
          {label}
        </span>
      )}
      <button
        type="button"
        aria-label={t(playing ? "pause" : "play", { project })}
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-sm bg-wall text-ink",
          "transition-colors duration-fast ease-out motion-reduce:transition-none",
          "hover:bg-control-hover hover:shadow-control-hover active:translate-y-px",
          "focus-visible:shadow-focus-halo",
        )}
        {...props}
      >
        <Icon
          aria-hidden="true"
          className="size-4.5"
          fill={playing ? "none" : "currentColor"}
        />
      </button>
    </div>
  );
}
