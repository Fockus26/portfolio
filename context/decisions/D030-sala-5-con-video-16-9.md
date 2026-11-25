# D030 · Layout · La sala 05 (World Flags) pasa a video 16:9 con las líneas de la sala 01 · Implemented

**Decision:** César pidió el video de World Flags en escritorio en lugar de teléfono (2026-11-25). La sala 05 deja la composición de ventana vertical del handoff (ventana 9 / 12, texto 1 / 8, arriba con 88px) y toma la de la sala 01: ventana 6 / 13 hasta el borde derecho, texto 1 / 6, centrada; apilada va de borde a borde. `lib/rooms.ts`, `tests/unit/rooms.test.ts` y la fila 05 de `design/HANDOFF.md` § 3 quedan con esos valores.
**Why:** con cinco proyectos en 16:9 y cuatro salas anchas, una sala vertical tenía que cambiar. César eligió «como la sala 1» entre tres composiciones ya existentes: la ventana sigue a la derecha, como estaba.
**Discarded alternative:** las líneas de la sala 07 (ventana 5 / 13, texto en cuatro columnas, el más estrecho) y las de la sala 03 (ventana a la izquierda, dos seguidas con la sala 06); o dejar el video vertical en el portafolio.
