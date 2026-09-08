# frappe/lms context
> refreshed 2026-09-09 | upstream default: develop @ f4f546b6

## Identity & policies
- upstream: frappe/lms, default branch `develop`, primary language Vue (Frappe/Python app), English-first (yes; README/docs/UI strings all English).
- CLA/DCO: none (no CLA bot, no DCO required).
- AI-assisted PR policy: unstated (Contribution.md silent; no ban, no requirement).
- signed commits required: no (`signed_commits_required:false`, verified in vetted-repos.jsonl policy passport).
- PR template: none (root, .github, and frappe/.github all have no PULL_REQUEST_TEMPLATE) -> use pipeline 3-section fallback body.
- external tracker: github.
- trivial/drive-by PRs: not banned (bans_trivial:false); AI disclosure NOT required (ai_disclosure_required:false).

## Conventions (verified from merged PRs)
- branch naming: dominant `fix/...` / `feat/...` (raizasafeel, michellealva, FawazAlhafiz); bots use `pot_develop_*`, `main-hotfix`, `develop`.
- commits: Semantic (commitlint + semantic.yml); use Conventional Commits `type(scope): subject`.
- CI: ci.yml (server), frontend-tests.yml (vitest), linters.yml, ui-tests.yml (cypress), build.yml. Semantic PR check workflow fails on ANY PR (pins zeke/semantic-pull-requests@main which has no action.yml at main) — pre-existing repo issue, not caused by fork.
- outside PRs merged recently and responsively: #2710, #2652, #2564, #2641, #2645, #2573 etc. (external contributors merged within ~1-2 weeks, several in last 2 weeks).

## Maintainer picture
- active maintainer: raizasafeel (merges most PRs; recent merged #2710, #2691, fix/readme-monschool-link #2698). Also michellealva, FawazAlhafiz contributing fixes.
- areas actively worked: quiz authoring redesign, lesson parsing, Raven integration. Avoid duplicate claims there.

## Issue-area health
- issues are GitHub-native and actively triaged. Some older gaps already have in-flight/stalled PRs (e.g. #2476 duplicate course cards had competing PR #2544).

## Gap ledger (dedupe — READ FIRST, never re-pick)
- `2026-08-18` issue #2663 — UploadPlugin.vue over-limit file upload validation — pr-opened-green (PR #2, fork). Lesson recorded.

## Mined gaps (discovered, not yet attempted)
- `2026-09-09` docs cleanup (trivial pass): README screenshot alt/caption typos ("Cerficicate", "Autenticate"), bench-installation.md wrong `get-app` placeholder (`<url-of-your-form>`), docker-installation.md stale legacy `docker-compose` command (compose file is v2-only; repo README already uses `docker compose`). — status: proposed
