# D020 · Content · El inglés de las pantallas de estado es una traducción directa y provisional · Implemented

**Decision:** el handoff solo trae el español de las pantallas de estado; el inglés (`messages/en.json` › `Status`) es una traducción directa en la misma voz llana, marcada provisional en `CONTENT_CHECKLIST` (filas 50–54). El español está copiado carácter por carácter de HANDOFF § 5b y § 2.12.
**Why:** HANDOFF § 9, pregunta 10: el inglés no está definido todavía; inventar un tono distinto sería una decisión de contenido de César.
**Discarded alternative:** dejar el inglés vacío o en español (rompe `tests/unit/i18n.test.ts` y deja el sitio a medias en `/en`).
