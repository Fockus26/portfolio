# D021 · SEO · Los iconos salen de `scripts/gen-brand-assets.ts` con «CL» en trazos; favicon 16/32 sin banda · Implemented

**Decision:** una sola fuente (la receta del handoff § 5) genera `app/icon.svg`, `favicon.ico`, `apple-icon.png`, `icon-192/512` y el maskable. Las letras se convierten a trazos con `opentype.js` desde el `.woff` de `@fontsource/schibsted-grotesk` (600). Favicon: 16 px con altura de mayúscula 60 % y tracking -0.04em; 32 px con 50 % (el handoff no lo fija); 48 px con banda.
**Why:** regenerable, sin referencias a fuentes; cierra la fila #7 de CONTENT_CHECKLIST (icono provisional).
**Discarded alternative:** Playwright como el script del kit (más lento y sin trazos reales).
