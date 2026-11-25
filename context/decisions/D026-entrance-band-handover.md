# D026 · Layout · El momento de la entrada es CSS sobre el HTML del servidor y la capa fija de luz espera a que termine · Implemented

**Decision:** la banda estática de `#inicio` (`entrance-band`) llega desde `+8vw` con opacidad 0→1 en 900ms `ease-out`, y los cuatro elementos del texto (`entrance-items`) aparecen a los 200ms, 480ms cada uno, 80ms entre sí; `animation-fill-mode: both`, nada con movimiento reducido. Al hidratar, si esa animación sigue en curso y la entrada está en pantalla, `LightBandLayer` deja su banda oculta y toma el relevo (oculta las estáticas) cuando termina (`getAnimations()` → `finished`); si no, al momento.
**Why:** el relevo inmediato cortaba la llegada de 900ms; así el visitante ve una sola banda siempre, y su opacidad y su x nunca retroceden (medido frame a frame).
**Discarded alternative:** animar la banda de la capa fija (empezaría al hidratar, no con el primer pintado) o tomar el relevo en el primer scroll (cortaría la llegada a media opacidad).
