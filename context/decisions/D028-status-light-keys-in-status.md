# D028 · Status screens · Las llaves de la banda de luz del 404 y el 500 viven en lib/status.ts · Decidida

**Decision:** `statusLight(variant)` devuelve un `LightKey` (tabla § 5b) por variante con luz; `offline` no tiene. `lib/light.ts` no se toca.
**Why:** `lib/light.ts` guarda las llaves por sección de la página y otro trabajador lo editaba en la misma ola; las pantallas de estado no son secciones.
**Alternative:** añadirlas a `LIGHT_KEYS`; descartada (acopla la página con los estados).
