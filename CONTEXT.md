# frappe/lms context
> refreshed 2026-09-25 | upstream default: develop @ b0841ed

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
- `2026-09-24` issue #2717 — AudioBlock.vue detached-mount crash (document.querySelector null + cross-block scoping) — pr-opened (PR #33, fork). Verified: test reproduced the crash on develop before the fix, green after; two regression tests added (AudioBlock.test.ts).
- `2026-09-24` trivial cleanup pass — pr-opened (PR #34, fork). README Docker prereq line names legacy `docker-compose` while commands use modern `docker compose`; plugins.py docstring `additinal`->`additional`; md.py docstring `occurence`->`occurrence`; test_lms_program.py comment `depdendencies`->`dependencies`. Branch fix/doc-typos-and-docker-compose-ref @ 48102c5f. Substantive checks (Vitest, Semgrep Rules, Semantic Commits, Patch) green; Server Tests / UI Tests / Validate-PR-title remain pre-existing fork failures (env/infra + zeke pin), documented in the PR body. Note: `docs.frappe.io/framework/user/en/setting-up-email` (emailAccounts.ts Custom service link) is now 404 with no clear replacement in the framework docs — left unfixed this pass.

- `2026-09-25` self-found clean-code/repo-hygiene gap — committed transient build artifacts removed: `frontend/yarn-error.log` (~195 KB stale Yarn v1 error log from a failed `yarn add editorjs`), empty root `yarn-error.log`, empty `lms/www/__pycache__/__init__.py`; `yarn-error.log` added to `.gitignore`. pr-opened (PR #35, fork, branch chore/remove-committed-artifacts @ 666903c). Verified: all 3 files confirmed present in upstream develop @ b0841ed (via gh contents API) and in fork ls-files; deduped (no upstream/fork PR or issue touches these files; gh search yarn-error/__pycache__ only fuzzy-unrelated hits). Pure artifact deletion + one .gitignore line — no source/test code touched; locally verified via git ls-files before/after and git check-ignore. Fork CI: Vitest, Semgrep Rules, Semantic Commits green; Server Tests + UI Tests fail at fork env/infra setup and Validate PR title fails on every PR (zeke pin) — all pre-existing, documented in body.
- `2026-09-25` trivial cleanup pass (loop-trivial) - pr-opened (PR #36, fork, branch fix/trivial-doc-and-reference-cleanup @ a6681be2). Docker/init.sh malformed shebang `#!bin/bash`->`#!/bin/bash` (script would fail when executed directly); lms/lms/utils.py exchange-rate lookup migrated from deprecated `api.frankfurter.app` to maintained `api.frankfurter.dev/v1` (old host now redirects; same JSON schema/rates, verified 200 with the requests UA the code uses); lms/fixtures/custom_field.json label `Github ID`->`GitHub ID` (matches the frontend's existing `__('GitHub ID')` string); Contribution.md `Github`->`GitHub` brand casing. 4 files, +4/-4, all meaning-preserving token fixes. Verified: bash -n on init.sh, py_compile on utils.py, json.load on custom_field.json, frankfurter.dev 200 via the library's requests-style UA. Fork CI: pending at close-out; expected same pre-existing fork failures (Server Tests / UI Tests / Build / Validate-PR-title zeke pin) documented on every prior PR.

## Mined gaps (discovered, not yet attempted)
- `2026-09-09` docs cleanup (trivial pass): attempted -> pr-opened (PR #16, fork); README screenshot alt/caption typos ("Cerficicate", "Autenticate"), bench-installation.md wrong `get-app` placeholder (`<url-of-your-form>`), docker-installation.md stale legacy `docker-compose` command (compose file is v2-only; repo README already uses `docker compose`). — status: proposed
- `2026-09-09` docs cleanup pass (frappe/lms trivial) — pr-opened (PR #16). README typos (Cerficicate/Autenticate), bench-installation placeholder, docker-installation stale docker-compose cmd. Lesson: all doc hyperlinks verified 200, no dead links; two fork CI failures are pre-existing on upstream develop (course_creation.cy.js iframe timeout; Validate PR title zeke pin).
