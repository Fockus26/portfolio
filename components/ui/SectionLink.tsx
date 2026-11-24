"use client";

import type * as React from "react";
import { focusSectionHeading, isPlainClick } from "@/lib/anchors";

type SectionLinkProps = Omit<React.ComponentProps<"a">, "href"> & {
  /** Id of the section to jump to (`lib/site.ts`, `projectSectionId`). */
  sectionId: string;
};

// An in-page anchor (HANDOFF § 6.6). The jump is the browser's own (`href="#id"`, smooth
// only when motion is allowed); afterwards the focus moves to the section's heading.
export function SectionLink({
  sectionId,
  onClick,
  ...props
}: SectionLinkProps) {
  return (
    <a
      href={`#${sectionId}`}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || !isPlainClick(event)) return;
        // After the browser has started its own jump
        requestAnimationFrame(() => focusSectionHeading(sectionId));
      }}
      {...props}
    />
  );
}
