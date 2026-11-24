"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import { MEDIA } from "@/hooks/useMediaQuery";
import {
  allowsAutoplay,
  type ConnectionInfo,
  type ControlView,
  controlFor,
  INITIAL_VIDEO_STATE,
  nearestToCenter,
  PAUSE_STORAGE_KEY,
  playingId,
  type VideoAction,
  type VideoState,
  videoReducer,
} from "@/lib/video";

type Store = {
  getState: () => VideoState;
  subscribe: (listener: () => void) => () => void;
  dispatch: (action: VideoAction) => void;
  /** A window joins the "nearest the center" race; returns how to leave it. */
  register: (id: string, element: HTMLElement) => () => void;
};

const VideoContext = createContext<Store | null>(null);

function readPaused(): boolean {
  try {
    return window.sessionStorage.getItem(PAUSE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writePaused(paused: boolean): void {
  try {
    if (paused) window.sessionStorage.setItem(PAUSE_STORAGE_KEY, "1");
    else window.sessionStorage.removeItem(PAUSE_STORAGE_KEY);
  } catch {
    // Storage blocked: the pause still holds until the page is reloaded
  }
}

function createStore(): Store & { connect: () => () => void } {
  let state = INITIAL_VIDEO_STATE;
  const listeners = new Set<() => void>();
  const elements = new Map<string, HTMLElement>();
  const onScreen = new Set<string>();
  let observer: IntersectionObserver | null = null;
  let frame = 0;

  function dispatch(action: VideoAction) {
    const next = videoReducer(state, action);
    if (next === state) return;
    if (next.paused !== state.paused) writePaused(next.paused);
    state = next;
    for (const listener of listeners) listener();
  }

  function measure() {
    frame = 0;
    const rects = [...onScreen].flatMap((id) => {
      const element = elements.get(id);
      if (!element) return [];
      const { top, bottom } = element.getBoundingClientRect();
      return [{ id, top, bottom }];
    });
    dispatch({
      type: "nearest",
      id: nearestToCenter(rects, window.innerHeight),
    });
  }

  // Reads positions at most once per frame; the listeners are passive and never touch
  // the scroll itself (D002).
  function schedule() {
    if (frame === 0) frame = requestAnimationFrame(measure);
  }

  function connect() {
    const motion = window.matchMedia(MEDIA.reducedMotion);
    const readEnvironment = () =>
      dispatch({
        type: "environment",
        autoplay: allowsAutoplay({
          reducedMotion: motion.matches,
          connection: (navigator as Navigator & { connection?: ConnectionInfo })
            .connection,
        }),
        paused: readPaused(),
      });
    readEnvironment();
    motion.addEventListener("change", readEnvironment);

    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).dataset.windowId;
        if (!id) continue;
        if (entry.isIntersecting) onScreen.add(id);
        else onScreen.delete(id);
      }
      schedule();
    });
    for (const element of elements.values()) observer.observe(element);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      motion.removeEventListener("change", readEnvironment);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer?.disconnect();
      observer = null;
      if (frame !== 0) cancelAnimationFrame(frame);
      frame = 0;
    };
  }

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    dispatch,
    register(id, element) {
      element.dataset.windowId = id;
      elements.set(id, element);
      observer?.observe(element);
      return () => {
        observer?.unobserve(element);
        elements.delete(id);
        onScreen.delete(id);
        schedule();
      };
    },
    connect,
  };
}

// One provider for the whole page: it decides which single video plays (HANDOFF § 2.8) —
// the window nearest the center of the viewport — and keeps the visitor's pause for the
// session.
export function VideoProvider({ children }: { children: ReactNode }) {
  const ref = useRef<ReturnType<typeof createStore> | null>(null);
  if (ref.current === null) ref.current = createStore();
  const store = ref.current;

  useEffect(() => store.connect(), [store]);

  return <VideoContext value={store}>{children}</VideoContext>;
}

const getServerState = () => INITIAL_VIDEO_STATE;

/** The video state of one window: whether it plays, its control, and the two actions. */
export function useWindowVideo(id: string): {
  playing: boolean;
  control: ControlView;
  play: () => void;
  pause: () => void;
  register: (element: HTMLElement) => () => void;
} {
  const store = useContext(VideoContext);
  if (!store) throw new Error("Window needs a <VideoProvider> above it");
  const state = useSyncExternalStore(
    store.subscribe,
    store.getState,
    getServerState,
  );

  return {
    playing: playingId(state) === id,
    control: controlFor(state, id),
    play: () => store.dispatch({ type: "play", id }),
    pause: () => store.dispatch({ type: "pause" }),
    register: (element) => store.register(id, element),
  };
}
