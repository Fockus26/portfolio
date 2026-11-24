# D008 · Components · Bajo 768px la etiqueta de un botón puede partirse en dos líneas en vez de desbordar · Implemented

**Decision:** el Button usa `min-height` (44 / 48 / 56px) y `white-space: nowrap` solo desde
768px. Por debajo, una etiqueta que no cabe pasa a dos líneas centradas.
**Why:** el handoff § 2.1 pide `nowrap`, pero a 320px «Escribir por WhatsApp» en tamaño `lg`
mide 276px y el ancho útil es 272px: la página ganaba scroll horizontal (medido: 344 > 320).
La regla de accesibilidad (sin scroll horizontal a 320px, texto al 200 %) manda sobre el
handoff. A 360px y más, todas las etiquetas del diseño caben en una línea, así que el diseño
no cambia en ningún ancho dibujado.
**Discarded alternative:** reducir el padding del tamaño `lg` en móvil (cambia la medida del
handoff en todos los teléfonos para arreglar solo el de 320px) · `nowrap` siempre con
`overflow: hidden` (corta el texto).
