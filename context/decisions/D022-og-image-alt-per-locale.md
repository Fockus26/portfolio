# D022 · SEO · La imagen social usa `generateImageMetadata` para el alt por idioma; su URL pasa a `/<idioma>/opengraph-image/card` · Implemented

**Decision:** `app/[locale]/opengraph-image.tsx` exporta `generateImageMetadata` (id `card`, alt traducido) y `twitter-image.tsx` lo reexporta. No lleva `generateStaticParams` propio: con él la ruta daba 404 en dev; los idiomas vienen del layout.
**Why:** un `export const alt` no puede variar por idioma y la convención de archivos pisa `openGraph.images` del layout. El precio es el sufijo `/card` en la URL (la que sale en `og:image`).
**Discarded alternative:** alt único en español (mal para la versión en inglés).
