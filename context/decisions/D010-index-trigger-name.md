# D010 · Components · El botón del índice no lleva `aria-label`: su nombre es su propio texto, con el nombre oculto solo a la vista en móvil · Implemented

**Decision:** el botón del índice se llama «Índice de proyectos. 03 / 09 Inversiones JS» en
todos los anchos. «Índice de proyectos.» es texto solo para lectores de pantalla y, bajo
768px, el nombre del proyecto también (a la vista queda el número).
**Why:** el handoff § 2.5 pide en móvil el nombre «Índice de proyectos. Estás en 03,
Inversiones JS». Un `aria-label` distinto del texto visible falla `label-content-name-mismatch`
en escritorio y obliga a mantener dos frases por idioma; con texto oculto el nombre siempre
contiene lo que se ve y lleva la misma información.
**Discarded alternative:** `aria-label` solo en móvil (el nombre cambiaría al girar el
teléfono y habría que elegirlo con JavaScript tras la hidratación).
