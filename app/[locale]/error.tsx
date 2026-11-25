"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { StatusScreenView } from "@/components/sections/StatusScreenView";
import { digestOf, pickErrorVariant } from "@/lib/status";

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

// The 500 and offline screens (HANDOFF § 5b): one boundary that picks by the network, and
// by the error's digest whether there is a code to send. It never shows the message.
export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  // On the server the connection is assumed
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
  const [retrying, setRetrying] = useState(false);
  const variant = pickErrorVariant({ online, digest: digestOf(error) });

  // A new error means the last retry ended
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset when the error changes
  useEffect(() => setRetrying(false), [error]);

  function onRetry() {
    setRetrying(true);
    retry();
  }

  // The connection came back: try once, on its own
  const wasOffline = variant === "offline";
  // biome-ignore lint/correctness/useExhaustiveDependencies: only the offline → online change matters
  useEffect(() => {
    if (!wasOffline) return;
    const again = () => {
      setRetrying(true);
      retry();
    };
    window.addEventListener("online", again, { once: true });
    return () => window.removeEventListener("online", again);
  }, [wasOffline]);

  return (
    <StatusScreenView
      variant={variant}
      code={digestOf(error)}
      onRetry={onRetry}
      retrying={retrying}
      focusTitle
    />
  );
}
