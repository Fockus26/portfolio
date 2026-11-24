# HANDOFF — César León · Portfolio ("Ático de día")

Design source: https://claude.ai/artifact/ABdaEw7pQ84AgMLMKvprws (private canvas; 14 artboards).
Artboards: `Main` (entrance + 01–04, 1440), `Inicio-b` (05–09), `Inicio-c` (Sobre mí + Contacto),
`Movil-a/b/c` (same at 390), `Ventana` (video states + opening storyboard), `Componentes`,
`Extremo` (extreme content), `Estado-1440`, `Estado-390`, `Marca`, `OG`, `Poster` (placeholder
posters). The artboards share one stylesheet (`atico.css`); its class names are not a contract,
the values in this document are.

Default I would have reached for and did not use: a two-column "text left, rounded video card
right" block repeated nine times with a fade-up on each. What is built instead: a wall, a
travelling parallelogram of light, and nine windows that differ in side, proportion and
alignment inside one grid.

All px values are at 1440 unless a breakpoint is named. Breakpoints: `360 · 768 · 1024 · 1440 ·
1920 · 2560` (min-width, mobile first). "Desktop layout" = ≥1024. "Stacked layout" = <1024.

---

## 1. Tokens

### 1.1 Color (light only; there is no dark mode)

| Token | Value | Use | Verified contrast |
|---|---|---|---|
| `wall` (background) | `#FAFAF7` | Page background, header bar, popover, sheet, video control | — |
| `stone` (surface) | `#DDD6C8` | Entrance floor strip, Contacto section, disabled button fill | — |
| `ink` (text primary) | `#17160F` | Headings, lead, role, secondary button | 17.3:1 on wall · 12.5:1 on stone · 15.4:1 on `wash` |
| `graphite` (text secondary) | `#5A574E` | Body, kind, number, small, stack caption, disabled text | 6.9:1 on wall · 5.0:1 on stone · 6.1:1 on `wash` |
| `moss` (primary) | `#1E4A3A` | Text links, primary button fill, link/primary focus ring | 9.6:1 on wall · 6.9:1 on stone; `wall` text on moss 9.6:1 |
| `moss-hover` | `#163A2D` | Primary button hover, link hover | `wall` text on it ≥ 9.6:1 |
| `moss-active` | `#102C22` | Primary button active, link active | `wall` text on it ≥ 9.6:1 |
| `moss-light` | `#2A5C4A` | Light band inside the app icon only | `wall` letters on it 7.4:1 |
| `brass` (secondary) | `#B08A4A` | Left edge of the light band (1px, 60 % alpha), the rule in Sobre mí, video loading line. **Never text** | 3.05:1 on wall (non-text only) · 2.2:1 on stone (decorative only) |
| `line` | `#DDD6C8` | Decorative hairlines on wall (stack caption rule, header bottom, popover separators) | 1.4:1 — decorative, never the only carrier of meaning |
| `line-strong` | `#7A7365` | Informative borders: popover border, contact rows on stone, scrollbar thumb, lang slash | 4.5:1 on wall · 3.25:1 on stone |
| `wash` | `#EFECE4` | Hover fill: secondary button, index trigger, list rows | see ink/graphite rows |
| `wash-active` | `#E3DFD4` | Active fill of secondary button | ink 13.6:1 |
| `stone-hover` | `#CFC7B6` | Secondary button hover inside stone sections | ink 10.8:1 |
| `reveal` | `#E8E3D7` | 8px window reveal (wall thickness) | decorative |
| `selection-bg` / `selection-fg` | `#CFE0D6` / `#17160F` | `::selection` everywhere except stone sections | 13.2:1 |
| `selection-bg-stone` / `-fg-stone` | `#1E4A3A` / `#FAFAF7` | `::selection` inside `.stone` sections | 9.6:1 |
| `scrollbar-track` / `-thumb` / `-thumb-hover` | `#FAFAF7` / `#7A7365` / `#5A574E` | Page scrollbar. Track 12px, thumb 8px wide, radius 2px, min length 48px | thumb 4.5:1, hover 6.9:1 against track |
| `success` | `#23603F` | "Copiado" confirmation (always with check icon) | 7.1:1 on wall |
| `warning` | `#8A5A00` | Offline label icon | 5.7:1 on wall |
| `error` | `#9B2C1F` | 500 label icon, video-failed icon | 7.2:1 on wall |
| `scrim` | `rgba(23,22,15,.45)` | Behind the mobile index sheet | — |
| `tag-bg` / `tag-fg` | `#17160F` / `#FAFAF7` | "Póster provisional" tag (development only, see §8) | 17.3:1 |

Light tints (the signature; background of the light band). Weakest text on each is graphite:

| Token | Value | Where | graphite / moss / ink on it |
|---|---|---|---|
| `light-1` | `#FFFDF2` | Entrance | 7.1 / 9.8 / 17.8 |
| `light-2` | `#FFFBED` | Project 05 (midpoint) | 7.0 / 9.7 / 17.5 |
| `light-3` | `#FFF9E8` | Sobre mí | 6.9 / 9.5 / 17.2 |
| `light-stone` | `#EAE4D8` | Contacto (on stone) | 5.7 / 7.9 / 14.3 |

The band never turns amber or orange (César, 2026-11-23: the warm version read as an orange
ribbon). It stays a near-white warm tint from start to end; on stone it is a lighter stone.
The passing of the day is carried by the angle, not by the color.

Changes against the brief's palette: none to the six given hexes. Added: everything marked above
that the brief left as PROPOSE, plus the five light tints.

### 1.2 Typography

Families: `Schibsted Grotesk` 400/500/600 (everything), `IBM Plex Mono` 400 (stack caption and the
500 error code, nothing else). Load with `next/font/google`, `display: swap`, subsets `latin`.
Numbers in `num`, index and prices use `font-variant-numeric: tabular-nums`.

Sizes in px per breakpoint (interpolate with `clamp()` between columns; never below the 360 value):

| Role | 360 | 768 | 1024 | 1440 | 1920 | 2560 | Line height | Weight | Tracking |
|---|---|---|---|---|---|---|---|---|---|
| `display` (entrance name) | 64 | 104 | 136 | 168 | 200 | 232 | 0.92 (0.95 at 360) | 500 | −0.045em |
| `h1` (Contacto title) | 52 | 72 | 80 | 96 | 120 | 144 | 1.0 | 500 | −0.04em |
| `h1-status` (status title) | 44 | 56 | 72 | 72 | 88 | 104 | 1.0 | 500 | −0.035em |
| `h2` (project name) | 48 | 56 | 64 | 80 | 104 | 128 | 0.98 | 500 | −0.035em |
| `h2-long` (name > 18 chars) | 36 | 44 | 48 | 56 | 72 | 88 | 1.02 | 500 | −0.03em |
| `h3` (Sobre mí statement) | 32 | 40 | 48 | 56 | 64 | 72 | 1.08 | 500 | −0.03em |
| `h4` (entrance line) | 24 | 28 | 28 | 32 | 40 | 44 | 1.2 | 400 | −0.02em |
| `h5` (project lead sentence) | 22 | 24 | 24 | 28 | 32 | 36 | 1.25 | 400 | −0.015em |
| `h6` (section label "Sobre mí", status label, `kind`) | 16 | 16 | 16 | 16 | 18 | 20 | 24px | 500 | 0 |
| `body` | 16 | 18 | 18 | 18 | 20 | 22 | 1.6 | 400 | 0 |
| `body-lg` (Sobre mí columns, Contacto line 28 → uses `h5`) | 18 | 20 | 20 | 20 | 22 | 24 | 1.5 | 400 | 0 |
| `role` | 16 | 16 | 16 | 16 | 18 | 20 | 24px | 400 | 0 |
| `small` (num, footer, labels) | 14 | 14 | 14 | 14 | 16 | 16 | 20px | 400 | num: +0.02em |
| `caption` (stack, mono) | 13 | 13 | 13 | 13 | 14 | 15 | 20px | 400 | 0 |
| `button` | 16 | 16 | 16 | 16 | 16 | 18 | 24px | 500 | 0 |

`text-wrap: balance` on display, h1, h3, h4, h5. `overflow-wrap: anywhere` on h2.

### 1.3 Spacing, radii, shadows

Spacing: Tailwind scale only (4px base). Values used: 4, 8, 12, 16, 20, 24, 28, 32, 40, 56, 64, 72,
80, 96, 112, 120, 136, 144, 200.

| Token | Value | Use |
|---|---|---|
| `radius-sm` | 2px | Buttons, links focus, window, video control, list rows |
| `radius-md` | 4px | Popover, top corners of the mobile sheet, OG mark |
| `radius-none` | 0 | Full-bleed windows on mobile, opened window |
| `shadow` | none | No box-shadow anywhere, except the focus halo of the video control: `0 0 0 6px #FAFAF7` |
| `header-h` | 72px (≥768) · 56px (<768) | Header bar, `scroll-margin-top`, top inset of the opened window |

### 1.4 Motion and z-index

| Token | Value | Use |
|---|---|---|
| `dur-fast` | 120ms | Hover/active color, underline thickness |
| `dur-base` | 240ms | Poster→video crossfade, popover open/close, index label swap |
| `dur-slow` | 480ms | Mobile sheet, entrance orchestration items |
| `dur-entrance` | 900ms | Light band arriving on first load |
| `ease-out` | `cubic-bezier(.2,.7,.2,1)` | Everything that enters |
| `ease-in-out` | `cubic-bezier(.65,0,.35,1)` | Easing applied to scroll progress of the window |
| `z-light` 0 · `z-content` 10 · `z-window-open` 20 · `z-header` 30 · `z-popover` 40 · `z-scrim` 50 · `z-sheet` 60 · `z-skip` 70 | | |

---

## 2. Components

Icons: `lucide-react`, stroke 2, `aria-hidden`. Sizes: 16px in buttons/links, 18px in the video
control, 20px in status labels. Touch target ≥ 44×44 for every interactive element, with one
exception: the two language links are 36×44 so the header fits at 360px (still above the 24px
minimum of WCAG 2.2 AA).

### 2.1 Button — shadcn `Button` (restyled)
- Anatomy: optional leading icon · label · optional trailing icon. Gap 8px.
- Variants: `primary` (fill moss, text wall, no border) · `secondary` (transparent, 1px ink border, ink text).
- Sizes: `md` height 48px, padding 0 24px · `sm` height 44px, padding 0 20px (header; 0 14px at <768) · `lg` height 56px, padding 0 28px, 18px label (WhatsApp).
- Radius 2px. Font `button`. `white-space: nowrap`.
- States primary: rest `#1E4A3A` · hover `#163A2D` · focus-visible `outline: 2px solid #1E4A3A; outline-offset: 2px` · active `#102C22` + `translateY(1px)` · disabled fill `#DDD6C8`, text `#5A574E`, no border, `cursor: not-allowed`, `aria-disabled="true"` · loading: label changes ("Reintentando"), leading `LoaderCircle` rotating 1 turn / 800ms linear, `aria-busy="true"`, not clickable.
- States secondary: rest transparent · hover fill `#EFECE4` (`#CFC7B6` inside stone) · focus-visible `outline: 2px solid #17160F; offset 2px` · active fill `#E3DFD4` + `translateY(1px)` · disabled same as primary disabled · loading same pattern.
- Error state: not applicable (no forms).
- Responsive: in the status screens at <768 buttons are full width, stacked, gap 12px. In the mobile entrance they stay inline and wrap (gap 12px).
- A11y: real `<a>` when it navigates, `<button>` when it acts. Accessible name = visible label.

### 2.2 TextLink (project links, contact links, "Volver arriba")
- Anatomy: label + trailing icon (`ArrowUpRight` for external, `ArrowUp` for back-to-top; no icon for the email).
- Color moss, weight 500, 16px/24px (20px in contact rows ≥1024, 18px <1024; 14px ink for "Volver arriba"). Underline 1px, offset 5px. `min-height: 44px`, `display: inline-flex`, gap 6px.
- States: rest · hover underline 2px + `#163A2D` · focus-visible `outline: 2px solid #1E4A3A; offset 4px; radius 2px` · active `#102C22` · disabled (a project without a live link): `<span aria-disabled="true">`, graphite, no underline, no icon. Loading/error: n/a.
- External links: `target="_blank" rel="noopener noreferrer"`, accessible name `"{label}: {project} (se abre en otra pestaña)"`.

### 2.3 Header
- Anatomy: wordmark (left) · ProjectIndex trigger (center) · right group = LanguageSwitch + Button `sm` primary "Contacto".
- `position: fixed; top: 0`; height 72px (56px <768); background **solid** `#FAFAF7` (no blur, no transparency); `border-bottom: 1px solid #DDD6C8` appears when `scrollY > 8px` (opacity 0→1, 120ms). Padding-inline = page side padding (§4); 16px at <768. `justify-content: space-between`, right group gap 24px (4px <768).
- <768: wordmark becomes the 32px "CL" monogram inside a 44px target; trigger shows only the number; "Contacto" keeps its label.
- First focusable element of the page is a skip link "Saltar al contenido" (visible on focus: ink text on wall, 2px ink outline, top-left 8px, `z-skip`).
- A11y: `<header>` with `<nav aria-label="Principal">`. Wordmark link name "César León, inicio".

### 2.4 LanguageSwitch
- Two links `ES` `/` `EN`. Each 36×44px min, 14px/20px. Slash `#7A7365`, `aria-hidden`.
- States: rest graphite 400 · hover ink + underline (offset 5px) · focus-visible `outline: 2px solid #17160F; outline-offset: -4px` · current: ink, weight 600, plus a 2px ink bar 8px above the bottom edge, inset 8px left/right, `aria-current="true"`. Disabled/loading/error: n/a.
- Links go to the same section in the other locale (`/en#p03`). `lang` and `hreflang` set on each. `<nav aria-label="Idioma">` (`"Language"` in EN).

### 2.5 ProjectIndex
- Trigger (in header): `<button>` height 44px, padding 0 12px, gap 12px, radius 2px, 14px/20px. Content: number in graphite (`03 / 09`) · name weight 500 in ink · `ChevronDown` 16px. In the entrance it reads `01–09` + "Proyectos"; in Sobre mí / Contacto `01–09` + section name. `min-width: 220px` at ≥768 and centered text-start, so the header does not reflow when the name changes.
  - States: rest transparent · hover `#EFECE4` · focus-visible `outline: 2px solid #17160F; offset 2px` · open `#EFECE4` and chevron rotated 180° (120ms) · disabled/loading/error n/a.
- Desktop list (≥768): shadcn `Popover`, width 320px, padding 8px, background wall, `border: 1px solid #7A7365`, radius 4px, no shadow, `sideOffset` 8px, centered under the trigger. Content is a `<nav>` of links (not a menu): Inicio · separator · 01–09 · separator · Sobre mí · Contacto. Row height 44px, padding 0 12px, gap 16px, number column 20px (14px graphite), label 16px ink. Separator `1px #DDD6C8`, margin 8px 0.
  - Row states: rest · hover fill `#EFECE4` · focus-visible `outline: 2px solid #17160F; offset -2px` · current: weight 600 + `inset 2px 0 0 #17160F` bar on the left + the text "Estás aquí" (12px graphite) right-aligned + `aria-current="location"`.
- Mobile list (<768): shadcn `Sheet` `side="bottom"`, background wall, radius 4px 4px 0 0, padding 8px 8px 16px, max-height 85svh with internal scroll, scrim `rgba(23,22,15,.45)`. Title row 56px: "Proyectos" 18px/500 + close button 44×44 (`X` 20px, name "Cerrar el índice"). Order: 01–09 · separator · Inicio · Sobre mí · Contacto. Rows identical to desktop.
- Behavior: choosing a row closes the list and scrolls to the section (§6.3). `Esc` closes and returns focus to the trigger. Focus is trapped in the Sheet, not in the Popover.
- A11y: trigger `aria-expanded`, `aria-haspopup="dialog"`, name "Índice de proyectos. Estás en 03, Inversiones JS" on mobile (where the name is not visible).

### 2.6 FloorNav (entrance only, ≥1024)
- A stone strip, 96px high, pinned to the bottom of the entrance, nine links in one row, `justify-content: space-between`, padding-inline = page side padding. Each link: number graphite + name ink, 14px/20px, gap 8px, min-height 44px, no underline at rest; hover/focus as TextLink but in ink (underline 1px on hover, 2px ink outline on focus).
- <1024: the links are removed; a plain stone strip 40px high remains (the index sheet does the job).
- `<nav aria-label="Proyectos">`.

### 2.7 LightBand (signature, decorative)
- One element, `aria-hidden`, `pointer-events: none`, `z-light`, behind all content, clipped by the viewport.
- Shape: a rectangle `width W`, spanning from 140px above to 140px below the viewport, `transform: skewX(θ)`, `transform-origin: 50% 0`. Fill = current light tint. `border-left: 1px solid rgba(176,138,74,.6)` (brass edge).
- Window-frame shadow, drawn in the section's background color (wall, or stone in Contacto): one vertical mullion 14px wide at 50 % of W, one horizontal transom 10px high at 44 % of the band's height.
- Values per section and their interpolation: §6.2.
- Never above content, never on the status "offline" screen.

### 2.8 Window (project video)
- Anatomy: `<figure>` → reveal (8px `#E8E3D7` on the top and on the side facing the page center: `padding: 8px 0 0 8px`, or `8px 8px 0 0` when the window bleeds to the left edge) → screen (radius 2px, `overflow: hidden`, background `#DDD6C8`) → `<img>` poster + `<video muted loop playsinline preload="none">` stacked + VideoControl.
- Proportions: `16/9` (desktop web), `9/19.5` (phone), `9/16` (chat). `object-fit: cover; object-position: center top`.
- States (artboard `Ventana`):
  - loading: poster visible; a 2px brass line at the bottom edge runs 0→100 % width in 1200ms linear, repeating; no control yet; `aria-busy="true"` on the figure.
  - playing: video opacity 0→1 over 240ms on `canplay`; poster removed after the fade; control shows `Pause`.
  - paused by the visitor: control shows `Play` plus a solid label "En pausa" (44px high, padding 0 12px, wall background, 14px ink) placed 8px to the left of the control. The pause is global and persists (`sessionStorage`): no other video autoplays until the visitor presses play.
  - poster only (`prefers-reduced-motion: reduce`, `navigator.connection.saveData`, or `effectiveType` 2g/slow-2g): the video is not fetched; control shows `Play` with the label "Ver el video"; pressing it loads and plays that one video.
  - failed: poster stays; a solid panel bottom-left (16px inset, 44px high, wall background, padding 0 4px 0 12px, gap 12px): `TriangleAlert` 18px `#9B2C1F` + "El video no cargó" 14px ink + secondary button 36px high "Reintentar" (its 44px target is extended with padding/pseudo-element).
  - hover/focus/active/disabled of the figure itself: n/a (it is not interactive).
- Only one video plays at a time: the room nearest the viewport center; all others are paused and reset to their poster.
- Responsive: slots per room in §3. On stacked layout 16:9 windows are full-bleed (no reveal, radius 0); vertical windows are 208px wide (228px for chat) with the reveal.
- A11y: decorative. `<video aria-hidden="true" tabindex="-1">`, poster `alt=""`. The figure has no caption; the stack caption is text, not a figcaption.

### 2.9 VideoControl
- `<button>` 44×44, radius 2px, background **solid** `#FAFAF7`, icon 18px ink. Position: bottom-right of the screen, inset 16px (12px <768).
- States: rest · hover background `#FFFFFF` + `box-shadow: 0 0 0 1px #17160F` · focus-visible `outline: 2px solid #17160F; outline-offset: 2px; box-shadow: 0 0 0 6px #FAFAF7` (ink ring on a solid wall halo: ≥ 3:1 on any frame) · active `translateY(1px)` · disabled: not rendered (loading state) · error: replaced by the failed panel.
- Name: "Pausar el video de {project}" / "Reproducir el video de {project}". `aria-pressed` is not used; the name changes.
- This is the only element that sits on top of a video, and it is a solid panel: no text is ever placed on video.

### 2.10 ProjectRoom text block
Order and spacing (identical in all nine rooms; do not "even out"):
`num` → 8px → `h2` name → 12px → `kind` → 40px (32px <768) → lead `h5` → 16px → body (max-width 46ch) → 24px → role → 20px → links row (gap 0 32px, each link 44px high) → 28px → 1px `#DDD6C8` rule the full width of the text column → 12px → stack caption.
- `num` format `01 / 09`. `kind` graphite 500. Role is one sentence starting with "Rol:" in ink.
- Stack caption: technologies joined with ` · `, mono 13px graphite, wraps to as many lines as needed.
- Links: 1 to 3 TextLinks.
- Name longer than 18 characters → `h2-long`.

### 2.11 ContactRows
- Three rows: label (`small`, 96px wide) + TextLink. Row min-height 64px, `border-top: 1px solid #7A7365`, last row also `border-bottom`. Gap 24px.
- <768: the email row stacks (label above link, padding 12px 0 8px, `overflow-wrap: anywhere`); the other two rows keep label left / link right (`justify-content: space-between`).

### 2.12 CopyCode (500 with code)
- Row with `border-top` and `border-bottom` `1px #DDD6C8`, padding 12px 0, max-width 680px, gap 16px: label "Código" (`small`) · `<code>` IBM Plex Mono 18px/28px ink, `user-select: all` · secondary button `sm` "Copiar código" with `Copy` icon.
- After copying: the button is replaced for 2000ms by `Check` 16px + "Copiado" (16px/500, `#23603F`, 44px high); announce with `role="status"`. If the clipboard API fails, select the code text instead and show "Selecciona y copia el código".
- <768: label, code and a full-width button stacked, gap 12px.

### 2.13 StatusScreen — see §5b.

### 2.14 Footer
- Inside Contacto, min-height 72px, `justify-content: space-between`: "César León · {year}" (`small`) and TextLink "Volver arriba" (14px ink, `ArrowUp`).

---

## 3. Sections

Shared at ≥1024: every section is one viewport. Rooms use a 12-column grid (§4) with
`align-items: center` unless noted, and `padding-top: header-h`.

### 0 · Header and project index
See 2.3–2.5. Spacing: fixed; content never sits under it at rest because every section reserves `header-h`.

### 1 · Entrance (`#inicio`)
- ≥1024: height `100svh` (min 720px). Text block in columns 1–9, starting 136px from the top: `display` name → 40px → `h4` line (max-width 21em) → 16px → body (max-width 34em) → 40px → buttons row (primary "Contacto", secondary "Ver proyectos" with `ArrowDown`; gap 16px). FloorNav pinned to the bottom (96px).
- LightBand state: θ −14°, W 400px, left 70 %, `#FFFDF2`.
- <1024: padding 120px side-padding 0; same order; `h4` 24px; buttons wrap, gap 12px; 120px below the buttons a 40px stone strip, full-bleed.
- Content: all real.

### 2–10 · Project rooms (`#p01` … `#p09`)

Columns are grid lines at ≥1024 (`a / b` = `grid-column`). "Bleed" = the window extends through the side padding to the edge of the container (`margin-right` or `margin-left` = −side padding).

| # | Project | Window | Window columns | Text columns | Vertical alignment | CTA(s) |
|---|---|---|---|---|---|---|
| 01 | Maranatha | 16:9 | 6 / 13, bleed right | 1 / 6 | center | Ver sitio |
| 02 | Melao | 9:19.5 | 2 / 5 | 7 / 13 | center | Ver demo |
| 03 | Inversiones JS | 16:9 | 1 / 7, bleed left, reveal on the right | 7 / 13 + 40px left padding | `align-items: end`, 112px bottom padding | Ver código |
| 04 | Gaby | 9:16 | 9 / 12 | 2 / 7 | center | Ver código |
| 05 | World Flags | 9:19.5 | 9 / 12 | 1 / 8 | `align-items: start`, 88px top padding | Ver demo · Ver código |
| 06 | Workout | 9:19.5 | 1 / 4 | 5 / 12 | `align-items: end`, 96px bottom padding | Ver demo |
| 07 | KREA | 16:9 | 5 / 13, no bleed | 1 / 5 | center | Ver demo · Ver código |
| 08 | Inversiones JL22 | 16:9 | 1 / 7, bleed left, reveal on the right | 7 / 13 + 40px left padding | `align-items: start`, 88px top padding | Ver sitio · Caso de estudio |
| 09 | La Nación Radio | 9:19.5 | 6 / 9 | split: 1 / 6 holds num, name, kind, lead; 9 / 13 + 40px left padding holds body, role, links, stack | center | Caso de estudio |

- Vertical windows are capped: `max-height: calc(100svh - header-h - 96px)`, width follows the ratio.
- Vertical spacing: rooms touch each other; there is no gap between sections. The empty wall comes from the grid, not from margins.
- Stacked layout (<1024), every room: padding `72px side-padding`. Order: num, name, kind → 32px → window → lead (32px above) → body → role → links → stack. 16:9 windows full-bleed. Vertical windows: 02 left-aligned, 04 right-aligned (228px), 05 right-aligned, 06 left-aligned, 09 centered (208px). At 768 vertical windows are 280px wide and text max-width is 560px. Room 09 is not split: one text block.
- At 1024 the same grid lines apply; nothing reorders between 1024 and 2560.
- Content: all text real (brief §8). Posters are **placeholders** drawn in code with demo data and invented colors; each carries the tag "Póster provisional". Replace with the first frame of each recorded video. Link URLs are `#` (see §9).

### 11 · Sobre mí (`#sobre-mi`)
- ≥1024: height `100svh` (min 720px), content starts 120px below the header. Grid: label "Sobre mí" (`h6`, graphite; it is the section's `<h2>`) across 1 / 13 → 24px → statement (`h3`) in 1 / 10 → 72px → 1px brass rule across 1 / 13 → 24px → three paragraphs (`body-lg`, ink) in 1 / 5, 5 / 9, 9 / 13 → 56px → primary button "Contacto" with `ArrowDown`.
- Optional portrait: window 4:5 with reveal in 10 / 13, top-aligned with the statement. The layout is complete without it (default). Toggle in the artboard: tweak `conRetrato`.
- LightBand: θ −56°, W 280px, left 135 %, `#FFF9E8`.
- <1024: padding 96px side-padding; label → 16px → statement (32px) → 40px → brass rule → three paragraphs stacked (18px/1.55, 24px then 16px between) → 40px → button.
- Content: real. Portrait pending (optional).

### 12 · Contacto (`#contacto`)
- Background stone. ≥1024: height `100svh` (min 760px), flex column. Content starts 144px from the top: title (`h1`) in 1 / 12 → 32px → line (28px/1.25, 400) in 1 / 9 → 72px → left 1 / 6: Button `lg` primary "Escribir por WhatsApp" (`MessageCircle` 20px) + 12px + number in `small`; right 7 / 13: ContactRows (Correo, LinkedIn, GitHub). Footer at the bottom.
- LightBand: θ −62°, W 270px, left 170 %, `#EAE4D8`; frame shadow in stone.
- <1024: padding 96px side-padding 0; title 52px → 24px → line 20px/1.35 → 40px → WhatsApp button full width → number → 40px → ContactRows → 56px → footer.
- Content: real except the WhatsApp number (`+58 000 000 0000`, shown with "· número provisional" until replaced; remove that suffix with the real number). LinkedIn/GitHub URLs pending.

---

## 4. Global grid and layout

| Breakpoint | Columns | Gutter | Side padding | Layout |
|---|---|---|---|---|
| 360 | 4 (single text column) | 16px | 24px | stacked |
| 768 | 8 | 24px | 40px | stacked |
| 1024 | 12 | 24px | 48px | desktop |
| 1440 | 12 | 24px | 80px | desktop |
| 1920 | 12 | 24px | 120px | desktop |
| 2560 | 12 | 32px | 200px | desktop |

- Container: `max-width: 2160px` including side padding, centered; content width never exceeds 1760px. Bleeding windows stop at the container edge (at 2560 there are 200px of wall beyond them).
- Vertical rhythm: desktop sections are exactly one viewport each (`100svh`), no margins between them. Stacked sections: 72px top and bottom padding per room (144px of wall between one room's caption and the next room's number), 96px for Sobre mí and Contacto.
- Scroll snapping: `html { scroll-snap-type: y proximity; }`, each section `scroll-snap-align: start`. Only at ≥1024 and only when motion is allowed. Never `mandatory`; no wheel or touch listeners that alter scrolling.
- No horizontal scroll at 320px: the only fixed widths are 208/228px windows; the email wraps with `overflow-wrap: anywhere`.

---

## 5. Assets

**Brand (artboard `Marca`)**
- Source icon `icon.svg`, 512×512 viewBox: square `#1E4A3A`, radius 32 (6.25 %), light band `#2A5C4A` (26 % wide, left edge at 62 %, skew −18°), letters "CL" Schibsted Grotesk 600, tracking −0.06em, cap height ≈ 38 % of the square, fill `#FAFAF7`, **converted to outlines**.
- `favicon.ico` 16 + 32 + 48: at 16 and 32 no light band; at 16 the letters are 60 % of the height with tracking −0.04em. Also `icon.svg` as `rel="icon" type="image/svg+xml"`.
- `apple-touch-icon.png` 180×180, opaque `#1E4A3A`, no rounded corners, with the band.
- `icon-maskable-512.png` 512×512: letters and band inside the central 80 % circle; background `#1E4A3A` to the edges. Also `icon-192.png`, `icon-512.png` (non-maskable).
- Wordmark: live text, not an image. Schibsted Grotesk 500, tracking −0.03em at ≥32px and −0.01em at 18px. Minimum size 14px.
- Web manifest: `theme_color` and `background_color` `#FAFAF7`.

**Open Graph (artboard `OG`)**, 1200×630 PNG, one per locale, generated with `next/og`:
- Wall background; light band θ −22°, W 300px, left 76 %, `#FFFBED`.
- "CL" mark 64×64 at x 80, y 72. Name "César León" 136px/0.92 500 at x 80, baseline block ending 136px above the bottom. Line (36px/1.2, max-width 880px) 28px under the name: the entrance line of the locale.
- Stone strip 88px at the bottom: left "Nueve proyectos reales" / "Nine real projects" 24px ink; right the site domain 24px graphite.
- Safe area: all text sits inside x 80–1120 and y 72–542. A centered 630×630 crop cuts the name: accepted (see §9).

**Icons** — `lucide-react`: `ArrowUpRight`, `ArrowDown`, `ArrowUp`, `ChevronDown`, `Pause`, `Play` (filled), `X`, `Copy`, `Check`, `RotateCcw`, `LoaderCircle`, `TriangleAlert`, `WifiOff`, `Search`, `MessageCircle`. No brand logos (WhatsApp, LinkedIn, GitHub are text).

**Illustrations / photos** — none. Optional portrait: 4:5, 960×1200 AVIF + JPG, plain light background, daylight.

**Project videos** — 8–12s loop, 30fps, no audio track, demo data only, first and last frame equal. Deliver `mp4` (H.264) + `webm` (VP9), and a poster (first frame) as AVIF + JPG at the same pixel size.

| Kind | Projects | Ratio | Record at | Desktop file | Mobile file | Budget |
|---|---|---|---|---|---|---|
| Desktop web | 01, 03, 07, 08 | 16:9 | 1920×1080 | 1600×900 | 960×540 | ≤ 2.5 MB / ≤ 900 KB |
| Phone | 02, 05, 06, 09 | 9:19.5 | 1080×2340 | 720×1560 | 480×1040 | ≤ 1.8 MB / ≤ 800 KB |
| Chat | 04 | 9:16 | 1080×1920 | 720×1280 | 480×854 | ≤ 1.5 MB / ≤ 700 KB |

Mobile file is served below 1024 via `<source media>`. No device frame, no browser chrome, no status bar in any recording: the window is the frame.

---

## 5b. Status screens (artboards `Estado-1440`, `Estado-390`)

One layout for all four. No sessions exist on this site, so there is no with/without-session variant, and no variant shows a time.

- Header: 72px (56px <768), wall, wordmark "César León" as text at every width (not the monogram) + LanguageSwitch. No index, no Contacto button.
- Body ≥1024: 12-column grid, content in 1 / 10, starting 112px below the header (72px in "500 with code", 88px in offline, so the taller variants stay inside 720px). Order: label (`h6` ink with a 20px icon, gap 10px) → 20px → title (`h1-status`) → 24px → line (20px/1.5 graphite, max-width 34em) → [variant block] → 40px → actions (gap 16px).
- Body <768: padding 136px 24px 0; label → 16px → title 44px → 20px → line 18px/1.5 → [variant block] → 32px → actions stacked, full width, gap 12px.
- `<main>` with the title as `<h1>`; `document.title` = label + " · César León".

| Variant | Label + icon | Title | Line | Variant block | Actions | LightBand |
|---|---|---|---|---|---|---|
| 404 | "Error 404" · `Search` graphite | "Esta página no existe." | "La dirección que abriste no lleva a ningún lado. Puede que el enlace esté mal escrito o que la página se haya movido." | — | primary "Ir al inicio" · secondary "Contacto" (→ `/#contacto`) | θ −22°, `#FFFCF0`, left 84 %, W 360px |
| 500 with code | "Error del sitio" · `TriangleAlert` `#9B2C1F` | "Algo falló de este lado." | "No es tu conexión ni tu equipo. Intenta de nuevo; si sigue igual, envíame este código y lo reviso." | CopyCode, 32px above (24px <768); actions then sit 24px below | primary "Reintentar" (`RotateCcw`) · secondary "Ir al inicio" | θ −42°, `#FFFAEB`, left 108 %, W 300px |
| 500 without code | same | same | "No es tu conexión ni tu equipo. Intenta de nuevo en un momento; si sigue igual, escríbeme y lo reviso." | — | same | same |
| Offline | "Sin conexión" · `WifiOff` `#8A5A00` | "No hay conexión a internet." | "La página vuelve a cargar sola cuando regrese la conexión. Mientras tanto, revisa esto:" | list, 16px above, 18px/1.6 ink (16px <768): "Que el wifi o los datos móviles estén activos." · "Que el modo avión esté apagado." | primary "Reintentar" | **none**: the only screen without light |

- "Reintentar" uses the Button loading state while it retries; offline also retries on the `online` event.
- The code is the error `digest` from Next's `error.tsx`; the variant without code renders when `digest` is undefined.
- EN copy must be written with the same plain voice; nothing in the layout depends on length (titles wrap to 2 lines at 390).

---

## 6. Motion

Everything below is off under `prefers-reduced-motion: reduce` unless stated; the reduced version is described per item.

### 6.1 Window opening (≥1024, motion allowed) — artboard `Ventana`
- Each room is a track `200svh` tall containing a stage `position: sticky; top: 0; height: 100svh`. The section's snap point is the track's start.
- `p = clamp((scrollY − trackTop) / 100svh, 0, 1)`.
- Slot rect `S` = the window's position in the grid (§3). Full rect `F`: for 16:9 → `left 0, top header-h, width 100vw, height 100svh − header-h`; for vertical windows → `height 100svh − header-h − 48px`, width from the ratio, horizontally centered, `top header-h + 24px`.
- `t(p)`: `0` for p ≤ 0.15 · `easeInOut((p − 0.15) / 0.40)` for 0.15–0.55 · `1` for 0.55–0.80 · `1 − easeInOut((p − 0.80) / 0.20)` for 0.80–1.
- The window is absolutely positioned in the stage; its `left/top/width/height` interpolate linearly `S → F` by `t`. The video keeps `object-fit: cover`, so nothing is stretched. Reveal opacity = `1 − clamp(t / 0.3)`. Radius 2px → 0 at `t = 1` for 16:9 only. `z-window-open` while `t > 0`.
- Because `S` differs per room, each window opens from its own side (01 from the right edge, 03 and 08 from the left, 07 from the right without touching the edge, vertical ones travel to the center). Do not add any other per-room effect.
- Text block: `opacity = 1 − clamp((p − 0.15) / 0.15)`, `translateY = −16px × clamp((p − 0.15) / 0.15)`; comes back with `opacity = clamp((p − 0.88) / 0.12)`, translateY back to 0. `visibility: hidden` and inert while opacity is 0.
- VideoControl stays in the window's bottom-right corner throughout.
- Reduced motion: no track, no sticky; every room is `100svh`, window fixed in `S`, poster only.

### 6.2 Stacked layout window (<1024, motion allowed)
- No sticky stage. `clip-path: inset(12%)` → `inset(0)`, linear with the window's vertical center travelling from 90 % to 55 % of the viewport height. Nothing else moves. Reduced motion: `inset(0)` always.

### 6.3 Text entry
- No per-section fade-ups. Text in the rooms is static except the exit/return in 6.1.
- The one orchestrated moment is the first paint of the entrance: LightBand translates from `+8vw` to 0 and opacity 0→1 over 900ms `ease-out`; after 200ms, name, line, support and buttons go opacity 0→1 (no translate), 480ms each, 80ms stagger. Runs once per page load. Reduced motion: everything visible immediately.

### 6.4 LightBand along the page
One fixed layer for the whole page (motion allowed). Its values are keyed to each section's snap position and interpolated linearly (angle, left, width in px; color in sRGB) between consecutive keys by scroll position. `left` is the x of the band's top-left corner, measured at 140px above the viewport, as % of viewport width.

| Section | θ (skewX) | left ≥1024 | W at 1440 | left <1024 | W at 390 | Tint |
|---|---|---|---|---|---|---|
| Entrance | −14° | 70 % | 400px | 80 % | 150px | `#FFFDF2` |
| 01 | −18° | 36 % | 370px | 120 % | 140px | `#FFFDF1` |
| 02 | −22° | 64 % | 350px | 150 % | 135px | `#FFFCF0` |
| 03 | −26° | 78 % | 340px | 150 % | 130px | `#FFFCEF` |
| 04 | −30° | 60 % | 330px | 190 % | 125px | `#FFFCEE` |
| 05 | −34° | 80 % | 320px | 230 % | 125px | `#FFFBED` |
| 06 | −38° | 100 % | 310px | 260 % | 120px | `#FFFBEC` |
| 07 | −42° | 90 % | 300px | 250 % | 115px | `#FFFAEB` |
| 08 | −46° | 118 % | 290px | 290 % | 110px | `#FFFAEA` |
| 09 | −50° | 112 % | 280px | 380 % | 105px | `#FFFAE9` |
| Sobre mí | −56° | 135 % | 280px | 380 % | 110px | `#FFF9E8` |
| Contacto | −62° | 170 % | 270px | 520 % | 105px | `#EAE4D8` |

- W scales with viewport width between 1024 and 2560 as `W₁₄₄₀ × (vw / 1440)`.
- During 6.1 the band keeps moving with the scroll (it is behind the window; the opened 16:9 window covers it).
- Frame-shadow color switches from wall to stone when the Contacto section covers more than 50 % of the viewport.
- Reduced motion: no fixed layer. Each section renders its own static band with its row's values, clipped to the section (`overflow: hidden`), exactly as in the artboards.

### 6.5 Project index update
- Current section = the one containing the viewport's horizontal center line (`IntersectionObserver`, `rootMargin: -50% 0px -50% 0px`).
- The trigger's number and name swap with a 240ms opacity crossfade (no slide); reduced motion: instant. The list's "Estás aquí" row follows the same state. No `aria-live` on the trigger.

### 6.6 Standard patterns
- Accordion/FAQ, tabs, select/dropdown: **not used** in this design. If one is added later: height/opacity 240ms `ease-out`, indicator moves 240ms, instant under reduced motion.
- Active nav indicator: the LanguageSwitch bar and the index "current" bar do not animate; they appear with the new state.
- Popover (index, ≥768): opacity 0→1 and `translateY(−4px → 0)`, 240ms `ease-out`; close 120ms opacity only. Reduced motion: opacity only, 120ms.
- Sheet (index, <768): `translateY(100% → 0)` 480ms `ease-out`, scrim opacity 0→1 240ms; close 240ms. Reduced motion: opacity only, 120ms.
- Hover/active on buttons and links: color and underline 120ms; `translateY(1px)` on active is instant.
- In-page anchors (index, FloorNav, "Ver proyectos", "Contacto", "Volver arriba"): `scroll-behavior: smooth` on `html`; every section has `scroll-margin-top: 0` at ≥1024 (sections already reserve `header-h` as padding, so the section's top edge lands at the viewport top and its content 72px below it) and `scroll-margin-top: 56px` on stacked layout (content lands exactly under the 56px header). Reduced motion: `scroll-behavior: auto`. After the jump, focus moves to the section heading (`tabindex="-1"`).
- Poster→video: 240ms opacity. Loading line: 1200ms linear loop; reduced motion: static line at 38 % width.
- Easing forbidden everywhere: bounce, spring overshoot, elastic.

---

## 7. Implementation order

1. **Tokens** (§1) in the Tailwind v4 theme: colors, type scale with `clamp()`, radii, durations, z-index. Fonts with `next/font`. `::selection`, scrollbar, `scroll-snap`, `scroll-behavior`. → everything depends on this.
2. **Base layout** (§4): container, 12/8/4 grid, side padding per breakpoint, `header-h` variable.
3. **Base components**: Button → TextLink → LanguageSwitch → VideoControl. (need 1)
4. **Header + ProjectIndex** (Popover and Sheet) with static data from `content/projects`. (need 3)
5. **Window** with all video states and the one-video-at-a-time controller. (need 3; posters can be placeholders)
6. **ProjectRoom**: text block + the nine slot configurations of §3 as data (`window: {kind, cols, bleed, revealSide}`, `text: {cols, pad}`, `align`), reduced-motion version first (static, 100svh). (need 2, 5)
7. **Entrance, Sobre mí, Contacto, Footer, FloorNav.** (need 3)
8. **LightBand**: static per-section version first, then the fixed interpolated layer. (need 6, 7)
9. **Scroll choreography**: sticky tracks and window opening (6.1), stacked clip (6.2), entrance moment (6.3), index observer (6.5). (need 6, 8)
10. **Status screens**: `not-found.tsx`, `error.tsx` / `global-error.tsx`, offline page. (need 3)
11. **Brand assets and metadata**: icons, manifest, `opengraph-image` per locale. (need 1)
12. **Real videos and posters** replace placeholders; extreme-content check against artboard `Extremo`.

---

## 8. Decisions and traps

**Deliberate choices that resemble an "AI default"**
- Warm white background: stays, per the brief. It is kept away from "cream + serif + one accent" by a grotesque for everything, two dominant tones (wall and stone) and the light as the signature.
- Small text above the project name (`01 / 09`): it is the room number of a real sequence, not a kicker. No other heading has a label above it, except "Sobre mí" (which **is** that section's heading; the large text under it is a paragraph) and the status labels (required by the brief, always with an icon).
- Three equal columns in Sobre mí: they are the three remaining sentences of one paragraph, set as text with a single brass rule above all three. No icons, no titles, no boxes. Do not turn them into cards.
- The mullion and transom of the light band are stripes, but they are the shadow of the window frame, drawn once; they are not a background pattern. Do not repeat or tile them.
- The light band does not warm up to amber, although the brief asked for "late afternoon" warmth: César rejected the amber version after seeing it. Do not reintroduce `#FDF0D2`, `#FBE8C4`, `#F6DFB4` or any tint more saturated than `#FFF9E8` on the wall. Only the angle (−14° → −62°) tells the time of day.
- Solid header with a hairline: deliberate, so no text or control ever overlaps a video. Do not make it transparent or blurred.
- Pill shapes and saturated colors appear only **inside** the placeholder posters (they imitate client products). Nothing on the page itself is a pill; page radii are 2px and 4px.
- Mono is used for exactly two things: the stack caption and the 500 error code.

**Must look identical between rooms**
- The text block: order, spacing (8 / 12 / 40 / 16 / 24 / 20 / 28 / 12), type roles and the rule above the stack caption.
- The reveal thickness (8px), the control's size and inset, link and caption styling.

**Intentionally different between rooms (do not normalize)**
- Window side, column span, bleed, vertical alignment (center / start / end) and the 09 split. These come from the table in §3 and are data, not variants to be "cleaned up".
- Spacing inside the text block is uneven on purpose (40px before the lead is the only large gap).
- LightBand `left` values are not monotonic; they are placed per room so the band crosses the wall, not the window.

**Easy to get wrong**
- Brass is never text, never an icon color, never a focus ring. On stone it is decorative only (2.2:1).
- The focus ring takes each component's ink: moss for primary button and text links, ink for everything else, ink + wall halo on the video control. Not one accent ring for all.
- The current language and the current index row are marked by weight **and** a bar (and text, in the index), never by color alone.
- 16:9 window height must never exceed the viewport at rest: at 1024 wide with a short viewport, cap the window height at `100svh − header-h − 96px` and let the width follow.
- The opened vertical window does not fill the width; the wall stays at both sides. Do not letterbox it on a dark background.
- The scroll track (200svh) exists only at ≥1024 with motion allowed. The index, anchors and keyboard (Space, PageDown, arrows, Home/End) must keep working natively; no wheel listeners.
- `LightBand`, `Window` and the OG band look related but are three implementations: the page band is a fixed interpolated layer, the icon band is baked into the SVG, the OG band is static. Do not share one component.
- `ProjectIndex` rows and `FloorNav` links are the same destinations but different components (different size, layout and states).
- The "Póster provisional" tag and the "· número provisional" suffix are design-time flags. They must not ship: gate them on missing content and track them in `CONTENT_CHECKLIST.md`.
- Every visible string in this document goes to `messages/{es,en}.json` or `content/projects/<slug>.ts`.

---

## 9. Open questions

| # | Question | Recommendation |
|---|---|---|
| 1 | Real WhatsApp number | Blocked on César. Build the link as `https://wa.me/<number>?text=` with a prefilled greeting per locale. |
| 2 | URLs for every project link, LinkedIn and GitHub | Take them from `content/projects/<slug>.ts`; render a link only when its URL exists. A project with none shows no links row (the rule and caption move up). |
| 3 | Where "Caso de estudio" leads (08, 09) | Link to the project's README on GitHub until a case-study page exists. No new page type is designed. |
| 4 | Site domain (OG strip, canonical) | Use the Vercel production domain until a custom one exists; the OG strip reads it from one env var. |
| 5 | Length of the scroll track (200svh per room = 9 extra viewports) | Start with 200svh. If it feels long in QA, reduce to 170svh and compress the hold to 0.55–0.70; keep the same curve. |
| 6 | Portrait in Sobre mí | Ship without it. If a photo arrives, enable the 10 / 13 slot; on stacked layout it goes above the label at 208px wide. |
| 7 | Square crop of the OG image cuts the name | Accept it. If WhatsApp previews matter most, add a second 1200×1200 image with the "CL" mark and the name stacked and centered. |
| 8 | Brand colors inside the posters | Invented for the placeholders. They disappear when the real first frames replace them. |
| 9 | Email shown as plain text on a public page | Keep it visible (it is the main action) and render it as text + `mailto:`; no obfuscation that would break copy and paste. |
| 10 | English copy for status screens and UI labels | Not written here. Translate from the Spanish strings in this document; keep sentences as short as the Spanish ones. |
