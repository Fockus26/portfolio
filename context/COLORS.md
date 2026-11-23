# Colors — Portafolio de César León

> Propuesta del kickoff (D003). El handoff de Claude Design puede ajustarla; si cambia un
> valor, se actualiza aquí con su ratio y se anota la decisión. Ratios calculados con la
> fórmula WCAG 2.1 el 2026-11-23.

## Light mode

| Role | Hex | Use | Contrast verified against |
|---|---|---|---|
| primary.main (moss) | #1E4A3A | Enlaces, botón de contacto, foco | wall #FAFAF7 → 9.58:1 · stone #DDD6C8 → 6.93:1 · texto wall sobre moss → 9.58:1 |
| secondary.main (brass) | #B08A4A | Solo detalle: una línea fina, el borde de la luz. Nunca texto | wall → 3.05:1 · stone → 2.21:1 (por eso no es texto ni icono informativo sobre stone) |
| background.default (wall) | #FAFAF7 | La pared de yeso | — |
| background.paper / surface (stone) | #DDD6C8 | Piso, bandas, sección de contacto | — |
| text.primary (ink) | #17160F | Texto principal | wall → 17.34:1 · stone → 12.54:1 |
| text.secondary (graphite) | #5A574E | Texto secundario, pie de tecnologías | wall → 6.91:1 · stone → 5.00:1 |
| text.disabled | #8A867B | Control deshabilitado | wall → 3.48:1 (deshabilitado: exento de AA; nunca para texto que informa) |
| success.main | #2E6B3F | Pantallas de estado | wall → 6.10:1 · stone → 4.41:1 (sobre stone solo texto grande) |
| warning.main | #8A5A00 | Pantallas de estado | wall → 5.67:1 · stone → 4.10:1 (sobre stone solo texto grande) |
| error.main | #A3271C | Error 500, video que no carga | wall → 7.01:1 · stone → 5.07:1 |
| info.main | #2F5673 | Sin conexión | wall → 7.44:1 · stone → 5.38:1 |
| divider | #C9C1B1 | Separador decorativo | wall → 1.71:1 (decorativo; no delimita un control) |
| border.control | #7D776B | Borde de control, icono informativo | wall → 4.25:1 · stone → 3.08:1 |
| selection.bg / selection.text | #1E4A3A / #FAFAF7 | `::selection` | texto sobre selección → 9.58:1 |
| scrollbar.thumb / scrollbar.track | #7D776B / #EDE9E0 | scrollbar | thumb contra track → 3.67:1 |

## Dark mode

No aplica: el proyecto no tiene modo oscuro (D003). La idea es un ático de día.

## Contrast notes

- **brass (#B08A4A) no es texto.** Llega a 3.05:1 sobre wall y a 2.21:1 sobre stone. Se usa
  solo como detalle no informativo.
- **success y warning sobre stone** quedan por debajo de 4.5:1: ahí solo texto grande
  (≥ 24 px) o se colocan sobre wall.
- **Texto sobre video:** se evita. Si el diseño lo pide, lleva panel sólido o velo con un
  mínimo declarado que mantenga 4.5:1 en todos los fotogramas.
- La selección usa moss, igual que los enlaces: el handoff debe confirmar que se distingue
  del foco (el anillo usa la tinta del componente, no moss en todos).
