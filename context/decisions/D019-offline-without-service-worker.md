# D019 · Status · «Sin conexión» vive en `error.tsx` y en la galería; el sitio no tiene service worker · Implemented

**Decision:** la variante sin conexión no es una página PWA: la elige `app/[locale]/error.tsx` cuando `navigator.onLine` es falso (con los eventos `online`/`offline`) y se reintenta sola al volver la red. También se ve en `/estados?screen=offline`.
**Why:** el sitio no es una PWA ni tiene service worker (decidido por la orquestación del 2026-11-24); sin él, una página `/offline` precacheada no se serviría nunca. Un fallo de red con el sitio ya cargado sí pasa por el límite de error.
**Discarded alternative:** añadir un service worker con página de respaldo (dependencia y mantenimiento sin otro uso en el sitio).
