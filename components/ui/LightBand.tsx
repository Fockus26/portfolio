import type { CSSProperties } from "react";
import { bandVars, lightKey } from "@/lib/light";
import { cn } from "@/lib/utils";

type LightBandProps = {
  /** The section it sits in: its row of HANDOFF § 6.4. */
  sectionId: string;
  /** The entrance passes `entrance-band`: its band arrives on the first paint (§ 6.3). */
  className?: string;
};

// The static light band of one section (HANDOFF § 2.7, § 6.4): its row's values, clipped by
// the section. It is the server render and the reduced-motion version; while the fixed
// layer runs (LightBandLayer) it is hidden by app/globals.css, so there is never both.
export function LightBand({ sectionId, className }: LightBandProps) {
  const entry = lightKey(sectionId);
  if (!entry) return null;

  return (
    <div
      aria-hidden="true"
      data-light-band={sectionId}
      className={cn("light-band light-band-static", className)}
      style={bandVars(entry) as CSSProperties}
    />
  );
}
