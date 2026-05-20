# AGENTS.md

Static HTML resume deployed via GitHub Pages from `docs/`.

## Build

```sh
bun run build      # production: tailwindcss v4 → docs/build.css (~24 KB)
bun run serve      # dev: watch mode + live-server on ./docs
```

After editing `docs/index.html`, always run `bun run build` before committing.

## Architecture

- `tailwind.css` — source entrypoint. `@import "./docs/fira-go.css"` resolves relative to this file
- `docs/index.html` — the resume. Two A4 pages with 2-column layout via `md:col-count-2`
- `docs/build.css` — compiled output, committed to repo (GitHub Pages serves from `docs/`)
- `data/resume.json` — structured resume content, used by `scripts/generate.js` to produce `docs/index.html`

## Deployment

Push to `master` → GitHub Pages auto-publishes from `docs/`. No CI, no custom domain.

## Conventions

- **CSS columns:** `break-inside-avoid` on individual sections keeps them together. Do NOT wrap the entire EXPERIENCE block in `break-inside-avoid` — it forces all entries into one unbreakable block and breaks the 2-column layout
- **Lockfile:** `bun.lock` is tracked (bun is the package manager)
- **Font URLs** in `docs/fira-go.css` use absolute paths (`/fonts/...`) — works on GitHub Pages domain root
- **Tailwind v4** — CSS-first config in `tailwind.css` (`@theme`, `@utility`), no JS config file
- **Both pages use A4** dimensions (unified from previously using A4 + Letter)
- **Edit workflow:** modify `data/resume.json` → run `bun scripts/generate.js` → run `bun run build`
