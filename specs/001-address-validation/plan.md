# Implementation Plan: Address Validation API

**Branch**: `001-address-validation` | **Date**: 2024-12-06 | **Spec**: specs/001-address-validation/spec.md
**Input**: Feature specification from `/specs/001-address-validation/spec.md`

## Summary

Deliver a production-ready `/v1/validate-address` API that accepts free-form US addresses and returns
USPS-compliant structured fields with validation status, confidence, and rationale. Primary
validation will leverage a Geocodio provider adapter with a local heuristic fallback for
resilience/dev/offline. Enforce security middleware, rate limiting, strict validation via zod,
OpenAPI generation, and a comprehensive test suite (Jest + supertest) with coverage gates adjusted
during early implementation.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: Node.js 20 (LTS), TypeScript strict  
**Primary Dependencies**: Express, zod, @anatine/zod-openapi, helmet, cors, compression, morgan,
express-rate-limit, tsx/ts-node; Geocodio provider adapter via modular interface with heuristic
fallback  
**Storage**: None (stateless API; provider integrations external)  
**Testing**: Jest + supertest; coverage targets staged (statements/lines 90, functions 80, branches
60 during US1)  
**Target Platform**: Linux container/VM server  
**Project Type**: Backend API (single service)  
**Performance Goals**: <500 ms typical response; track p95 latency; resilience under rate limit load  
**Constraints**: USPS-compliant normalization; US-only; no auth/billing in v1; RFC 7807 errors; no
stack traces; rate limit ~60 req/min/IP; Geocodio subject to API quota/timeouts with fallback to
heuristic  
**Scale/Scope**: Single endpoint with provider adapter; extensible for more providers/countries

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Validate `/validate-address` contract: structured fields (`street`, `number`, `city`, `state`,
  `zip_code`, `validation_status`, `confidence`, `reason`) and status semantics (valid, corrected,
  unverifiable) upheld.
- Ensure parsing/normalization rules target USPS-compliant output; unclear fields marked instead of
  guessed.
- Confirm graceful degradation: best-effort responses without hard failures; corrections are
  explicitly noted.
- Security review: input sanitization, no stack traces in responses, rate limiting/abuse protections
  defined.
- Performance target documented (e.g., sub-200ms p95 under expected load) with measurement plan.
- Test plan covers unit + integration edge cases, contract tests for the endpoint, and updates the
  OpenAPI spec alongside code.

Status: ✅ Gates satisfied; Geocodio adapter is pluggable with heuristic fallback to honor graceful
degradation. Performance target maintained; security middleware and rate limiting in place; OpenAPI
generation wired from zod schemas.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── app.ts
├── server.ts
├── config/
├── routes/
│   └── validate.ts
├── controllers/
├── schemas/
├── services/
├── validation/
│   ├── index.ts
│   ├── validator.ts
│   ├── heuristic.ts
│   └── providers/
│       └── geocodio.ts
├── lib/
├── middlewares/
├── openapi/
└── infra/

tests/
├── unit/
├── integration/
└── fixtures/

public/
.husky/
```

**Structure Decision**: Single backend service with Express; validation engine includes Geocodio
adapter and heuristic fallback; schemas drive OpenAPI; tests split unit/integration.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
