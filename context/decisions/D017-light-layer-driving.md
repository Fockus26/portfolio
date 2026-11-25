# D017 · Layout · La capa fija de luz se mueve con propiedades CSS escritas una vez por frame desde un scroll pasivo · Implemented

**Decision:** sin `prefers-reduced-motion`, una sola capa `fixed` (`LightBandLayer`, cliente)
toma el relevo de las bandas estáticas de cada sección (que son el render del servidor, la
versión sin JavaScript y la de movimiento reducido). Mide en el montaje, en `resize` y con un
`ResizeObserver` la posición de snap de cada sección (top − `scroll-margin-top`, nunca más allá
del final de la página); en cada `scroll` pasivo pide un `requestAnimationFrame` y escribe las
propiedades `--band-*` interpoladas sobre la banda, sin re-render de React. La capa va después
de las secciones en el DOM, para pintarse sobre sus fondos (la piedra de Contacto) y bajo su
contenido, que va en envoltorios `relative z-content`. Las secciones recortan con
`overflow: clip` (no `hidden`, que rompería el `sticky` de la ola 2).
**Why:** D002: scroll nativo, sin escuchar `wheel` ni `touch`. Escribir propiedades evita
reconciliar React 60 veces por segundo y deja la geometría (incluida la regla de ancho y el
cambio de layout a 1024) en un solo sitio, el CSS. `useScroll` de Motion daría el mismo dato
con una dependencia más en el hilo de cada frame.
**Discarded alternative:** `motion/react` `useScroll` + `useTransform` por cada propiedad (doce
claves × cinco valores, más difícil de probar como función pura) y renderizar la capa antes de
las secciones (la piedra de Contacto la taparía).
