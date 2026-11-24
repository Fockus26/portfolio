/** A link that leaves the site and opens in another tab (HANDOFF § 2.2). */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
