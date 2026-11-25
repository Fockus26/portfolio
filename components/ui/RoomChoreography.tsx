"use client";

import { useLayoutEffect } from "react";
import { useHydrated } from "@/hooks/useHydrated";
import { MEDIA, useMediaQuery } from "@/hooks/useMediaQuery";
import {
  fitsViewport,
  fullRect,
  openAmount,
  type Rect,
  stackedInset,
  textOpacity,
  textShift,
  trackProgress,
  type WindowFormat,
  windowFrame,
} from "@/lib/choreography";

type Mode = "track" | "static" | "stacked";

type Room = {
  track: HTMLElement;
  stage: HTMLElement;
  slot: HTMLElement;
  figure: HTMLElement;
  screen: HTMLElement | null;
  texts: HTMLElement[];
  format: WindowFormat;
  mode: Mode;
  /** Track: its document top, its sticky travel, the window's slot `S` and full rect `F`. */
  top: number;
  travel: number;
  slotRect: Rect;
  full: Rect;
  slotHeight: number;
  /** The reveal at rest: its padding per side and its color channels. */
  pad: { top: number; left: number; right: number };
  revealColor: string;
  /** Stacked: the window's vertical center in document coordinates. */
  center: number;
  /** What is written now, so a frame only touches what changed. */
  open: boolean;
  text: number;
  clip: number;
};

const ZERO: Rect = { left: 0, top: 0, width: 0, height: 0 };

const WINDOW_STYLES = [
  "position",
  "left",
  "top",
  "width",
  "height",
  "z-index",
  "padding-top",
  "padding-left",
  "padding-right",
  "background-color",
  "border-radius",
] as const;

const px = (value: number) => `${value}px`;

function findRooms(): Room[] {
  return [...document.querySelectorAll<HTMLElement>(".room-track")].flatMap(
    (track) => {
      const stage = track.querySelector<HTMLElement>(":scope > .room-stage");
      const slot = stage?.querySelector<HTMLElement>("[data-room-slot]");
      const figure = slot?.querySelector<HTMLElement>("figure");
      if (!stage || !slot || !figure) return [];
      return [
        {
          track,
          stage,
          slot,
          figure,
          screen: figure.querySelector<HTMLElement>("[data-window-screen]"),
          texts: [...stage.querySelectorAll<HTMLElement>("[data-room-text]")],
          format: (slot.dataset.roomSlot ?? "desktop") as WindowFormat,
          mode: "static" as Mode,
          top: 0,
          travel: 0,
          slotRect: ZERO,
          full: ZERO,
          slotHeight: 0,
          pad: { top: 0, left: 0, right: 0 },
          revealColor: "0 0 0",
          center: 0,
          open: false,
          text: 1,
          clip: 0,
        },
      ];
    },
  );
}

/** The window back in its slot, in the grid's flow. */
function restWindow(room: Room) {
  for (const name of WINDOW_STYLES) room.figure.style.removeProperty(name);
  room.screen?.style.removeProperty("aspect-ratio");
  room.screen?.style.removeProperty("height");
  room.screen?.style.removeProperty("border-radius");
  room.slot.style.removeProperty("height");
  room.open = false;
}

function writeText(room: Room, opacity: number, shift: number) {
  room.text = opacity;
  const hidden = opacity === 0;
  for (const block of room.texts) {
    if (opacity === 1) {
      block.style.removeProperty("opacity");
      block.style.removeProperty("transform");
    } else {
      block.style.opacity = String(opacity);
      block.style.transform = `translateY(${px(shift)})`;
    }
    if (hidden) {
      // The focus never stays on text that is gone (HANDOFF § 6.1: hidden and inert)
      const focused = document.activeElement;
      if (focused instanceof HTMLElement && block.contains(focused))
        focused.blur();
      block.style.visibility = "hidden";
      block.inert = true;
    } else if (block.inert) {
      block.style.removeProperty("visibility");
      block.inert = false;
    }
  }
}

function writeClip(room: Room, inset: number) {
  room.clip = inset;
  if (inset === 0) room.figure.style.removeProperty("clip-path");
  else room.figure.style.clipPath = `inset(${inset * 100}%)`;
}

function channels(color: string): string {
  return (color.match(/[\d.]+/g) ?? ["0", "0", "0"]).slice(0, 3).join(" ");
}

// The scroll choreography of the rooms (HANDOFF § 6.1, § 6.2), mounted once for the page,
// only when motion is allowed. Like the light layer (D017) it reads the scroll from a
// passive listener at most once per frame and writes inline styles: no re-render, no
// wheel, touch or key listener, the scroll stays native (D002, D024). Every value comes
// from lib/choreography.ts; the track and the sticky stage are CSS (`room-track`).
export function RoomChoreography() {
  const reducedMotion = useMediaQuery(MEDIA.reducedMotion);
  const hydrated = useHydrated();
  const active = hydrated && !reducedMotion;

  useLayoutEffect(() => {
    if (!active) return;
    const rooms = findRooms();
    if (rooms.length === 0) return;
    let frame = 0;
    let stale = false;
    let disposed = false;

    function measure() {
      stale = false;
      const lg = window.matchMedia(MEDIA.lg).matches;
      const viewport = window.innerHeight;

      // 1 · Every window back in its slot, so the grid is read as it is at rest
      for (const room of rooms) {
        restWindow(room);
        writeClip(room, 0);
      }

      // 2 · A room taller than one viewport keeps no track (D025)
      const fits = rooms.map(
        (room) =>
          lg &&
          fitsViewport(room.stage.getBoundingClientRect().height, viewport),
      );
      rooms.forEach((room, index) => {
        const mode: Mode = !lg ? "stacked" : fits[index] ? "track" : "static";
        if (mode !== "track") writeText(room, 1, 0);
        room.mode = mode;
        room.track.toggleAttribute("data-room-static", mode === "static");
      });

      // 3 · The geometry, once the tracks have their final height
      const y = window.scrollY;
      for (const room of rooms) {
        const figureBox = room.figure.getBoundingClientRect();
        if (room.mode === "stacked") {
          room.center = figureBox.top + y + figureBox.height / 2;
          continue;
        }
        if (room.mode !== "track") continue;
        const trackBox = room.track.getBoundingClientRect();
        const stageBox = room.stage.getBoundingClientRect();
        const figureStyle = getComputedStyle(room.figure);
        room.top = trackBox.top + y;
        room.travel = trackBox.height - stageBox.height;
        room.slotRect = {
          left: figureBox.left - stageBox.left,
          top: figureBox.top - stageBox.top,
          width: figureBox.width,
          height: figureBox.height,
        };
        room.slotHeight = room.slot.getBoundingClientRect().height;
        room.pad = {
          top: Number.parseFloat(figureStyle.paddingTop),
          left: Number.parseFloat(figureStyle.paddingLeft),
          right: Number.parseFloat(figureStyle.paddingRight),
        };
        room.revealColor = channels(figureStyle.backgroundColor);
        room.full = fullRect({
          format: room.format,
          // Against the section, not 100vw: the page has a scrollbar and the container a cap
          width: room.track.clientWidth,
          left: trackBox.left + room.track.clientLeft - stageBox.left,
          viewport,
          // The stage reserves the header as its top padding (`lg:pt-header`)
          header: Number.parseFloat(getComputedStyle(room.stage).paddingTop),
        });
      }
    }

    function writeTrack(room: Room, y: number) {
      const p = trackProgress(y, room.top, room.travel);
      const t = openAmount(p);
      if (t > 0) {
        const { rect, reveal, radius } = windowFrame(
          room.slotRect,
          room.full,
          t,
          room.format,
        );
        const style = room.figure.style;
        // The slot keeps its size in the grid, so the text never reflows
        room.slot.style.height = px(room.slotHeight);
        style.position = "absolute";
        style.left = px(rect.left);
        style.top = px(rect.top);
        style.width = px(rect.width);
        style.height = px(rect.height);
        style.zIndex = "var(--z-window-open)";
        style.paddingTop = px(room.pad.top * reveal);
        style.paddingLeft = px(room.pad.left * reveal);
        style.paddingRight = px(room.pad.right * reveal);
        style.backgroundColor = `rgb(${room.revealColor} / ${reveal})`;
        style.borderRadius = px(radius);
        if (room.screen) {
          // The screen fills the opened window; the poster and the video keep `cover`
          room.screen.style.aspectRatio = "auto";
          room.screen.style.height = "100%";
          room.screen.style.borderRadius = px(radius);
        }
        room.open = true;
      } else if (room.open) {
        restWindow(room);
      }
      const opacity = textOpacity(p);
      if (opacity !== room.text) writeText(room, opacity, textShift(p));
    }

    function update() {
      frame = 0;
      if (stale) measure();
      const y = window.scrollY;
      const viewport = window.innerHeight;
      for (const room of rooms) {
        if (room.mode === "track") writeTrack(room, y);
        else if (room.mode === "stacked") {
          const inset = stackedInset(room.center - y, viewport);
          if (inset !== room.clip) writeClip(room, inset);
        }
      }
    }

    function schedule() {
      if (frame === 0 && !disposed) frame = requestAnimationFrame(update);
    }

    // A size change is read on the next frame, never inside the observer: opting a room
    // out changes the tracks it observes
    function remeasure() {
      stale = true;
      schedule();
    }

    measure();
    update();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });
    const resize = new ResizeObserver(remeasure);
    for (const room of rooms) {
      resize.observe(room.track);
      resize.observe(room.stage);
    }
    document.fonts?.ready.then(remeasure);

    return () => {
      disposed = true;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      resize.disconnect();
      if (frame !== 0) cancelAnimationFrame(frame);
      for (const room of rooms) {
        restWindow(room);
        writeClip(room, 0);
        writeText(room, 1, 0);
        room.track.removeAttribute("data-room-static");
      }
    };
  }, [active]);

  return null;
}
