/** A link that leaves the site and opens in another tab (HANDOFF § 2.2). */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/**
 * The WhatsApp chat link of a number in international format (HANDOFF § 9, question 1).
 * Spaces, dashes and the `+` are dropped; a number without digits gives no link.
 */
export function whatsappHref(
  number: string,
  text?: string,
): string | undefined {
  const digits = number.replace(/\D/g, "");
  if (digits.length === 0) return undefined;
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
