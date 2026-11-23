# D001 · Content · Dos idiomas con next-intl y rutas /es y /en · Pending

**Decision:** el sitio va en español (por defecto) e inglés, con `next-intl`, rutas `/es` y
`/en`, `hreflang` y un selector visible. Los textos viven en `messages/{es,en}.json` y en
`content/projects/<slug>.ts`.
**Why:** César busca clientes locales y reclutadores de fuera (entrevista, 2026-11-23). El
kit no trae patrón de i18n; rutas por idioma son indexables y enlazables, a diferencia de
un cambio solo en cliente.
**Discarded alternative:** solo español (limita reclutadores) y un toggle en cliente sin
rutas (sin SEO por idioma).
