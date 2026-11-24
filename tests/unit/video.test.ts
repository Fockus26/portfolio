import { expect, test } from "bun:test";
import { projects } from "@/content/projects";
import {
  allowsAutoplay,
  controlFor,
  INITIAL_VIDEO_STATE,
  MOBILE_VIDEO_MEDIA,
  nearestToCenter,
  playingId,
  resolveProjectMedia,
  type VideoAction,
  type VideoState,
  videoReducer,
} from "@/lib/video";

const run = (actions: VideoAction[], from: VideoState = INITIAL_VIDEO_STATE) =>
  actions.reduce(videoReducer, from);

const AUTO: VideoAction = {
  type: "environment",
  autoplay: true,
  paused: false,
};
const POSTER_ONLY: VideoAction = {
  type: "environment",
  autoplay: false,
  paused: false,
};

test("videos autoplay only with motion allowed and a normal connection", () => {
  expect(allowsAutoplay({ reducedMotion: false })).toBe(true);
  expect(allowsAutoplay({ reducedMotion: false, connection: {} })).toBe(true);
  expect(
    allowsAutoplay({
      reducedMotion: false,
      connection: { effectiveType: "4g" },
    }),
  ).toBe(true);
  expect(allowsAutoplay({ reducedMotion: true })).toBe(false);
  expect(
    allowsAutoplay({ reducedMotion: false, connection: { saveData: true } }),
  ).toBe(false);
  for (const effectiveType of ["2g", "slow-2g"]) {
    expect(
      allowsAutoplay({ reducedMotion: false, connection: { effectiveType } }),
    ).toBe(false);
  }
  expect(
    allowsAutoplay({
      reducedMotion: false,
      connection: { effectiveType: "3g" },
    }),
  ).toBe(true);
});

test("before the browser is known nothing plays", () => {
  expect(playingId(INITIAL_VIDEO_STATE)).toBeNull();
  expect(
    playingId(run([{ type: "nearest", id: "a" }], INITIAL_VIDEO_STATE)),
  ).toBeNull();
});

test("only the window nearest the center plays, one at a time", () => {
  let state = run([AUTO, { type: "nearest", id: "a" }]);
  expect(playingId(state)).toBe("a");
  expect(controlFor(state, "a")).toEqual({ action: "pause" });
  expect(controlFor(state, "b")).toEqual({ action: "play", label: null });

  state = run([{ type: "nearest", id: "b" }], state);
  expect(playingId(state)).toBe("b");
  expect(controlFor(state, "a")).toEqual({ action: "play", label: null });

  state = run([{ type: "nearest", id: null }], state);
  expect(playingId(state)).toBeNull();
});

test("the visitor's pause is global and survives changing rooms", () => {
  let state = run([AUTO, { type: "nearest", id: "a" }, { type: "pause" }]);
  expect(state.paused).toBe(true);
  expect(playingId(state)).toBeNull();
  expect(controlFor(state, "a")).toEqual({ action: "play", label: "paused" });

  state = run([{ type: "nearest", id: "b" }], state);
  expect(playingId(state)).toBeNull();
  expect(controlFor(state, "b")).toEqual({ action: "play", label: "paused" });

  state = run([{ type: "play", id: "b" }], state);
  expect(state.paused).toBe(false);
  expect(playingId(state)).toBe("b");

  // and from then on the videos follow the scroll again
  state = run([{ type: "nearest", id: "c" }], state);
  expect(playingId(state)).toBe("c");
});

test("a pause restored from the session keeps every video stopped", () => {
  const state = run([
    { type: "environment", autoplay: true, paused: true },
    { type: "nearest", id: "a" },
  ]);
  expect(playingId(state)).toBeNull();
  expect(controlFor(state, "a")).toEqual({ action: "play", label: "paused" });
});

test("poster-only mode plays just the video the visitor asks for", () => {
  let state = run([POSTER_ONLY, { type: "nearest", id: "a" }]);
  expect(playingId(state)).toBeNull();
  expect(controlFor(state, "a")).toEqual({ action: "play", label: "watch" });

  state = run([{ type: "play", id: "a" }], state);
  expect(playingId(state)).toBe("a");
  expect(controlFor(state, "a")).toEqual({ action: "pause" });
  expect(controlFor(state, "b")).toEqual({ action: "play", label: "watch" });

  // another room takes the center: the requested video stops and nothing else starts
  state = run([{ type: "nearest", id: "b" }], state);
  expect(playingId(state)).toBeNull();
  expect(controlFor(state, "b")).toEqual({ action: "play", label: "watch" });
});

test("pausing in poster-only mode forgets the request", () => {
  const state = run([
    POSTER_ONLY,
    { type: "play", id: "a" },
    { type: "pause" },
  ]);
  expect(playingId(state)).toBeNull();
  expect(state.requested).toBeNull();
  expect(controlFor(state, "a")).toEqual({ action: "play", label: "paused" });
});

test("turning reduced motion on while a video plays goes back to posters", () => {
  const state = run([AUTO, { type: "nearest", id: "a" }, POSTER_ONLY]);
  expect(playingId(state)).toBeNull();
  expect(controlFor(state, "a")).toEqual({ action: "play", label: "watch" });
});

test("the same nearest window does not produce a new state", () => {
  const state = run([AUTO, { type: "nearest", id: "a" }]);
  expect(videoReducer(state, { type: "nearest", id: "a" })).toBe(state);
});

test("the nearest window is the one closest to the viewport's center", () => {
  const vh = 800;
  expect(nearestToCenter([], vh)).toBeNull();
  expect(nearestToCenter([{ id: "a", top: 100, bottom: 500 }], vh)).toBe("a");
  expect(
    nearestToCenter(
      [
        { id: "a", top: -500, bottom: 100 },
        { id: "b", top: 200, bottom: 700 },
        { id: "c", top: 750, bottom: 1300 },
      ],
      vh,
    ),
  ).toBe("b");
  // off screen above and below: nobody
  expect(
    nearestToCenter(
      [
        { id: "a", top: -900, bottom: -10 },
        { id: "c", top: 800, bottom: 1300 },
      ],
      vh,
    ),
  ).toBeNull();
});

test("a project without files gets no poster and no sources", () => {
  for (const project of projects) {
    expect(resolveProjectMedia(project.media, () => false)).toEqual({
      poster: undefined,
      sources: [],
    });
  }
});

test("existing files come out in the order the browser must try them", () => {
  const media = { video: "/work/demo/loop", poster: "/work/demo/poster.jpg" };
  const all = resolveProjectMedia(media, () => true);
  expect(all.poster).toBe("/work/demo/poster.jpg");
  expect(all.sources).toEqual([
    {
      src: "/work/demo/loop-mobile.webm",
      type: "video/webm",
      media: MOBILE_VIDEO_MEDIA,
    },
    {
      src: "/work/demo/loop-mobile.mp4",
      type: "video/mp4",
      media: MOBILE_VIDEO_MEDIA,
    },
    { src: "/work/demo/loop.webm", type: "video/webm" },
    { src: "/work/demo/loop.mp4", type: "video/mp4" },
  ]);

  const onlyMp4 = resolveProjectMedia(media, (path) => path.endsWith("p.mp4"));
  expect(onlyMp4.poster).toBeUndefined();
  expect(onlyMp4.sources).toEqual([
    { src: "/work/demo/loop.mp4", type: "video/mp4" },
  ]);
});
