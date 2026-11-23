# Design brief — César León · Portfolio

You are a senior product designer. You will design a complete single-page portfolio for the
project described below, and you will also deliver a handoff document for development
(section 9 of this brief) that a frontend developer will use to implement it without
consulting you again. The site is bilingual: design it with the Spanish copy given here; an
English version of every text will exist, so no layout may depend on a text's exact length.

## 1. The project

**What it is:** The personal portfolio of César León, a web developer in Venezuela who builds
websites, web apps, a mobile app and a chatbot for real clients. It shows nine pieces of work,
one per screen, each with a video of the product in use.
**Type:** portfolio (one page per language)
**Audience:** Two kinds of visitor. Small-business clients who are not technical and want to
know "what did you build and could you build mine?". Company recruiters who scan for real,
shipped work and then look at the stack. Both must understand each project in under ten
seconds, so technical vocabulary stays minimal and visually secondary.
**Main action:** Contact César (WhatsApp, email or LinkedIn).
**Language / market:** Spanish (default) and English · Venezuela and Latin America, plus
remote roles abroad.

## 2. Visual personality

**Chosen direction:** "Ático de día" — a penthouse at mid-morning.
**Must convey:** calm, order, quiet luxury, confidence, craft.
**Must NOT look like:** a developer portfolio made of project cards in a grid; a dark
"hacker" site with neon and terminal effects; a template with a gradient hero and badges.

**References:**
- Architecture and interior studio websites (for example the way John Pawson's site lets one
  image own the whole viewport) — specifically for the amount of empty wall around each
  piece and the refusal to decorate.
- Apple product pages — specifically for one product per scroll step with a single
  choreographed movement, not for their typography or color.
- A printed exhibition catalogue — specifically for the small, exact caption next to a large
  work: title, year, medium. The project's stack line should feel like that caption.

**Anchor in the business:** A penthouse apartment seen in daylight: white plaster walls, a
pale stone floor, and the light from a floor-to-ceiling window that travels across the wall
as the day goes on. César chose this image himself: you walk in and everything is in its
place, with large, luxurious empty space.

**Signature element (closed):** the light. A band of daylight, cut by the shadow of the
window's frame, lies across the wall and changes angle and warmth with the scroll: morning at
the entrance, late afternoon at the contact section. The project videos are the "windows":
each project is a room in which one large window (the video) sits beside the text on the
wall, opens until it fills the viewport, and draws back as the next room arrives. How the
light and the windows are drawn is yours to design.

### AI defaults this design must avoid

Generated designs converge on the same handful of choices, and a site built from them looks
like every other one. Before designing, write down in one line what you would do by default
for this project, and do something else. Unless sections 3–4 say otherwise, do not use:

- **Fonts:** Inter, Roboto, Open Sans, Lato, Arial, system defaults, and the "distinctive"
  ones every generator now picks: Space Grotesk, Plus Jakarta Sans, Geist, Fraunces.
- **Color:** purple/violet or purple-to-blue gradients; cyan or neon on near-black; the
  cream background + serif + one accent color look; gradient-filled text; a timid palette
  where every color weighs the same.
- **Composition:** a small rounded icon tile above every card heading; cards nested inside
  cards; a thick colored border on one side of a card; an eyebrow chip or kicker label
  above every heading; numbered section labels when there is no real sequence; one word of
  the headline in a different color; all-caps labels everywhere; the same spacing between
  every block.
- **Effects:** glows and radial halos behind content; grid or stripe backgrounds as
  decoration; thin border + wide soft shadow on every card; marquees; pulsing dots; bounce
  easing; a fade-up on every section (one orchestrated moment beats ten small ones).
- **Copy:** buzzwords ("seamless", "unlock", "elevate", "revolutionize"), aphorisms
  ("Less noise. More signal."), em-dashes in every sentence.

What to do instead: derive the type, the palette and one signature element from the
**anchor** above, give the headings a real size contrast with the body, and let one or two
dominant colors carry the page with a sharp accent. In the handoff's "Decisions and traps",
name each choice that looks like one of the defaults above but is deliberate, and why.

Note on this project: the wall color is a warm white, which sits close to the "cream + serif
+ one accent" look. It is deliberate and stays clear of it through a grotesque (no serif),
two dominant tones (wall and stone) and the light as the signature. Project numbering
(01–09) is allowed: the projects are a real sequence the visitor scrolls through.

## 3. Brand constraints

**Logo:** none — design a typographic monogram "CL" and a wordmark "César León" (section 7).
**Mandatory colors:** none beyond the palette in section 4.
**Mandatory typography:** none beyond section 4.
**Icon / isotype:** design it, derived from the monogram (section 7).
**Favicon, apple touch icon and Open Graph image:** design them (section 7).
**Other:** no cards. No dark mode. Each client project keeps its own colors inside its
video; the page around it stays neutral so nine different brands can live on one wall.

## 4. Starting visual system

### Palette
| Role | Light | Dark | Use |
|---|---|---|---|
| primary | #1E4A3A (moss) | n/a | Links, the contact button, focus. 9.6:1 on background, 6.9:1 on surface |
| secondary | #B08A4A (brass) | n/a | Detail only: a hairline, the edge of the light. Never text |
| background | #FAFAF7 (wall) | n/a | The plaster wall |
| surface | #DDD6C8 (stone) | n/a | Floor, bands, the contact section |
| text primary | #17160F (ink) | n/a | 17.3:1 on background, 12.5:1 on surface |
| text secondary | #5A574E (graphite) | n/a | 6.9:1 on background, 5.0:1 on surface |
| success / warning / error | PROPOSE (only needed for the status screens) | n/a | |
| border / divider | PROPOSE, derived from stone (≥ 3:1 where it is informative) | n/a | |
| selection (background / text) | PROPOSE, from moss or stone, ratio noted | n/a | Distinct from focus and links |
| scrollbar (thumb / track) | PROPOSE, thumb ≥ 3:1 against the track | n/a | Discreet |

You may adjust a hex by a few points if a pair needs it, and you may add tints of the light
(warm white to pale amber) for the signature element. Note every change and its ratio.

**Dark mode:** no.

### Typography
- **Headings:** Schibsted Grotesk — 400, 500, 600 (very large, medium weight)
- **Body:** Schibsted Grotesk — 400, 500
- **Mono:** IBM Plex Mono — 400. Only for the stack line of each project
- **Scale:** PROPOSE. Base 16–18px with a strong jump to the display size: project names
  should be the largest thing on the screen after the video

### Spacing and shape
- Base unit: 4px — every spacing is a multiple of this unit
- Section margins are very wide (roughly 96px on mobile up to 200px on large screens)
- Radii: almost square, 2–4px
- Shadows: none decorative. If the window (video) needs depth, it comes from the light

## 5. Non-negotiable constraints

These apply to **everything** you design. A design that breaks them cannot be implemented
and has to be redone.

- **WCAG 2.1 AA contrast.** Normal text ≥ 4.5:1, large text (≥24px or ≥19px bold) ≥ 3:1,
  input borders and informative icons ≥ 3:1. Check every pair you use and note the ratio.
- **Text over video.** If any text sits on top of a video, it needs a treatment that keeps
  4.5:1 on every frame (a solid panel or a scrim with a stated minimum). Prefer text on the
  wall beside the window.
- **No state is conveyed only by color.** Error, success, selected, active: always color +
  icon, text or shape.
- **No horizontal scroll at 320px width.**
- **Visible, designed focus states**, not the browser's default outline or its absence. The
  ring takes each component's ink color (≥ 3:1), not one accent for every control.
- **Implemented with Tailwind + shadcn/ui (Radix).** Use Tailwind's spacing scale. You may
  propose your own visual treatments: the component is written to measure.
- **Videos are decorative and muted.** Each is an 8–12 second loop recorded from the real
  product. The page must make full sense with every video replaced by its still poster,
  which is what visitors with reduced motion, slow connections or data saving will see.
- **Scrolling stays native.** One project per viewport with scroll snapping is wanted, but
  the visitor must always be able to scroll freely, use the keyboard and jump with the
  index. No scroll hijacking.
- **Target breakpoints:** 360 · 768 · 1024 · 1440 · 1920 · 2560.

## 6. Pages and sections

### Home (one page; `/es` and `/en` are the same design)
| # | Section | Purpose | Content available | CTA |
|---|---|---|---|---|
| 0 | Header and project index | Wordmark, language switch (ES / EN), contact link. A discreet index shows the current project's number and name and lets the visitor jump | Real | Contacto |
| 1 | Entrance | In three seconds: who César is and what he builds. Morning light | Real (section 8) | Ver proyectos · Contacto |
| 2 | Project 01 — Maranatha | One room per project: window (video), name, kind of product, one sentence, three lines, role, stack caption, links | Real text; video pending (poster placeholder) | Ver sitio |
| 3 | Project 02 — Melao | Same structure | Same | Ver demo |
| 4 | Project 03 — Inversiones JS | Same structure | Same | Ver código |
| 5 | Project 04 — Gaby, chatbot de Inversiones JS | Same structure; the video is a chat conversation | Same | Ver código |
| 6 | Project 05 — World Flags | Same structure | Same | Ver demo · Ver código |
| 7 | Project 06 — Workout | Same structure | Same | Ver demo |
| 8 | Project 07 — KREA | Same structure | Same | Ver demo · Ver código |
| 9 | Project 08 — Inversiones JL22 | Same structure | Same | Ver sitio · Caso de estudio |
| 10 | Project 09 — La Nación Radio (app móvil) | Same structure; vertical phone video | Same | Caso de estudio |
| 11 | Sobre mí | Who César is, how he works with a client, what he can build. Afternoon light | Real (section 8) | Contacto |
| 12 | Contacto | The main action. Late-afternoon light, stone surface | Real except the WhatsApp number | WhatsApp · Correo · LinkedIn · GitHub |

Notes for the project rooms:
- The nine rooms share one structure but must not feel like nine copies. Vary the side the
  window sits on, its proportion and how it opens, within one system.
- Three kinds of video exist: desktop web (16:9), phone web or mobile app (vertical, about
  9:19.5) and a chat conversation (vertical). Design the window for the three. Melao,
  World Flags, Workout and the radio app are phone-first.
- The stack caption is small and secondary (mono), like a catalogue caption. The sentence a
  client understands is always larger than the technology.

## 7. States and cases that also need designing

- [x] Loading states: the poster of each video while it loads, and the moment the video
      takes over from the poster
- [x] Video states: playing, paused by the visitor (a visible pause/play control is
      required), poster only (reduced motion or data saving), failed to load
- [x] **Status screens**, as one visual family (minimal header with the wordmark, a label, a
      title in the brand's voice, one line about what happened, actions):
  - [x] **404** — a single one: "Ir al inicio" + "Contacto"
  - [x] **500 with a code** (the code visible and copyable; "Reintentar" + "Ir al inicio")
        and **500 without a code**
  - [x] **Offline** (what to check, "Reintentar")
- [x] Buttons and links: rest, hover, focus, active, disabled
- [x] Project index: rest, current project, hover, focus; how it behaves on mobile
- [x] Language switch: rest, hover, focus, current language
- [x] Navigation on mobile (header and index at 360px)
- [x] Text selection color and scrollbar
- [x] Monogram "CL" and wordmark "César León": legible at 16px, SVG, apple touch icon
      180×180 with an opaque background, maskable version
- [x] Open Graph image template 1200×630
- [x] Extreme content: a project name of 30 characters, a one-sentence line that wraps to
      three lines in English, a stack caption with 3 and with 9 technologies, a project
      with one link and with three

Not needed: maintenance screen, forms, emails, logged-in states, dark mode.

## 8. Content

**Real content available:** all the text below (Spanish). Use it as is.
**Pending:** the nine videos (use a still placeholder that looks like a product screen, at
the right proportion), the WhatsApp number (use "+58 000 000 0000"), a portrait photo of
César (optional; design "Sobre mí" to work without it).

**Entrance**
- Name: César León
- Line: Desarrollo páginas web, aplicaciones y chatbots que la gente usa todos los días.
- Support: Nueve proyectos reales, de una iglesia que recibe aportes en línea a una app para
  aprender a bailar.

**Projects** (name · kind · one sentence · three lines · role · stack caption)

01 · Maranatha · Sitio web con pagos · La iglesia recibe diezmos y aportes en línea.
Los miembros ven la agenda, las prédicas y los proyectos de la iglesia, y aportan desde el
teléfono en dólares, bolívares o pesos. El equipo aprueba cada pago y administra los
proyectos desde un panel privado.
Rol: diseño y desarrollo completo. · Next.js · TypeScript · Postgres · Tailwind

02 · Melao · Aplicación web · Aprende salsa y merengue con un coach que te marca el ritmo.
Lecciones en video paso a paso, práctica con canciones reales y una voz que cuenta los
tiempos mientras bailas. La app recuerda qué pasos te cuestan y te los vuelve a proponer
justo antes de que los olvides.
Rol: producto, diseño y desarrollo. · Next.js · TypeScript · Supabase · Tailwind

03 · Inversiones JS · Panel administrativo · Una tienda de celulares a crédito actualiza su
catálogo en segundos.
El dueño cambia precios, cuotas e inventario desde un panel simple, sin llamar a nadie.
Lo que guarda ahí es lo mismo que su chatbot le responde a los clientes.
Rol: desarrollo completo. · Next.js · TypeScript · Postgres · Better Auth

04 · Gaby · Chatbot · Una asistente que atiende a los clientes de la tienda por chat.
Responde qué equipos hay, cuánto es la inicial y las cuotas, toma solicitudes y agenda
citas a cualquier hora. Avisa a los clientes cuando se acerca la fecha de su pago.
Rol: desarrollo completo. · TypeScript · Bun · Postgres · Docker

05 · World Flags · Juego para aprender · Memoriza las banderas, países y capitales del mundo.
Tres juegos cortos que se adaptan a ti: repiten lo que olvidas y espacian lo que ya sabes.
Se instala en el teléfono como una app.
Rol: producto y desarrollo. · Astro · React · TypeScript · Supabase

06 · Workout · Aplicación web · Registra tu entrenamiento de fuerza desde el gimnasio.
Abres el día, ves qué te toca y anotas cada serie con una mano. La app calcula cuánto peso
y cuántas repeticiones hacer la próxima vez.
Rol: producto y desarrollo. · Next.js · TypeScript · Postgres · PWA

07 · KREA · Portal escolar · Los estudiantes entienden su nota y los profesores evalúan en un
minuto.
Reemplaza una hoja de Excel: cada alumno ve cómo se evaluó cada pregunta, su equipo y el
ranking en vivo. Los profesores crean tareas, califican con rúbrica y administran los equipos.
Rol: diseño y desarrollo completo. · Next.js · TypeScript · Postgres · Tailwind

08 · Inversiones JL22 · Tienda en línea · Una tienda en Colombia despacha pedidos sin errores.
Cada pedido sale con una factura con código QR. En bodega lo escanean para cerrarlo, y el
equipo recibe reportes de envíos listos para imprimir.
Rol: desarrollo a medida sobre la tienda existente. · WordPress · WooCommerce · PHP

09 · La Nación Radio · Aplicación móvil · La radio, los podcasts y las noticias en una sola app.
Radio en vivo con un reproductor que te acompaña por toda la app, noticias por categoría,
videos y un directorio de empresas con buscador.
Rol: desarrollo de la app. · Flutter · Dart

**Sobre mí**
Soy César León, desarrollador web con unos tres años construyendo productos para clientes
reales. Trabajo de principio a fin: entiendo el negocio, propongo la solución, la construyo
y la dejo funcionando. Hago sitios web, tiendas en línea, paneles administrativos,
aplicaciones y chatbots. Hablo claro, entrego por etapas y cada avance se puede ver y probar.

**Contacto**
- Title: ¿Tienes un proyecto en mente?
- Line: Cuéntame qué necesitas y te respondo el mismo día.
- Actions: WhatsApp · alejandrorey2654@gmail.com · LinkedIn · GitHub

**Status screens:** write the copy in the same plain, calm voice.

For what is pending, use realistic text in Spanish with the length the final content
will have — **never lorem ipsum**. A design validated with lorem breaks when the real copy
arrives, and the developer pays for that break.

---

## 9. Deliverable — MANDATORY

Deliver **two things**. The second is as important as the first.

### 9.1 The design

Every page of section 6 at desktop 1440 · mobile 390, with the states of section 7.
If you can export the pages as HTML, include that export: it is checked against section 2's
"AI defaults" before development starts.

### 9.2 `HANDOFF.md` — the handoff document for development

A self-contained Markdown document, written for a senior frontend developer who **did not
see the design with you and cannot ask you anything**. Whatever is not here, they will have
to invent — and that is where the design drifts.

Exact structure:

**1. Tokens** — a complete table of final values, with token name, value and use: colors
(light and dark, with the verified contrast ratio of each pair used, including selection
and scrollbar), type scale (size / line height / weight / tracking per role: display,
h1-h6, body, small, caption), spacing, radii, shadows, animation durations and curves,
z-index.

**2. Components** — one by one, and for each:
   - Name, and if it maps to a shadcn/ui component, which one
   - Anatomy (which parts make it up)
   - Variants and sizes
   - **Every** state: rest, hover, focus, active, disabled, loading, error
   - Concrete measurements: padding, height, gap, icon size, border width
   - Responsive behavior
   - Accessibility notes: role, expected accessible name, keyboard behavior

**3. Sections** — one by one, in section 6's order, and for each:
   - Layout structure (grid or flex, columns, gaps, max width)
   - Which components it uses
   - Vertical spacing before and after
   - **How it reorders or collapses at each breakpoint** (explicit, not "it is responsive")
   - Content: what is real text and what is a placeholder

**4. Global grid and layout** — container max width, number of columns and gutters per
breakpoint, side padding per breakpoint, vertical rhythm between sections.

**5. Assets** — a list of everything to export or obtain: images (with dimensions and
format), icons (with the set they come from), illustrations, the logo in its variants, and
the brand assets: source icon (SVG), favicon, apple touch icon 180×180, maskable icon and
the Open Graph image template 1200×630 (which text it carries and which area is safe when
cropped). For each project video: the exact proportion and pixel size to record, for
desktop and for mobile.

**5b. Status screens** — for each variant in section 7: layout, copy, actions, what changes
between variants (with/without session, with/without a code, with/without a time) and how
it looks on mobile.

**6. Motion** — what animates, with which duration and curve, and what turns off under
`prefers-reduced-motion`. At least, how each of these opens, closes or switches:
accordion/FAQ, tabs and the active nav link indicator, select/dropdown, dialog/sheet, and
the scroll of in-page anchor links (smooth, and how far below the sticky header it lands).
For this project also, as exact values tied to scroll progress: how the window (video)
opens and draws back in each project room, how the text enters, how the band of light moves
and changes warmth from section 1 to section 12, and how the project index updates.

**7. Implementation order** — the recommended sequence to build it, from tokens to base
components to sections to pages, with the dependencies between steps marked.

**8. Decisions and traps** — the design decisions you took and why (so the developer does
not "fix" them by accident), plus what is easy to implement wrong: what must look identical
between sections, which spacing is intentional even if it looks inconsistent, what must not
become a shared component even if it looks like another one.

**9. Open questions** — what you could not decide for lack of information, with your
recommendation for each.

Format of the whole handoff: concrete values, never adjectives. "24px", not "generous
spacing". "#1E293B on #F8FAFC, ratio 14.8:1", not "dark gray on light gray".
