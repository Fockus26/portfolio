// The rules of the project videos (HANDOFF § 2.8), without React or the DOM so they can be
// tested: who may autoplay, which single video plays, and what its control shows.

/** `navigator.connection`, where the browser has it. */
export type ConnectionInfo = { saveData?: boolean; effectiveType?: string };

/** sessionStorage key of the visitor's pause: it lasts for the tab's session. */
export const PAUSE_STORAGE_KEY = "video-paused";

const SLOW_CONNECTIONS = new Set(["slow-2g", "2g"]);

/**
 * Videos start on their own only with motion allowed and a connection that is neither
 * data-saving nor 2g. Otherwise the page shows posters and each video waits for its button.
 */
export function allowsAutoplay(env: {
  reducedMotion: boolean;
  connection?: ConnectionInfo;
}): boolean {
  if (env.reducedMotion) return false;
  if (env.connection?.saveData) return false;
  if (SLOW_CONNECTIONS.has(env.connection?.effectiveType ?? "")) return false;
  return true;
}

export type VideoState = {
  /** false → poster only: nothing loads until the visitor asks for one video. */
  autoplay: boolean;
  /** The visitor paused: no video starts again until they press play. */
  paused: boolean;
  /** The window nearest the center of the viewport, if any is on screen. */
  nearest: string | null;
  /** Poster-only mode: the one video the visitor asked for. */
  requested: string | null;
};

export type VideoAction =
  | { type: "environment"; autoplay: boolean; paused: boolean }
  | { type: "nearest"; id: string | null }
  | { type: "pause" }
  | { type: "play"; id: string };

/** Before the browser is known (server render): nothing plays. */
export const INITIAL_VIDEO_STATE: VideoState = {
  autoplay: false,
  paused: false,
  nearest: null,
  requested: null,
};

export function videoReducer(
  state: VideoState,
  action: VideoAction,
): VideoState {
  switch (action.type) {
    case "environment":
      return {
        ...state,
        autoplay: action.autoplay,
        paused: action.paused,
        // Leaving poster-only mode forgets the request; entering it starts with none
        requested: null,
      };
    case "nearest":
      if (action.id === state.nearest) return state;
      return {
        ...state,
        nearest: action.id,
        // The requested video stops once another room takes the center
        requested: state.requested === action.id ? state.requested : null,
      };
    case "pause":
      return { ...state, paused: true, requested: null };
    case "play":
      return {
        ...state,
        paused: false,
        nearest: action.id,
        requested: state.autoplay ? null : action.id,
      };
  }
}

/** The single video that plays right now, or null. */
export function playingId(state: VideoState): string | null {
  if (state.paused) return null;
  return state.autoplay ? state.nearest : state.requested;
}

export type ControlView =
  | { action: "pause" }
  | { action: "play"; label: "paused" | "watch" | null };

/** What the control of one window shows. The label is a key of messages › Video. */
export function controlFor(state: VideoState, id: string): ControlView {
  if (playingId(state) === id) return { action: "pause" };
  if (state.paused) return { action: "play", label: "paused" };
  if (!state.autoplay) return { action: "play", label: "watch" };
  return { action: "play", label: null };
}

/** Of the windows on screen, the one whose center is nearest the viewport's center. */
export function nearestToCenter(
  windows: ReadonlyArray<{ id: string; top: number; bottom: number }>,
  viewportHeight: number,
): string | null {
  const center = viewportHeight / 2;
  let best: { id: string; distance: number } | null = null;
  for (const item of windows) {
    if (item.bottom <= 0 || item.top >= viewportHeight) continue;
    const distance = Math.abs((item.top + item.bottom) / 2 - center);
    if (!best || distance < best.distance) best = { id: item.id, distance };
  }
  return best?.id ?? null;
}

export type VideoSource = {
  src: string;
  type: "video/webm" | "video/mp4";
  /** Media query of a `<source>`: the mobile file is served below 1024px. */
  media?: string;
};

export type ProjectMedia = {
  /** Poster path, or undefined while the real first frame does not exist. */
  poster?: string;
  /** Empty while the video is not recorded: the window then shows only its poster. */
  sources: VideoSource[];
};

/** Below the desktop layout (HANDOFF § 5: "Mobile file is served below 1024"). */
export const MOBILE_VIDEO_MEDIA = "(max-width: 63.9375rem)";

/**
 * The files of a project that really exist (HANDOFF § 5). `video` is a path without
 * extension: `<video>.webm`, `<video>.mp4` and their `-mobile` versions. Missing content
 * is left out, so a window never requests a file that is not there.
 */
export function resolveProjectMedia(
  media: { video: string; poster: string },
  exists: (publicPath: string) => boolean,
): ProjectMedia {
  const candidates: VideoSource[] = [
    {
      src: `${media.video}-mobile.webm`,
      type: "video/webm",
      media: MOBILE_VIDEO_MEDIA,
    },
    {
      src: `${media.video}-mobile.mp4`,
      type: "video/mp4",
      media: MOBILE_VIDEO_MEDIA,
    },
    { src: `${media.video}.webm`, type: "video/webm" },
    { src: `${media.video}.mp4`, type: "video/mp4" },
  ];
  return {
    poster: exists(media.poster) ? media.poster : undefined,
    sources: candidates.filter((source) => exists(source.src)),
  };
}
