# Colors — Portafolio de César León

> Valores finales del handoff (`design/HANDOFF.md` § 1.1, D004). Sustituyen la propuesta del
> kickoff. Ratios recalculados con la fórmula WCAG 2.1 el 2026-11-23; donde el handoff
> redondea, aquí va el valor calculado.

## Light mode

| Token | Hex | Use | Contrast verified against |
|---|---|---|---|
| `wall` (background.default) | #FAFAF7 | Fondo de página, cabecera, popover, hoja, control de video | — |
| `stone` (surface) | #DDD6C8 | Franja de piso de la entrada, sección Contacto, relleno de botón deshabilitado | — |
| `ink` (text.primary) | #17160F | Titulares, frase, rol, botón secundario | wall 17.34 · stone 12.54 · wash 15.36 |
| `graphite` (text.secondary) | #5A574E | Cuerpo, tipo, número, small, pie de tecnologías, texto deshabilitado | wall 6.91 · stone 5.00 · wash 6.12 |
| `moss` (primary.main) | #1E4A3A | Enlaces, relleno del botón primario, anillo de foco de enlace y primario | wall 9.58 · stone 6.93 · texto wall sobre moss 9.58 |
| `moss-hover` | #163A2D | Hover de botón primario y de enlace | texto wall sobre él 11.97 · como texto: wall 11.97, stone 8.66 |
| `moss-active` | #102C22 | Active de botón primario y de enlace | texto wall sobre él 14.29 |
| `moss-light` | #2A5C4A | Solo la franja de luz dentro del icono de la app | letras wall sobre él 7.36 |
| `brass` (secondary.main) | #B08A4A | Borde izquierdo de la franja de luz (1px, 60 % alfa), regla de Sobre mí, línea de carga del video. **Nunca texto, icono ni foco** | wall 3.05 (no texto) · stone 2.21 (decorativo) |
| `line` (divider) | #DDD6C8 | Líneas decorativas sobre wall: regla del pie de tecnologías, borde inferior de la cabecera, separadores del popover | wall 1.38 (decorativo; nunca el único portador de significado) |
| `line-strong` (border.control) | #7A7365 | Bordes que informan: popover, filas de contacto sobre stone, thumb del scrollbar, barra del idioma | wall 4.49 · stone 3.25 · light-stone 3.71 (no es color de texto) |
| `wash` | #EFECE4 | Relleno hover: botón secundario, disparador del índice, filas de lista | ink 15.36 · graphite 6.12 |
| `wash-active` | #E3DFD4 | Relleno active del botón secundario | ink 13.62 |
| `stone-hover` | #CFC7B6 | Hover del botón secundario dentro de secciones stone | ink 10.79 |
| `reveal` | #E8E3D7 | Telar de 8px de la ventana (grosor de la pared) | decorativo |
| `control-hover` | #FFFFFF | Fondo del control de video en hover (con `0 0 0 1px ink`) | ink 18.13 |
| `selection-bg` / `selection-fg` | #CFE0D6 / #17160F | `::selection` en todo menos las secciones stone | 13.20 (moss sobre la selección 7.29 · graphite 5.26) |
| `selection-bg-stone` / `selection-fg-stone` | #1E4A3A / #FAFAF7 | `::selection` dentro de secciones stone | 9.58 |
| `scrollbar-track` / `-thumb` / `-thumb-hover` | #FAFAF7 / #7A7365 / #5A574E | Scrollbar de página: track 12px, thumb 8px, radio 2px, largo mínimo 48px | thumb 4.49 · hover 6.91 contra el track |
| `success` | #23603F | Confirmación "Copiado" (siempre con icono de check) | wall 7.13 |
| `warning` | #8A5A00 | Icono de la pantalla sin conexión | wall 5.67 |
| `error` | #9B2C1F | Icono del 500 y del video que no cargó | wall 7.24 |
| `scrim` | rgba(23,22,15,.45) | Detrás de la hoja del índice en móvil | — |
| `tag-bg` / `tag-fg` | #17160F / #FAFAF7 | Etiqueta "Póster provisional" (solo desarrollo; no se publica) | 17.34 |

No hay `text.disabled` ni `info`: el botón deshabilitado usa relleno stone con texto graphite
(5.00) y la pantalla sin conexión usa `warning`.

### Tintes de la luz (elemento firma)

Fondo de la franja de luz. Se interpolan en sRGB entre secciones (handoff § 6.4). El texto
más débil sobre cada uno es graphite.

| Token | Hex | Sección | graphite / moss / ink |
|---|---|---|---|
| `light-1` | #FFFDF2 | Entrada | 7.08 / 9.82 / 17.77 |
| — | #FFFDF1 · #FFFCF0 · #FFFCEF · #FFFCEE | Proyectos 01–04 (404 usa #FFFCF0) | graphite ≥ 7.0 |
| `light-2` | #FFFBED | Proyecto 05 | 6.97 / 9.7 / 17.5 |
| — | #FFFBEC · #FFFAEB · #FFFAEA · #FFFAE9 | Proyectos 06–09 (500 usa #FFFAEB) | graphite ≥ 6.9 |
| `light-3` | #FFF9E8 | Sobre mí | 6.87 / 9.53 / 17.2 |
| `light-stone` | #EAE4D8 | Contacto (sobre stone) | 5.70 / 7.91 / 14.32 |

**La franja nunca se vuelve ámbar ni naranja** (César, 2026-11-23). Ningún tinte más
saturado que #FFF9E8 sobre wall; el paso del día lo cuenta el ángulo (−14° → −62°).

## Dark mode

No aplica: el proyecto no tiene modo oscuro (D003).

## Contrast notes

- **brass no es texto, icono ni anillo de foco.** Sobre stone es solo decorativo (2.21).
- **Foco:** el anillo toma la tinta del componente: moss en botón primario y enlaces, ink
  en lo demás, ink + halo sólido wall de 6px en el control de video.
- **Texto sobre video:** no hay. El único elemento sobre un video es el control, un panel
  sólido wall.
- **Estado actual** (idioma, fila del índice): peso + barra (+ texto en el índice), nunca
  solo color.
- **Selección dentro del botón primario (moss):** el handoff no la define; pregunta abierta
  en `CURRENT_PHASE.md`.
