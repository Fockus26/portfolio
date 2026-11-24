/**
 * In-page anchors (HANDOFF § 6.6). After the jump the focus moves to the section's heading,
 * so the keyboard and the screen reader continue from there. The scroll itself is native:
 * `scrollIntoView` follows the `scroll-behavior` of the page (smooth only when motion is
 * allowed) and the section's `scroll-margin-top`.
 */
export function focusSectionHeading(id: string): void {
  const section = document.getElementById(id);
  if (!section) return;
  const heading =
    section.querySelector<HTMLElement>("[data-section-heading], h1, h2, h3") ??
    section;
  if (!heading.hasAttribute("tabindex")) heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
}

/** Scrolls to a section, records it in the address and moves the focus to its heading. */
export function goToSection(id: string): void {
  const section = document.getElementById(id);
  if (!section) return;
  const hash = `#${id}`;
  if (window.location.hash !== hash) window.history.pushState(null, "", hash);
  section.scrollIntoView();
  focusSectionHeading(id);
}

/** A plain left click: anything else (new tab, download) is left to the browser. */
export function isPlainClick(event: {
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}): boolean {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}
