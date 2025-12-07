# Quickstart: Address Validation API

**Feature**: specs/001-address-validation/spec.md  
**Branch**: 001-address-validation  
**Date**: 2024-12-06

## Prerequisites

- Node.js 20 (LTS)
- npm
- Environment file `.env` with: `PORT`, `NODE_ENV`, `ENABLE_PROVIDER=usps|smarty|none`,
  provider API keys (if used), `RATE_LIMIT_WINDOW`, `RATE_LIMIT_MAX`.

## Install

```bash
npm install
```

## Scripts

```bash
npm run dev          # tsx watch src/server.ts
npm run build        # tsc -p tsconfig.json
npm start            # node dist/server.js
npm run lint         # eslint . --ext .ts
npm run format       # prettier --check .
npm run format:fix   # prettier --write .
npm test             # jest --passWithNoTests
npm run coverage     # jest --coverage (>=90%)
npm run typecheck    # tsc --noEmit
npm run docs         # generate OpenAPI from zod schemas
```

## Running the API (dev)

```bash
npm run dev
```

Call the endpoint:

```bash
curl -X POST http://localhost:3000/v1/validate-address \
  -H "Content-Type: application/json" \
  -d '{"address":"1600 pennslyvnia ave, washngton"}'
```

## Documentation

- OpenAPI served at `/docs` (read-only) after build/start.
- Contract details: `specs/001-address-validation/contracts/validate-address.md`.

## Testing

- Unit tests: parsers/normalizers and validation heuristics.
- Integration tests: `/v1/validate-address` covering valid, corrected, unverifiable, invalid JSON,
  and rate limiting.
- Golden fixtures for USPS abbreviations and tricky inputs.
