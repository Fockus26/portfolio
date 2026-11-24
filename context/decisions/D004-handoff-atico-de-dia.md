# D004 · Design system · El handoff de Claude Design cierra tokens, breakpoints y la luz sin ámbar · Accepted

**Decision:** `design/HANDOFF.md` (2026-11-23) es la fuente de valores; `COLORS.md`,
`TYPOGRAPHY.md`, `DESIGN_TOKENS.md` y los breakpoints de `DESIGN_RULES.md` se reescribieron
para decir lo mismo. Cambios frente a la propuesta del kickoff (D003):

- **La franja de luz no se vuelve ámbar.** Va de #FFFDF2 a #FFF9E8 (y #EAE4D8 sobre stone);
  el paso del día lo cuenta solo el ángulo, de −14° a −62°.
- **Colores de estado:** success #23603F y error #9B2C1F (antes #2E6B3F y #A3271C); sin
  `info` (sin conexión usa warning #8A5A00) ni `text.disabled` (deshabilitado = relleno stone
  con texto graphite, 5.00:1).
- **Bordes:** `line-strong` #7A7365 sustituye a `border.control` #7D776B; `line` #DDD6C8
  sustituye a `divider` #C9C1B1. El track del scrollbar pasa a wall.
- **Selección:** #CFE0D6 con ink (13.20:1) en la página; moss con wall solo dentro de las
  secciones stone.
- **Breakpoints:** 768 · 1024 · 1440 · 1920 · 2560 (diseño base a 360), en lugar de los de
  Tailwind por defecto.
- **Radios:** la ventana usa 2px (antes 4px); 4px queda para popover y hoja.
- **Movimiento:** 120 / 240 / 480 / 900 ms con `cubic-bezier(.2,.7,.2,1)`; la ventana se abre
  ligada al scroll en un tramo de 200svh por proyecto (solo ≥1024 y con movimiento permitido).
- **Espaciado:** se admiten 6, 10 y 14px (medios pasos de Tailwind) en los tres usos que el
  handoff nombra.
- **Videos:** archivo de escritorio y de móvil por proyecto (hasta 2.5 MB / 900 KB en 16:9),
  póster en AVIF + JPG; sustituye la meta única de 1.5 MB.
- **Objetivo táctil:** 44×44, salvo los dos enlaces de idioma (36×44) para que la cabecera
  quepa a 360px.

**Why:** el kickoff dejó la paleta secundaria, la escala y el movimiento como propuesta para
que el diseño los cerrara. César rechazó la versión ámbar de la franja al verla ("lo
prefiero sin el naranja", 2026-11-23). Todos los pares de texto se recalcularon y cumplen
4.5:1; los bordes que informan cumplen 3:1.
**Discarded alternative:** mantener la propuesta del kickoff donde difería del handoff: dos
fuentes de valores, y el frontend seguiría una u otra según cuál leyera.
