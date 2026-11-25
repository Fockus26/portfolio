# Design Tokens — Portafolio de César León

> The single source of truth for reusable values that are neither color nor typography.
> Every component must consume these tokens instead of loose values in the code.
> Valores finales del handoff (`design/HANDOFF.md` § 1.3, 1.4 y 4; D004).

## Spacing

Base unit: 4px. Solo la escala de Tailwind.

Valores usados: 4, 8, 12, 16, 20, 24, 28, 32, 40, 56, 64, 72, 80, 88, 96, 112, 120, 136,
144, 200.

Medios pasos de la escala de Tailwind que el handoff usa en un solo sitio cada uno (no se
extienden a otros usos): 6px (gap del icono en TextLink), 10px (gap del icono en la etiqueta
de estado), 14px (padding lateral del botón `sm` de la cabecera a <768).

El bloque de texto de cada proyecto usa siempre 8 / 12 / 40 (32 a <768) / 16 / 24 / 20 / 28 /
12, en ese orden (handoff § 2.10). No se "empareja".

## Grid and layout

| Breakpoint | Columns | Gutter | Side padding | Layout |
|---|---|---|---|---|
| 360 | 4 (una columna de texto) | 16px | 24px | apilado |
| 768 | 8 | 24px | 40px | apilado |
| 1024 | 12 | 24px | 48px | escritorio |
| 1440 | 12 | 24px | 80px | escritorio |
| 1920 | 12 | 24px | 120px | escritorio |
| 2560 | 12 | 32px | 200px | escritorio |

- Contenedor: `max-width: 2160px` con el padding lateral incluido, centrado; el contenido
  nunca pasa de 1760px.
- `header-h`: 72px (≥768) · 56px (<768). Es también el inset superior de la ventana abierta.
- Escritorio: cada sección mide `100svh`, sin márgenes entre ellas. Apilado: 72px arriba y
  abajo por proyecto, 96px en Sobre mí y Contacto.
- Objetivo táctil ≥ 44×44 en todo lo interactivo, salvo los dos enlaces de idioma (36×44,
  para que la cabecera quepa a 360px).

## Border radii

| Token | Value | Use |
|---|---|---|
| radius.sm | 2px | botones, foco de enlaces, ventana, control de video, filas de lista |
| radius.md | 4px | popover, esquinas superiores de la hoja móvil, marca del Open Graph |
| radius.none | 0 | ventanas a sangre en móvil, ventana abierta |

## Shadows

Ninguna `box-shadow` decorativa. Las únicas:

| Token | Value | Use |
|---|---|---|
| shadow.focus-halo | `0 0 0 6px #FAFAF7` | halo del foco del control de video |
| shadow.control-hover | `0 0 0 1px #17160F` | hover del control de video |
| shadow.current-row | `inset 2px 0 0 #17160F` | barra de la fila actual del índice |

## Breakpoints

See `DESIGN_RULES.md` — they must match exactly; this file does not redefine them.

## Transitions / animation

| Token | Value | Use |
|---|---|---|
| dur-fast | 120ms | color de hover/active, grosor del subrayado |
| dur-base | 240ms | póster→video, abrir/cerrar popover, cambio de etiqueta del índice |
| dur-slow | 480ms | hoja móvil, elementos de la entrada |
| dur-entrance | 900ms | llegada de la franja de luz en la primera carga |
| ease-out | `cubic-bezier(.2,.7,.2,1)` | todo lo que entra |
| ease-in-out | `cubic-bezier(.65,0,.35,1)` | curva aplicada al progreso de scroll de la ventana |

`animate-spinner` gira el `LoaderCircle` (una vuelta cada 800ms, lineal; se detiene con
movimiento reducido).

Otros tiempos del handoff: línea de carga del video 1200ms lineal en bucle; `LoaderCircle`
una vuelta cada 800ms lineal; "Copiado" visible 2000ms. Prohibido: rebote, overshoot de
resorte, elástico. Con `prefers-reduced-motion` se aplica lo que dice el handoff § 6 por
elemento.

## z-index

| Token | Value |
|---|---|
| z-light | 0 |
| z-content | 10 |
| z-window-open | 20 |
| z-header | 30 |
| z-popover | 40 |
| z-scrim | 50 |
| z-sheet | 60 |
| z-skip | 70 |

## Light band

La franja de luz (handoff § 2.7 y § 6.4), en `:root` de `app/globals.css`. En px como la
tabla del handoff: se dibuja contra el viewport, no contra el texto.

| Token | Value | Uso |
|---|---|---|
| `--light-overshoot` | 140px | la banda corre 140px por encima y por debajo de su caja |
| `--light-mullion` | 14px | parteluz vertical de la sombra del marco, a 50 % de W |
| `--light-transom` | 10px | travesaño horizontal de la sombra del marco |
| `--light-transom-at` | 44% | altura del travesaño en la banda |
| `--light-ref-lg` · `--light-min-lg` · `--light-max-lg` | 1440 · 1024px · 2560px | ancho ≥1024: `W₁₄₄₀ × clamp(1024, vw, 2560) / 1440` |
| `--light-ref-sm` · `--light-min-sm` · `--light-max-sm` | 390 · 320px · 1023px | ancho <1024: `W₃₉₀ × clamp(320, vw, 1023) / 390` (D015) |

Los valores por sección (ángulo, left, W, tinte) son datos en `lib/light.ts`; la capa fija
escribe los interpolados como propiedades `--band-*` (D017). No son valores mágicos: salen de
la tabla.

A token built on a variable that changes per element (an animation whose duration a component
overrides) is declared in `@theme inline` (Tailwind v4): in plain `@theme` the override does
nothing — the kit's `reference/STACK-NEXTJS.md` › Tailwind.
