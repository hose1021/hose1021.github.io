# AGENTS.md

Static HTML resume deployed via GitHub Pages from `docs/`.

## Startup Workflow

Before writing code:

1. Run `./init.sh` — if baseline verification fails, repair that first, before adding scope.
2. Read `feature_list.json` — pick exactly one unfinished feature.
3. Read `progress.md` — current state and the recommended next step.
4. Read `data/resume.json` (content source of truth) and `tailwind.css` (style source of truth).

## Build

```sh
bun run build      # production: generate + tailwindcss v4 → docs/build.css (~40 KB)
bun run serve      # dev: watch mode + live-server on ./docs
bun run generate   # regenerate docs/index.html from data/resume.json
```

## Architecture

- `tailwind.css` — source entrypoint. Imports `tailwindcss` and `./docs/fonts.css`; holds the oklch design tokens, the `dark` and `pointer-fine` variants, the screen-line utilities and the typeset list
- `docs/index.html` — the resume. One scrolling page in a 768px column: sticky header, hairline panels, diagonal-stripe dividers. No fixed page size, no print layout
- `docs/build.css` — compiled output, committed to repo (GitHub Pages serves from `docs/`)
- `data/resume.json` — structured resume content (`taglines`, `professionalDevelopment`), used by `scripts/generate.js` to produce `docs/index.html`
- `data/icons.json` — inner SVG markup of the 15 lucide icons the page uses; `generate.js` wraps them in `<svg>`
- `docs/fonts.css` + `docs/fonts/*.woff2` — Geist Sans and Geist Mono (OFL 1.1)

## Deployment

Push to `main` → GitHub Pages publishes `docs/` as a branch deploy (`build_type: legacy`, source `main:/docs`). No Actions workflow, no CI, no custom domain. `docs/.nojekyll` keeps Jekyll out of the path, so the deploy is a plain static copy. The site is a user Pages site, so `docs/` maps to the domain root and the `/fonts/...` URLs in `docs/fonts.css` resolve.

## Conventions

This project has one design language and it is deliberate. Keep new markup in that language; do not invent a second style.

- **Theme:** `class="dark"` (or `"light"`) on `<html>`, stored in `localStorage` under `theme`, otherwise the system preference. A pre-paint script in `<head>` sets it, the header button and the `D` hotkey toggle it
- **Colours:** every colour is an oklch token in `:root` / `.dark`, exposed to Tailwind through `@theme inline` (`bg-background`, `text-muted-foreground`, `border-line`). Never write a raw colour in markup
- **Two border tokens:** `border` for panel edges, `line` for internal dividers. `--line` is a `color-mix` of border and background, so dark mode reuses the light declaration
- **Typography:** Geist Sans for prose, Geist Mono for every date, label, count and tag. This split is the design
- **Screen lines:** `screen-line-top` / `screen-line-bottom` draw a full-bleed hairline through `:before`/`:after` at `left:-100vw; width:200vw`. Use them instead of `border-b` on sections
- **Panels:** `.stripe-divider h-(--separator-height)` between `<section data-slot="panel">` elements; panels carry `border-x`, titles use `text-3xl font-medium tracking-tight` with a `sup` count
- **Icons:** from `data/icons.json` via `icon()` / `iconTile()` in the generator. Add an icon by adding its inner markup to that file
- **Lockfile:** `bun.lock` is tracked (bun is the package manager)
- **Font URLs** in `docs/fonts.css` use absolute paths (`/fonts/...`) — works on GitHub Pages domain root
- **Tailwind v4** — CSS-first config in `tailwind.css` (`@theme`, `@custom-variant`, `@utility`, `@layer`), no JS config file
- **`source(none)` is load-bearing:** the import is `@import "tailwindcss" source(none);` plus explicit `@source` files. With auto-detection on, Tailwind scans its own `docs/build.css` output, re-adds the classes it finds there, and every rebuild changes the file. Keep auto-detection off and list sources by hand
- **Edit workflow:** modify `data/resume.json` → run `bun scripts/generate.js` → run `bun run build`

## Working Rules

- **One feature at a time**: take exactly one unfinished entry from `feature_list.json`.
- **Stay in scope**: `data/resume.json`, `data/icons.json`, `tailwind.css` and `scripts/generate.js` are the only files you edit by hand. `docs/index.html` and `docs/build.css` are generated output — regenerate them, never patch them.
- **Verify before claiming done**: run `./init.sh`; a claim without its output is not evidence.
- **Leave a clean tree**: no stale generated file, no leftover scratch script.

## Definition of Done

A feature is done only when all of these hold:

- [ ] Source files changed (`data/resume.json`, `tailwind.css`, or `scripts/generate.js`)
- [ ] `./init.sh` passes end to end
- [ ] `docs/index.html` and `docs/build.css` regenerated, so the committed output matches the sources
- [ ] Evidence (command + observed result) recorded in `feature_list.json` `evidence` and in `progress.md`

## Verification Commands

```sh
./init.sh                     # full path: install, generate, build, asset check
bun run generate              # regenerate docs/index.html only
bun run build                 # generate + minified CSS
node --check scripts/generate.js
```

`./init.sh` is also the content test: it regenerates `docs/index.html` and `docs/build.css` and fails when the committed files differ from `data/resume.json` and `tailwind.css`.

## End of Session

Before ending a session:

1. Update `progress.md`: what moved, blockers, next step.
2. Update `feature_list.json`: `status` and `evidence` for the feature you touched.
3. Update `session-handoff.md`: objective, files changed, recommended next step.
4. Leave the repository restartable — `./init.sh` must pass from a clean checkout with no manual setup.

## Escalation

- **Content decision** (what the resume should say): ask the user; do not invent experience, dates or claims.
- **Layout decision**: change `tailwind.css`, then check the rendered `docs/index.html` in a browser.
- **Repeated `./init.sh` failure**: stop, record the failing command and output in `progress.md`, and report it.
