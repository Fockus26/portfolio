# D023 · SEO · JSON-LD `Person` + `WebSite` en un solo grafo; `sameAs` solo con perfiles reales; manifest `display: browser` · Implemented

**Decision:** `lib/seo.ts` arma un `@graph` (Person con jobTitle por idioma y correo de Contacto; WebSite con inLanguage), serializado con `<` escapado. `sameAs` se omite mientras LinkedIn/GitHub sean `undefined` (D014). Manifest con `display: "browser"`: el sitio no es una PWA.
**Why:** no se inventan perfiles; un solo `<script>` por página.
**Discarded alternative:** `standalone` (promete una app instalable que no existe).
