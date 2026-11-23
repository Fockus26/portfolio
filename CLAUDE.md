# Portafolio de César León

Portafolio personal de César León: una página en español e inglés con nueve proyectos
reales, uno por pantalla, cada uno con un video del producto en uso.

**Type:** landing (portfolio) · **Client:** César (proyecto propio)
**Phase track:** Landing · **Git mode:** pr (see `context/GIT_STATE.md`)
**Kit:** web-agent-kit, version in `.kit-version` (updated with `/kit-update`) ·
**Deployment:** Vercel `portfolio` · preview per PR

**Language:** talk to César in Spanish — questions, reports, PR titles and bodies, commit
descriptions. Site copy in Spanish and English. Code and comments: like the code around them.

---

## What to read — by levels, not everything

**Always:** this file + `context/CURRENT_PHASE.md` (one screen: what is open and what blocks).

**Per task** — only the row that applies:

| If the task… | Also read |
|---|---|
| touches UI (component, section, page, styles) | `context/DESIGN_RULES.md`, and `COLORS.md` / `DESIGN_TOKENS.md` / `TYPOGRAPHY.md` only if it touches color, spacing or type |
| implements something from the design | that piece's part of `design/HANDOFF.md`, not all |
| touches data, auth, payments or API | `context/PROJECT_CONTEXT.md` › Stack and services |
| opens or closes a unit | `git-flow` skill + `context/GIT_STATE.md` |
| arrives with an orchestrator prompt | **only** what the prompt cites: it brings paths, lines and decisions |

**Search, don't read:** `decisions/`, `CONTENT_CHECKLIST.md`, inventories, `PHASE_LOG/` —
`grep` the word or ID (`grep -rhi "^# D.*modal" context/decisions/`: decided? don't
re-litigate it) and open only what comes up.

**The kit's `reference/…`** = `~/.claude/kit-reference/…` (or `.claude/kit-reference/…`).
**Tech refs:** vercel → its `tech/<name>.md` when the task touches it; only these. To VPS: `tech/migrate-<from>-vps.md`.

---

## Stack

- Next.js 16 (App Router) + strict **TypeScript**
- **Component library:** shadcn/ui · **Styling:** Tailwind v4 — only one
- **bun** for everything — never npm, yarn or pnpm
- `next-intl` (`/es`, `/en`) · Motion (`motion/react`) · no database, auth or payments

```bash
bun run build · typecheck · lint
bun run test:related         # while working; `bun run test` (whole suite) before the PR
bun run shots                # PR screenshots; then `shots:publish` → .pr-shots/README.md
bun run context:backup       # local context/ → branch context-state (context:restore)
```

**Dev server:** César starts it, except the QA agents and workers he authorizes (each on its
port). Build, typecheck, lint and tests run without asking.

**QA:** `bun run qa:local -- --port <p> --offline` — the site has no database or accounts
(guest only). Playwright scripts run with `node` (Bun hangs on Windows), in `.qa/`.

**Docs:** Context7 before any library API. **Model per task:** `Modelo recomendado: <model ·
effort>` before each (kit `TOKEN-ECONOMY.md` §12; risk → `opus`), both passed to `Agent(...)`.

---

## How work is done here

One unit at a time (a component, section, screen, flow or bounded fix), something
reviewable in two minutes. One unit = one branch = one PR.

```
[git-flow: open]  →  implement  →  test:related  →  [a11y]  →  [seo if it applies]
   →  build + typecheck + lint + test  →  screenshots (if the UI changed)
   →  prune and back up context/  →  [git-flow: close → PR (or pause + local merge)]
```

- **`pr` mode:** commit and push your branch without asking — César approves in the PR
  review. **Never** push to `main`, `gh pr merge` or auto-merge.
- **Cloud session** (`CLAUDE_CODE_REMOTE=true`): `cloud-session` skill at start and close;
  it overrides the rule above (each unit ends merged: PR + green CI).
- **`local` mode:** no commit without César's explicit approval (`git-flow` pause).
- **Version:** nobody touches `version` or `CHANGELOG.md`. Visible change →
  `.changeset/<desc>.md` (`git-flow` §2.1.3). The `chore(release): versión` PR is opened by
  the Action and merged by César.
- Nothing destructive: no `reset --hard`, `push --force`, history rewriting or deleting
  branches.

### What goes in the repo and what is local

In git: `.kit-version`, `content/`, `design/`, and `context/` PROJECT_CONTEXT, DESIGN_RULES,
COLORS, DESIGN_TOKENS, TYPOGRAPHY, decisions/. Local (gitignored; **no backup: the repo is
public and `context:backup` refuses**): CURRENT_PHASE, CONTENT_CHECKLIST, KIT_FEEDBACK,
GIT_STATE, inventories, PHASE_LOG/, plans/.
`.env.local` comes from `vercel env pull`, never hand-edited. Worktrees (pool slots,
`.claude/worktrees/`) have the `.env*` but not the local `context/`: it lives in the main
folder (first line of `git worktree list`); without write access there, return the changes
in your report.

### Quality gates

`a11y` whenever UI is touched · `seo` at init and when a section or page with content
closes · `git-flow` opening and closing each unit · `orchestrate` for a list or a phase in
waves · `wave-qa` after a wave with risk flows · `functional-qa` when a risk flow closes and
at the version QA · `design-qa` only at the version QA (phase 09 / release PR).

---

## Non-negotiable rules

- **Zero magic values.** Every color, spacing, radius and size comes from the tokens.
- **Zero secrets in the code.** Environment variables, `.env.example` without real values.
- **Zero invented content.** Flagged placeholder + row in `context/CONTENT_CHECKLIST.md`.
- **Zero lorem ipsum.** A realistic placeholder, in Spanish, with the final text's length.
- **WCAG 2.1 AA** minimum: 4.5:1 text, visible focus, no state only by color, no horizontal
  scroll at 320 px.
- **The project's library before reimplementing** a primitive.
- **Every visible text** comes from `messages/{es,en}.json` or `content/projects/<slug>.ts`;
  none hardcoded in a component. Plain language: no "API", "backend", "dashboard" in copy.
- **Videos and screenshots use demo data**, never a client's production.

## When to stop and ask

- A handoff value is missing → ask, do not estimate it from the mockup.
- New visual decision → 3 options with real pros and cons, and wait (a background worker
  picks the conservative one and explains it in the PR).
- Accessibility rule broken → the rule wins. Problem in closed code → report it, not fixed in
  this unit. Unused file → point it out, **do not delete it**.

## Kit feedback

César corrects what you did following the kit, asks for something twice, does by hand what
the kit could do, or the kit is silent → a row in `context/KIT_FEEDBACK.md` (or +1 in
"Times"), without asking, announced in one line. `/kit-feedback` sends it to the kit.

---

## Project context

**Audience:** clientes no técnicos y reclutadores · **Main action:** contactar a César (WhatsApp, correo, LinkedIn) · **Tone:** calmado, ordenado, llano · **Language:** ES (default) + EN

**Particulars:**
- Direction "Ático de día" (D003): no cards, no dark mode; the light is the signature
  element and the videos are the "windows". brass `#B08A4A` is never text.
- One video active at a time (the visible screen); poster under `prefers-reduced-motion`.
  Native scroll with proximity snap, never hijacked (D002).
- Project entries and READMEs come from the `project-showcase` skill
  (`~/.claude/skills/project-showcase`); type in `content/types.ts`.
- This laptop's disk is slow under load: one build at a time (`context/GIT_STATE.md`).
