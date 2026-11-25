# D029 · Status screens · La raíz de StatusScreen mide al menos el alto del viewport (min-h-svh) · Decidida

**Decision:** la raíz usa `min-h-svh` para que la banda cruce toda la pantalla; el contenido va en `relative z-content`.
**Why:** con la raíz del alto del contenido, la banda se cortaba donde acaba el texto. Medido: sin scroll vertical nuevo a 1440x900, 768x1024 y 390x844.
