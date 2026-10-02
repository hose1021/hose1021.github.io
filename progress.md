# Progress

## Current State

- Last Updated: 2026-10-02
- Active Feature: feat-006 (content truth pass)
- Branch: redesign/resume-site off main

## What's Done

- Design overhaul (feat-001 - feat-005): oklch token system with light/dark variants, full-bleed screen
  lines, stripe dividers, nine counted panels, a 15-icon lucide subset, self-hosted Inter and Geist
  Mono, and the vanilla-JS behaviours (theme toggle, flip sentences, scroll-spy nav, copy buttons).
- Test harness: `./init.sh` installs, syntax-checks the generator, regenerates and rebuilds, resolves
  every local asset reference, and fails when a hand-edited `docs/` artifact drifts from a clean build.
- Committed build freshness (feat-002) and local asset references (feat-003) hold in a fresh clone.
- feat-006 content truth pass, complete:
  - Every claim on the page now traces back to the verified CV: the Dukascopy bullets describe the
    workflow rule engine (103 rule classes, 18 validators), the 145 HTTP endpoints (63 API, 81 web)
    and the 96-method JSON-RPC layer, the PHP 8.2 migration, the GDPR erasure pipeline, the S3 and
    Azure Blob storage provider, ActiveMQ over STOMP with Oracle PL/SQL, and `dukascopy/handlersocket`.
  - Buylink appears as part-time advisory work with the three things actually done (PostgreSQL to
    MySQL migration, Docker and CI environments, releases 1.3.4 to 1.4.3).
  - The project set is now LevelUp / Eimtahan.az, Bakutrend, the MMMC Platform and pit.
  - Two projects link to their public repository; the two without a public URL show no link.
  - Hard-coded meta keywords refreshed to the stack actually claimed.

## What's In Progress

- Nothing. feat-006 is finished; the page is regenerated and committed.

## What's Next

- Review the regenerated page at 390px, 768px, 1024px and 1280px with `bun run serve`, then merge to
  `main`; Pages publishes from `main`.
- Three content decisions still open and owned by the user: the detail behind the Seopa bullets, the
  exact Dukascopy end date, and the wording of the MSU degree.

## Blockers / Risks

- `taglines` restate the summary; they are honest but may read as redundant.
- Attribution: the CSS utilities and token names in `tailwind.css` derive from an MIT-licensed design
  system, and no `NOTICE` file exists. Revisit before redistributing this repository.

## Decisions Made

- Page content is generated from `data/resume.json` only; nothing else in the repository carries claims.
- A project shows a link only when a public URL exists; no placeholder links.
- Telegram stays in the footer, because `siteFooter()` reads it from `basics.urls`.

## Files Modified This Session

- `data/resume.json` - content rewritten around the verified career facts
- `scripts/generate.js` - project titles link out when a URL is present; single-month periods; meta keywords
- `docs/index.html`, `docs/build.css` - regenerated
- `progress.md`, `feature_list.json`, `session-handoff.md` - this update

## Evidence of Completion

| Check | Command | Result |
|---|---|---|
| Full verification | `./init.sh` | pass, exit 0 |
| Generator syntax | `node --check scripts/generate.js` | pass |
| Build freshness | regenerate, `git status --porcelain docs/` | clean after commit |
| Project links | generated page probe | 2 project links, both https |
| Stale claims | grep the generated page for superseded stack terms | 0 hits |

## Notes for Next Session

1. Read `AGENTS.md`.
2. Run `./init.sh` before editing.
3. Content changes go into `data/resume.json`, then regenerate and commit the generated `docs/` output
   in the same commit.
