# D005 · Layout · Entre 2000 y 2560px el padding lateral crece para que el contenido no pase de 1760px · Implemented

**Decision:** el padding lateral sigue la tabla del handoff § 4 en cada breakpoint y, desde
2000px de ancho, vale `(min(100vw, 2160px) − 1760px) / 2`: pasa de 120px a 200px de forma
continua. Es una sola variable (`--side-pad`, utilidades `px-side` / `-mx-side`), así que las
ventanas a sangre usan el mismo valor que el contenedor.
**Why:** el handoff da 120px a 1920 y 200px a 2560, y a la vez dice que el contenido nunca
pasa de 1760px. Con saltos solo en los breakpoints, a 2400px de ancho el contenido mediría
1920px. 2000px = 1760 + 2 × 120 es el punto donde se alcanza el tope. La prueba
`tests/unit/layout.test.ts` lo recorre de 320 a 3840px.
**Discarded alternative:** un `max-width: 1760px` en un envoltorio interior (las ventanas a
sangre ya no sabrían cuánto margen negativo usar) y dejar 120px fijos hasta 2560 (rompe el
tope de 1760px del handoff).
