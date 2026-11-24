# D007 · Colors · Selección dentro del botón primario: fondo wall, texto moss (9.6:1) · Implemented

**Decision:** el texto seleccionado dentro de un botón primario (fondo moss) usa `::selection`
con fondo `wall` y texto `moss`. Vive en el componente (`selection:bg-wall selection:text-moss`
en `components/ui/button.tsx`), no en una regla global.
**Why:** el par global (`selection-bg` #CFE0D6 con `selection-fg` ink) se pierde sobre moss y
`DESIGN_RULES.md` pide el par invertido dentro de un componente con fondo propio. El handoff
no lo define (pregunta abierta 2 a Claude Design, sin respuesta); se aplica la propuesta que
ya estaba escrita: wall sobre moss mide 9.58:1 y no añade ningún color.
**Discarded alternative:** el par de las secciones stone (fondo moss, texto wall): sobre un
botón moss la selección no se distinguiría del propio botón.
