# D002 · Layout · Animación con Motion y scroll nativo con snap de proximidad · Pending

**Decision:** un proyecto por pantalla con `scroll-snap` de proximidad; las coreografías
(apertura del ventanal, entrada del texto, la luz) se atan al progreso de scroll con Motion
(`motion/react`). Un solo video activo: el de la pantalla visible.
**Why:** César pidió que cada scroll muestre el siguiente proyecto con animaciones
llamativas; el scroll nativo mantiene teclado, lectores de pantalla y `prefers-reduced-motion`.
**Discarded alternative:** secuestrar el scroll con una librería de scroll suave (rompe
accesibilidad y el gesto en móvil).
