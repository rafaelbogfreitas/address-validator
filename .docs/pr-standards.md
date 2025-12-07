# Pull Request Title & Description Standard

Purpose: ensure PRs are descriptive, consistent, and reviewer-friendly with clear context, changes,
risk, and verification steps.

## Title Format

`<type>: <summary>`

- Types (examples): `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `perf`, `ci`.
- Summary: imperative, concise, 72 chars max, no trailing period.
- Include scope in summary when useful (e.g., `feat: add geocodio provider fallback`).

## Description Template (Markdown)

Use all sections; omit none. Keep bullets concise.

```markdown
## Summary

- What the PR changes (high level).
- Why it’s needed (user value or defect fixed).

## Technical Details

- Key implementation points (e.g., new modules, algorithms, integrations).
- Notable decisions or trade-offs.

## Risks & Rollback

- Known risks or edge cases.
- Rollback plan (e.g., revert commit, feature flag toggle).

## Testing

- [ ] Unit: <commands or files>
- [ ] Integration: <commands or files>
- [ ] Manual: <steps or scenarios>
- [ ] Other: <e.g., lint, typecheck, coverage>

## Screenshots / Artifacts (if applicable)

- <links or paths to artifacts> (e.g., OpenAPI, logs)
```

## Additional Guidance

- Reference issues/tickets explicitly (e.g., `Closes #123`).
- Call out schema/API changes and doc updates in Summary or Technical Details.
- Keep Testing section actionable: include commands or test files touched.
- If external APIs/keys used, note required env vars or configuration changes.
