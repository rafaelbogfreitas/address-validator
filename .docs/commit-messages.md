# Commit Message Standard

Purpose: keep history readable, traceable, and automation-friendly while signaling impact on the
address validation API and its documentation.

## Format

`<type>(<scope>): <summary>`

- `summary` is imperative, 72 chars max, no trailing period.
- `scope` is optional when unclear; prefer concrete areas like `api`, `parser`, `normalization`,
  `validation`, `security`, `perf`, `tests`, `docs`, `infra`, `tooling`.
- Use lowercase for type and scope.

## Types

- `feat` — new user-visible behavior or endpoint capability.
- `fix` — bug fix or correctness change.
- `docs` — documentation only (including specs and standards).
- `test` — tests only (unit, integration, contract).
- `refactor` — code change without behavior change.
- `perf` — performance improvement without functional change.
- `build` — build tooling or dependencies.
- `ci` — continuous integration or automation.
- `chore` — repo maintenance with no product impact.
- `revert` — explicit rollback of a prior commit (reference the hash).

## Body (when needed)

- Explain what and why; omit the how unless it clarifies intent or trade-offs.
- Note user-visible effects (e.g., corrected address formatting) and risks.
- Call out performance or security considerations when touched.
- For multi-part changes, list key points as bullets.

## Footers

- `BREAKING CHANGE: <description>` — required for backward-incompatible behavior.
- `Refs: #123` or `Fixes: #123` — link related issues/tickets.
- `Co-authored-by: Name <email>` — for paired work.

## Guardrails

- One logical change per commit; avoid WIP commits on shared branches.
- Keep commits that modify contracts in sync with OpenAPI/docs/test updates.
- Do not push merge commits; rebase or squash as team policy allows.
- Ensure lint/tests relevant to the change pass before committing when feasible.

## Examples

- `feat(api): add confidence and reason fields to validation response`
- `fix(parser): preserve directional suffix when normalizing street names`
- `docs: document commit message standard`
- `perf(validation): cache zip to city/state lookups`
