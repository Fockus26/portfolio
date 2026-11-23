# Design Tokens — Portafolio de César León

> The single source of truth for reusable values that are neither color nor typography.
> Every component must consume these tokens instead of loose values in the code.
> Propuesta del kickoff: el handoff de Claude Design cierra los valores finales.

## Spacing

Base unit: 4px

| Token | Value |
|---|---|
| spacing.xs | 4px |
| spacing.sm | 8px |
| spacing.md | 16px |
| spacing.lg | 24px |
| spacing.xl | 40px |
| spacing.2xl | 64px |
| spacing.section (mobile) | 96px |
| spacing.section (desktop) | 160px |
| spacing.section (≥ 1920px) | 200px |

## Border radii

| Token | Value | Use |
|---|---|---|
| radius.sm | 2px | botones, enlaces con fondo, controles |
| radius.md | 4px | el ventanal (video) |
| radius.lg | 4px | no hay modales ni tarjetas; se mantiene igual a md |

## Shadows

Sin sombras decorativas. Si el ventanal necesita profundidad, sale de la luz (el elemento
firma), no de una sombra suave.

| Token | Value | Use |
|---|---|---|
| shadow.sm | none | — |
| shadow.md | none | — |
| shadow.lg | PENDING (handoff) | solo si el diseño define la profundidad del ventanal |

## Breakpoints

See `DESIGN_RULES.md` — they must match exactly; this file does not redefine them.

## Transitions / animation

| Token | Value |
|---|---|
| duration.fast | 150ms |
| duration.normal | 300ms |
| duration.scene | 900ms (apertura del ventanal; valor final en el handoff) |
| easing.default | cubic-bezier(0.22, 1, 0.36, 1) |

Sin rebote ni un "fade-up" por sección: un movimiento coreografiado por proyecto. Con
`prefers-reduced-motion` las transiciones son instantáneas y el video se sustituye por su
póster.

A token built on a variable that changes per element (an animation whose duration a component
overrides) is declared in `@theme inline` (Tailwind v4): in plain `@theme` the override does
nothing — the kit's `reference/STACK-NEXTJS.md` › Tailwind.
