// Structured data (schema.org) of the portfolio. Pure functions: the layout passes the
// translated strings and the contact data, the tests check the shape.

import type { ContactInfo } from "@/content/contact";

export const PERSON_NAME = "César León";

type JsonLdInput = {
  locale: string;
  siteUrl: string;
  siteName: string;
  description: string;
  jobTitle: string;
  contact: ContactInfo;
};

/** Profiles that exist. A pending one (`undefined`, D014) never reaches `sameAs`. */
export function sameAsUrls(contact: ContactInfo): string[] {
  return [contact.linkedin, contact.github].filter(
    (url): url is string => typeof url === "string" && url.length > 0,
  );
}

export function personJsonLd(input: JsonLdInput) {
  const { locale, siteUrl, jobTitle, contact } = input;
  const sameAs = sameAsUrls(contact);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: PERSON_NAME,
    jobTitle,
    url: `${siteUrl}/${locale}`,
    email: `mailto:${contact.email}`,
    inLanguage: locale,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function websiteJsonLd(input: JsonLdInput) {
  const { locale, siteUrl, siteName, description } = input;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteName,
    description,
    url: `${siteUrl}/${locale}`,
    inLanguage: locale,
    author: { "@id": `${siteUrl}/#person` },
  };
}

/** The two objects as one graph, so the page carries a single `<script>`. */
export function siteJsonLd(input: JsonLdInput) {
  const { "@context": context, ...person } = personJsonLd(input);
  const { "@context": _, ...website } = websiteJsonLd(input);
  return { "@context": context, "@graph": [person, website] };
}

/** JSON for a `<script type="application/ld+json">`: `<` is escaped so the data can never close the tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
