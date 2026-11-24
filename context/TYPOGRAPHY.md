# Typography — Portafolio de César León

> Escala final del handoff (`design/HANDOFF.md` § 1.2, D004). Sustituye la propuesta del
> kickoff.

## Families

- Schibsted Grotesk — 400 / 500 / 600: todo.
- IBM Plex Mono — 400: solo el pie de tecnologías y el código del error 500.

Ambas con `next/font/google`, `display: swap`, subconjunto `latin`. Los números de `num`,
del índice y de precios llevan `font-variant-numeric: tabular-nums`.

## Scale (mobile-first)

Tamaños en px por breakpoint; entre columnas se interpola con `clamp()` y nunca se baja del
valor de 360.

| Role | 360 | 768 | 1024 | 1440 | 1920 | 2560 | Line height | Weight | Tracking |
|---|---|---|---|---|---|---|---|---|---|
| `display` (nombre en la entrada) | 64 | 104 | 136 | 168 | 200 | 232 | 0.92 (0.95 en 360) | 500 | −0.045em |
| `h1` (título de Contacto) | 52 | 72 | 80 | 96 | 120 | 144 | 1.0 | 500 | −0.04em |
| `h1-status` (título de pantalla de estado) | 44 | 56 | 72 | 72 | 88 | 104 | 1.0 | 500 | −0.035em |
| `h2` (nombre de proyecto) | 48 | 56 | 64 | 80 | 104 | 128 | 0.98 | 500 | −0.035em |
| `h2-long` (nombre > 18 caracteres) | 36 | 44 | 48 | 56 | 72 | 88 | 1.02 | 500 | −0.03em |
| `h3` (frase de Sobre mí) | 32 | 40 | 48 | 56 | 64 | 72 | 1.08 | 500 | −0.03em |
| `h4` (línea de la entrada) | 24 | 28 | 28 | 32 | 40 | 44 | 1.2 | 400 | −0.02em |
| `h5` (frase del proyecto; línea de Contacto) | 22 | 24 | 24 | 28 | 32 | 36 | 1.25 | 400 | −0.015em |
| `h6` (etiqueta "Sobre mí", etiqueta de estado, `kind`) | 16 | 16 | 16 | 16 | 18 | 20 | 24px | 500 | 0 |
| `body` | 16 | 18 | 18 | 18 | 20 | 22 | 1.6 | 400 | 0 |
| `body-lg` (columnas de Sobre mí, línea de estado) | 18 | 20 | 20 | 20 | 22 | 24 | 1.5 | 400 | 0 |
| `role` | 16 | 16 | 16 | 16 | 18 | 20 | 24px | 400 | 0 |
| `small` (num, pie, etiquetas, idioma, índice) | 14 | 14 | 14 | 14 | 16 | 16 | 20px | 400 | num: +0.02em |
| `caption` (pie de tecnologías, mono) | 13 | 13 | 13 | 13 | 14 | 15 | 20px | 400 | 0 |
| `button` | 16 | 16 | 16 | 16 | 16 | 18 | 24px | 500 | 0 |

Tamaños sueltos que el handoff da con un solo valor (no escalan):

| Uso | Valor | Fuente en el handoff |
|---|---|---|
| "Estás aquí" (fila actual del índice) | 12px/16px, 400, graphite | § 2.5 |
| Etiqueta del botón `lg` (WhatsApp) | 18px, 500 | § 2.1 |
| Título de la hoja del índice ("Proyectos") | 18px, 500 | § 2.5 |
| Código del error 500 (mono) | 18px/28px | § 2.12 |
| Enlaces de las filas de contacto | 20px (≥1024) · 18px (<1024), 500 | § 2.2 |
| "Volver arriba" | 14px, 500, ink | § 2.2 |
| Wordmark | 18px/24px, 500, −0.01em (−0.03em a ≥32px); mínimo 14px | § 5 |
| Etiqueta "Póster provisional" (solo desarrollo) | 11px/16px | export |

`text-wrap: balance` en display, h1, h3, h4, h5. `overflow-wrap: anywhere` en h2.

## Rules

- Any font size not in these tables is a new decision — record it in
  `decisions/D0NN-<topic>.md` before using it.
- Sin etiquetas pequeñas sobre cada titular: solo `01 / 09` (número de sala), "Sobre mí"
  (es el `<h2>` de esa sección) y las etiquetas de estado, siempre con icono.
- Mono para exactamente dos cosas: el pie de tecnologías y el código del 500.
- Ningún layout depende del largo exacto de un texto: el inglés puede variar ±15 %.
