# Delivery README

This document summarizes the approach taken for the Address Validator API, the tools involved (including
AI assistance), and how to run the solution locally.

## Thought Process

- Built a production-ready Node.js/TypeScript Express API focused on USPS-aligned address validation.
- Used Spec Driven Development with Speckit to capture requirements, plans, and tasks up front, keeping
  design and implementation aligned with the project constitution.
- Applied provider abstraction (Geocodio by default, heuristic fallback) and in-memory caching to reduce
  duplicate validations while preserving transparency and correctness.
- Prioritized security and reliability early: input validation with zod, rate limiting, security headers,
  structured logging, RFC 7807 error responses, and confidence/reason fields in responses.

## Tools & Automation

- **Frameworks/Libraries**: Express, TypeScript (strict), zod (+ zod-to-openapi), helmet, cors,
  compression, express-rate-limit, morgan.
- **Validation/Parsing**: Geocodio provider adapter with heuristic fallback for offline/dev.
- **Testing**: Jest + supertest with ~95% coverage; linting via ESLint/Prettier; commit hooks via Husky,
  lint-staged, and commitlint.
- **AI & SDD**: Speckit (https://github.com/github/spec-kit) to generate specs, plans, and tasks; Codex
  for assisted development following the constitution and standards in `.docs/`.
- **CLI/Dev**: GitHub CLI for PRs, npm scripts for build/test/docs, dotenv for environment loading.

## Run the Solution Locally

```bash
git clone https://github.com/rafaelbogfreitas/address-validator.git
cd address-validator
npm install

# Configure environment (do not commit secrets)
cp .env.example .env
# Set your Geocodio key and provider choice:
# ENABLE_PROVIDER=geocodio
# GEOCODIO_API_KEY=<your_key_here>
# or use ENABLE_PROVIDER=none to force heuristic fallback

npm run dev          # start API on http://localhost:3000
# Or:
npm test             # run unit/integration tests
npm run coverage     # run tests with coverage report
npm run lint         # lint the codebase
npm run docs         # generate OpenAPI to public/openapi.json
```

## Notes

- API endpoint: `POST /v1/validate-address` with `{ "address": "<free-form>" }`.
- OpenAPI served at `/docs` (JSON) and schema preview at `/docs/schema`.
- Avoid committing real API keys; rotate keys after use.
