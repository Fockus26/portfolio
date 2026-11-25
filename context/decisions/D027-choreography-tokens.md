# D027 · Tokens · Tokens nuevos de la coreografía: `delay-entrance`, `stagger-entrance`, `entrance-band-shift`, `track-h` · Implemented

**Decision:** en `app/globals.css` (`:root`) y `DESIGN_TOKENS.md`: `--delay-entrance: 200ms`, `--stagger-entrance: 80ms`, `--entrance-band-shift: 8vw`, `--track-h: 200svh`. Los 48 / 24 / −16px de la apertura son pasos exactos del espaciado (12 / 6 / 4) y, como el 12 % del recorte apilado y los umbrales de `p` y `t`, son constantes de `lib/choreography.ts` con su referencia al handoff y su prueba (la curva y las proporciones se comparan contra el CSS).
**Why:** cero valores mágicos; lo que solo lee el driver vive con la matemática que lo usa, lo que lee el CSS es token.
**Discarded alternative:** tokens de CSS para los valores del driver, leídos con `getComputedStyle` (convertir `rem` a px en cada medida, sin ganar una fuente única).
