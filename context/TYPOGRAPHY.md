# Typography — Portafolio de César León

> Propuesta del kickoff (D003). La escala final la cierra el handoff de Claude Design; los
> tamaños de abajo son el punto de partida, no valores para implementar a ciegas.

## Families

- Heading: Schibsted Grotesk — 400 / 500 / 600 (titulares muy grandes, peso medio)
- Body: Schibsted Grotesk — 400 / 500
- Mono: IBM Plex Mono — 400, solo para el pie de tecnologías de cada proyecto

Ambas se cargan con `next/font/google`, `display: swap`, subconjunto `latin`.

## Scale (mobile-first)

| Level | xs (mobile) | md (tablet) | 1920px+ (large desktop) | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| display (nombre de proyecto, entrada) | 44px | 80px | 136px | 1.0 | -0.03em |
| h1 | 36px | 56px | 80px | 1.05 | -0.02em |
| h2 | 28px | 36px | 48px | 1.15 | -0.01em |
| h3 | 20px | 24px | 28px | 1.3 | 0 |
| body | 17px | 18px | 20px | 1.55 | 0 |
| small/caption | 14px | 14px | 15px | 1.45 | 0 |
| stack caption (mono) | 12px | 13px | 14px | 1.5 | 0.02em |

## Rules

- Any font size not in this table is a new decision — record it in
  `decisions/D0NN-<topic>.md` before using it.
- El nombre del proyecto es lo más grande de la pantalla después del video; la frase para
  el cliente siempre es mayor que la línea de tecnologías.
- Sin etiquetas en mayúsculas por todas partes ni "eyebrow" sobre cada titular
  (kit `reference/AI-DEFAULTS.md`).
- Ningún layout depende del largo exacto de un texto: el inglés puede variar ±15 %.
