# D009 · Components · El monograma «CL» de la cabecera móvil se dibuja desde CSS; el enlace se llama «César León, inicio» · Implemented

**Decision:** bajo 768px el wordmark pasa a ser la marca de 32px con «CL». Sus letras salen
de `messages/*.json` (`Header.monogram`) pero se pintan con `content: attr(data-mark)` en un
`<span aria-hidden>`; el nombre accesible del enlace sigue siendo «César León, inicio».
**Why:** el handoff § 2.3 fija ese nombre accesible y el monograma como marca. Con «CL» como
texto del enlace, axe da `label-content-name-mismatch` (el texto visible no está dentro del
nombre accesible), también con `aria-hidden`. Una marca es un dibujo, no una etiqueta: como
contenido de CSS no cuenta como texto visible y el nombre es el mismo en todos los anchos.
**Discarded alternative:** nombre accesible «CL, César León, inicio» (se lee mal) · un SVG
con las letras en trazos (es el icono definitivo del paso 11 del handoff; aún no existe).
