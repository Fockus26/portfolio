"use client";

import { TriangleAlert } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { VideoControl } from "@/components/ui/VideoControl";
import { useWindowVideo } from "@/components/ui/VideoProvider";
import { cn } from "@/lib/utils";
import type { VideoSource } from "@/lib/video";

const RATIO = {
  desktop: "aspect-video",
  phone: "aspect-phone",
  chat: "aspect-chat",
} as const;

type WindowProps = {
  /** Unique on the page (the project slug): the provider plays one id at a time. */
  id: string;
  /** Project name, for the control's accessible name. */
  project: string;
  /** desktop 16:9 · phone 9:19.5 · chat 9:16 (content/types.ts › media.format). */
  format: keyof typeof RATIO;
  /** Poster path. Without it the screen shows the provisional placeholder. */
  poster?: string;
  /** `sizes` of the poster image, from the slot the room gives the window. */
  posterSizes?: string;
  /** From `getProjectMedia`. Empty → there is no video yet: poster only, no control. */
  sources?: readonly VideoSource[];
  /**
   * Side of the 8px reveal next to the screen (it always has the top one): the side that
   * faces the center of the page. `left` by default; `right` when the window bleeds left.
   */
  reveal?: "left" | "right";
  /** 16:9 windows on the stacked layout: below 1024 no reveal and no radius (full-bleed). */
  flushStacked?: boolean;
  className?: string;
};

type Phase = "poster" | "loading" | "playing" | "failed";

// The window of a project (HANDOFF § 2.8): a decorative, muted, looping video over its
// poster, inside the 8px reveal of the wall. It is not interactive itself; the only thing
// ever placed on the video is a solid panel (the control or the failure notice).
export function Window({
  id,
  project,
  format,
  poster,
  posterSizes = "100vw",
  sources = [],
  reveal = "left",
  flushStacked = false,
  className,
}: WindowProps) {
  const t = useTranslations("Video");
  const { playing, control, play, pause, register } = useWindowVideo(id);
  const figure = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  // The <source> tags are only written once this window has been asked to play, so a
  // poster-only visit (reduced motion, data saver, 2g) never fetches a video.
  const [activated, setActivated] = useState(false);
  const [phase, setPhase] = useState<Phase>("poster");
  const hasVideo = sources.length > 0;

  // biome-ignore lint/correctness/useExhaustiveDependencies: `register` is stable per id
  useEffect(() => {
    if (!hasVideo || !figure.current) return;
    return register(figure.current);
  }, [hasVideo, id]);

  useEffect(() => {
    const element = video.current;
    if (!hasVideo) return;
    if (!playing) {
      // Any other window took over, or the visitor paused: back to the poster
      element?.pause();
      if (element && element.readyState > 0) element.currentTime = 0;
      setPhase((current) => (current === "failed" ? current : "poster"));
      return;
    }
    if (!activated) {
      setActivated(true);
      return;
    }
    if (!element) return;
    setPhase((current) => (current === "failed" ? current : "loading"));
    element.play().catch((error: unknown) => {
      const name = error instanceof DOMException ? error.name : "";
      // AbortError: a pause arrived first. NotAllowedError: the browser refused autoplay.
      if (name === "AbortError") return;
      setPhase(name === "NotAllowedError" ? "poster" : "failed");
    });
  }, [playing, activated, hasVideo]);

  function retry() {
    const element = video.current;
    if (!element) return;
    setPhase("loading");
    element.load();
    if (playing) {
      element.play().catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setPhase("failed");
      });
    } else {
      play();
    }
  }

  // `playing` also covers a video that was already buffered and fires no new `canplay`
  const onReady = () =>
    setPhase((current) => (current === "loading" ? "playing" : current));

  const showVideo = phase === "playing";

  return (
    <figure
      ref={figure}
      aria-busy={phase === "loading" || undefined}
      data-phase={phase}
      className={cn(
        "relative rounded-sm bg-reveal pt-2",
        reveal === "left" ? "pl-2" : "pr-2",
        flushStacked && "max-lg:rounded-none max-lg:bg-transparent max-lg:p-0",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-sm bg-stone",
          RATIO[format],
          flushStacked && "max-lg:rounded-none",
        )}
      >
        {poster ? (
          <Image
            src={poster}
            alt=""
            fill
            sizes={posterSizes}
            className="object-cover object-top"
          />
        ) : (
          process.env.NODE_ENV !== "production" && (
            // Design-time flag (HANDOFF § 8): never shipped, tracked in CONTENT_CHECKLIST #22
            <span className="absolute top-3 left-3 rounded-sm bg-tag-bg px-2 py-0.5 text-tag text-tag-fg">
              {t("posterTag")}
            </span>
          )
        )}

        {hasVideo && (
          <video
            ref={video}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            onCanPlay={onReady}
            onPlaying={onReady}
            className={cn(
              "absolute inset-0 size-full object-cover object-top opacity-0 transition-opacity duration-base ease-out motion-reduce:transition-none",
              showVideo && "opacity-100",
            )}
          >
            {activated &&
              sources.map((source, index) => (
                <source
                  key={source.src}
                  src={source.src}
                  type={source.type}
                  media={source.media}
                  // The browser tries the sources in order: only the last failure means
                  // that none could be played
                  onError={
                    index === sources.length - 1
                      ? () => setPhase("failed")
                      : undefined
                  }
                />
              ))}
          </video>
        )}

        {phase === "loading" && (
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-0.5 origin-left animate-loading-line bg-brass motion-reduce:scale-x-38 motion-reduce:animate-none"
          />
        )}

        {phase === "failed" && (
          <div className="absolute inset-x-3 bottom-3 flex md:inset-x-4 md:bottom-4">
            <p className="flex min-h-11 flex-wrap items-center gap-x-3 rounded-sm bg-wall py-1 pr-1 pl-3 text-small text-ink">
              <TriangleAlert
                aria-hidden="true"
                className="size-4.5 shrink-0 text-error"
              />
              {t("failed")}
              <Button variant="secondary" size="xs" onClick={retry}>
                {t("retry")}
              </Button>
            </p>
          </div>
        )}

        {hasVideo && (phase === "poster" || phase === "playing") && (
          <VideoControl
            playing={control.action === "pause"}
            project={project}
            label={
              control.action === "play" && control.label
                ? t(control.label)
                : undefined
            }
            onClick={control.action === "pause" ? pause : play}
          />
        )}
      </div>
    </figure>
  );
}
