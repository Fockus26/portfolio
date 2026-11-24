# D013 · Layout · La sala es una rejilla de cinco filas (pared, intro, frase, detalle, pared) y sus líneas son datos en `lib/rooms.ts` · Implemented

**Decision:** un solo DOM sirve al apilado (intro → ventana → frase → detalle) y al escritorio:
las dos «paredes» son `1fr` para centrar, o un valor fijo (88 / 96 / 112px) para anclar arriba
o abajo. Columnas, sangrado, lado del reveal y alineación de las nueve salas viven en
`ROOM_LAYOUTS`, con pruebas contra la tabla del handoff § 3.
**Why:** el orden apilado mete la ventana entre `kind` y la frase; duplicar el texto o
reordenar con JavaScript rompería el orden de lectura. La sala mide `min-height: 100svh` (no
`height`) para que un texto largo o un zoom alto nunca se recorten.
**Not in the handoff (elegido lo conservador):** una ventana limitada por la altura del
viewport se queda pegada al inicio de sus columnas (al borde derecho si sangra a la derecha).
