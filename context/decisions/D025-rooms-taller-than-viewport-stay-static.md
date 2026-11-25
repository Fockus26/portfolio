# D025 · Layout · Una sala cuyo contenido no cabe en un viewport no tiene pista ni apertura · Implemented

**Decision:** el driver compara el alto del escenario (`min-height: 100svh`, alto automático) con el viewport; si es mayor marca la sección con `data-room-static` y el CSS le quita la pista y el sticky: se comporta como con movimiento reducido. La pista es lo predeterminado en CSS, así que en el caso normal no hay salto al hidratar.
**Why:** D013 hizo la sala `min-height` para que un texto largo o un viewport bajo nunca recorten; un escenario de exactamente un viewport lo recortaría. Medido: a 1024×768 las salas 03 y 08 quedan estáticas; a 1280×600 todas menos la 09.
**Discarded alternative:** escenario de un viewport con el contenido recortado, o reducir el texto: rompen D013 y el zoom.
