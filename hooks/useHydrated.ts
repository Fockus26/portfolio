"use client";

import { useSyncExternalStore } from "react";

const subscribeNever = () => () => {};

/** `true` once the page has hydrated; `false` on the server and while hydrating. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}
