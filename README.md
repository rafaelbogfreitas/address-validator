# Address Validator API

Backend API for validating and standardizing US property addresses. The service exposes a single
`POST /validate-address` endpoint that accepts a free-form address and returns structured fields
with validation status, confidence, and reasoning. This README will expand as the project evolves.

## Using Speckit

Speckit templates live in `.specify/templates/` (tooling: https://github.com/github/spec-kit).
Common commands (run from the repo root):

- Generate a feature specification: `/speckit.spec --feature <name> --args "<user request>"`
- Produce an implementation plan: `/speckit.plan --feature <name>`
- Create tasks from a spec/plan: `/speckit.tasks --feature <name>`

Each output inherits the Constitution in `.specify/memory/constitution.md`; ensure the Constitution
Check passes before proceeding with design or implementation.

## Documentation (.docs)

Project standards, best practices, and guidance for AI/automation agents are kept in `.docs/`.
- Commit message standard: `.docs/commit-messages.md`
- Additional standards will be added here to bound agent behavior and maintain consistency.
