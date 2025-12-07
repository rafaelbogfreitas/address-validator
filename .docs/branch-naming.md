# Branch Naming Standard

Purpose: keep branches readable, consistent, and discoverable across the team and CI.

## Format

`<type>/<short-description>`

- `type` (lowercase): `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `perf`, `ci`.
- `short-description`: 3–6 words, kebab-case, imperative/concise.
- Optional scope prefix inside description if helpful (e.g., `api-`, `validation-`, `docs-`).

### Examples

- `feat/address-validation-endpoint`
- `fix/rate-limit-config`
- `docs/pr-standards`
- `refactor/cache-layer`
- `chore/deps-update`

## Guidance

- Create branches from `main` unless coordinating off a feature branch.
- One logical change per branch; avoid combining unrelated work.
- Keep names ASCII, no spaces, no uppercase, no long IDs; reference tickets in PRs instead.
- Delete merged branches in origin to reduce clutter.
