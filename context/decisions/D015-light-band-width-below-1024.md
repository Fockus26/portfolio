# D015 · Layout · Bajo 1024 la banda de luz mide W₃₉₀ × (vw / 390), limitado a 320–1023 · Implemented

**Decision:** el ancho de la banda escala con el viewport en los dos layouts. ≥1024, como dice
el handoff § 6.4: `W₁₄₄₀ × (vw / 1440)` con vw limitado a 1024–2560. <1024, donde el handoff
solo da «W at 390»: `W₃₉₀ × (vw / 390)` con vw limitado a 320–1023. La regla vive en
`lib/light.ts` (`bandWidth`) y en `.light-band` de `app/globals.css`; una prueba comprueba que
coinciden.
**Why:** es la misma regla proporcional que el handoff da para escritorio, aplicada a la única
medida que hay para el apilado; a 768 la banda mantiene la proporción del artboard de 390 en vez
de quedarse en 150px. Lo decidió el orquestador de la tanda 2026-11-24 (falta en el handoff).
**Discarded alternative:** ancho fijo en px bajo 1024 (a 768 la banda se vería la mitad de
estrecha que en el artboard) o interpolar entre 390 y 1440 (inventa una curva que nadie dibujó).
