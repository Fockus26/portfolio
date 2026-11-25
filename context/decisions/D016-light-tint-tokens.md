# D016 · Colors · Los doce tintes de la banda son tokens: se añaden light-p01…p04 y light-p06…p09 · Implemented

**Decision:** la tabla del handoff § 6.4 tiene doce tintes y el tema tenía cuatro (`light-1`
Entrada, `light-2` 05, `light-3` Sobre mí, `light-stone` Contacto). Se añaden los ocho que
faltaban como `--color-light-pNN` (por el id de su sala) en `app/globals.css` y `COLORS.md`;
los cuatro originales no cambian de nombre. `lib/light.ts` solo nombra el token de cada fila:
el hex vive en el CSS y la capa fija lo lee del navegador.
**Why:** cero valores mágicos; renombrar los cuatro existentes rompía `lib/tokens.ts` y la página
`/tokens`, que no son de esta unidad. ink ≥ 14.32, graphite ≥ 5.70 y moss ≥ 7.91 sobre todos
(prueba en `tests/unit/light.test.ts`).
**Discarded alternative:** escribir los hex en `lib/light.ts` (duplica el tema) o renombrar los
doce a un esquema uniforme (toca archivos de otras unidades).
