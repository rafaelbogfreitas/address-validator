# Address Validator API

Backend API for validating and standardizing US property addresses. The service exposes a single
`POST /validate-address` endpoint that accepts a free-form address and returns structured fields
with validation status, confidence, and reasoning. This README will expand as the project evolves.

## Status

- Stack: Node.js 20, TypeScript (strict), Express, zod, @anatine/zod-openapi, helmet, cors,
  compression, morgan, express-rate-limit, Jest + ts-jest + supertest, ESLint/Prettier, Husky,
  lint-staged, commitlint.
- Endpoint (v1): `POST /v1/validate-address` (uses Geocodio provider when enabled, heuristic
  fallback otherwise)
- OpenAPI: generated from zod schemas and served at `/docs`; schema preview at `/docs/schema`
- Confidence & transparency: responses include `validation_status`, `confidence`, `message`, and any
  corrections; unverifiable flows handled gracefully with reasons.

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

### API Docs

- OpenAPI JSON is served at `/docs` (runtime) and schema preview at `/docs/schema`.
- Generate local artifact: `npm run docs` (writes `public/openapi.json`).
- Contract: `POST /v1/validate-address` (request/response driven from zod schemas).
- Provider selection: set `ENABLE_PROVIDER=geocodio` and `GEOCODIO_API_KEY` in `.env`; set
  `ENABLE_PROVIDER=none` to force heuristic fallback.

## Development

### Prerequisites

- Node.js 20
- npm

### Setup

```bash
npm install
cp .env.example .env  # adjust provider keys/rate limits as needed
```

### Scripts

```bash
npm run dev          # tsx watch src/server.ts
npm run build        # tsc -p tsconfig.json
npm start            # node dist/server.js
npm run lint         # eslint . --ext .ts
npm run format       # prettier --check .
npm run format:fix   # prettier --write .
npm test             # jest --passWithNoTests
npm run coverage     # jest --coverage --passWithNoTests
npm run typecheck    # tsc --noEmit
npm run docs         # generate OpenAPI (writes public/openapi.json)
```

### Current Architecture

- `src/app.ts`: Express app wiring (security middleware, JSON parsing, logging, routing)
- `src/server.ts`: HTTP server + graceful shutdown
- `src/config/`: zod-validated environment loader
- `src/middlewares/`: rate limiting, request ID, RFC 7807 error handling
- `src/schemas/`: zod request/response schemas for address validation
- `src/validation/`: validator interface, heuristic validator, and Geocodio provider adapter
- `src/controllers/`, `src/routes/`: `/v1/validate-address` controller/route
- `tests/fixtures/`: address fixtures for upcoming tests

### Notes

- Husky hooks enforce lint-staged, typecheck, tests, lint, and coverage on relevant git actions.
- Coverage command allows `--passWithNoTests` while tests are being built out.
