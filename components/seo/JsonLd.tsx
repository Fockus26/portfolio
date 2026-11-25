import { serializeJsonLd } from "@/lib/seo";

/** One `<script type="application/ld+json">`; the serializer escapes `<`. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON built by lib/seo.ts, with `<` escaped.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
