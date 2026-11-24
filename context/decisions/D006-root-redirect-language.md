# D006 · Content · `/` redirige al idioma del navegador y cae en `/es` si no es español ni inglés · Implemented

**Decision:** `proxy.ts` usa la detección de idioma de `next-intl` (cabecera
`Accept-Language`): `/` lleva a `/en` a quien navega en inglés y a `/es` al resto. Las dos
rutas llevan siempre su prefijo; el idioma se lee del segmento raíz `app/[locale]` con
`next/root-params`, sin cookies. El `hreflang` va en el HTML (`alternates.languages`, con
`x-default` → `/`), en la cabecera `link` y en el sitemap.
**Why:** D001 pide español por defecto y que los reclutadores de fuera lleguen a la versión
en inglés; la detección cumple las dos cosas sin que nadie tenga que buscar el selector.
Es el comportamiento por defecto de la librería.
**Discarded alternative:** redirigir siempre a `/es` (un reclutador que navega en inglés ve
primero el español) y servir el español en `/` sin prefijo (D001 fija `/es`).
