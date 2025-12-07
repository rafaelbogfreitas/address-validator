---

description: "Task list template for feature implementation"
---

# Tasks: Address Validation API

**Input**: Design documents from `/specs/001-address-validation/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include contract, unit, and integration tests covering parsing, normalization, validation
edge cases, and error handling as required by the constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and baseline tooling

- [X] T001 Initialize npm project with required scripts and metadata in package.json
- [X] T002 Install runtime dependencies (express, helmet, cors, compression, morgan, express-rate-limit, zod) in package.json
- [X] T003 Install dev dependencies (typescript, tsx/ts-node, jest, @types/jest, supertest, @types/supertest, eslint, prettier, @typescript-eslint/*, husky, lint-staged, @commitlint/config-conventional, @commitlint/cli, @anatine/zod-openapi) in package.json
- [X] T004 Create strict TypeScript config (tsconfig.json) with rootDir src, outDir dist, ES2022/ESNext targets, noUncheckedIndexedAccess
- [X] T005 Add linting/formatting configs (.eslintrc.*, .prettierrc, .eslintignore, .prettierignore) aligned to TypeScript
- [X] T006 Add Jest config (jest.config.ts) with ts-jest or swc, coverage threshold ≥90%, setup for integration tests
- [X] T007 Configure Husky hooks and lint-staged (pre-commit, commit-msg, pre-push) and commitlint.config.cjs
- [X] T008 Add environment template (.env.example) with PORT, NODE_ENV, ENABLE_PROVIDER, provider keys, RATE_LIMIT_WINDOW, RATE_LIMIT_MAX
- [X] T009 Create initial source/test folder structure (src/, tests/unit/, tests/integration/, tests/fixtures/, public/, .husky/)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T010 Scaffold Express bootstrap (src/server.ts, src/app.ts) with JSON body parsing, helmet, cors allowlist placeholder, morgan (dev), base `/v1` router mount, graceful shutdown
- [X] T011 Add rate limiting middleware and configuration (src/middlewares/rate-limit.ts) targeting ~60 req/min/IP for /v1/validate-address
- [X] T012 Implement RFC 7807 error/404 handling without stack traces (src/middlewares/error-handler.ts, src/lib/problem.ts)
- [X] T013 Implement config loader/validator for env settings (src/config/index.ts) with defaults and production fail-fast
- [X] T014 Add request ID middleware and logger wiring (src/middlewares/request-id.ts, src/lib/logger.ts) with concise prod logging
- [X] T015 Define validation contracts and types (statuses, confidence, corrections) (src/validation/validator.ts)
- [X] T016 Stub heuristic validator and USPS normalization helpers (src/validation/heuristic.ts) plus barrel export (src/validation/index.ts)
- [X] T017 Define zod schemas for request/response and problem details (src/schemas/address.ts) including OpenAPI metadata
- [X] T018 Wire base router and controller placeholders for /v1/validate-address (src/routes/validate.ts, src/controllers/validate-controller.ts)
- [X] T019 Seed test fixtures for addresses and abbreviations (tests/fixtures/addresses.json)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Correct and standardize a free-form US address (Priority: P1) 🎯 MVP

**Goal**: Return USPS-compliant normalized address with status `valid` or `corrected` and rationale

**Independent Test**: POST a typo-laden address and receive corrected fields, status `corrected`, and explanations

### Tests for User Story 1 ⚠️

- [X] T020 [P] [US1] Unit tests for normalization/heuristic happy paths and typo corrections (tests/unit/validation/heuristic.test.ts)
- [X] T021 [P] [US1] Integration tests for `/v1/validate-address` valid/corrected responses (tests/integration/validate-address.corrected.test.ts)
- [ ] T041 [P] [US1] Integration tests for provider success and heuristic fallback (tests/integration/validate-address.provider.test.ts)

### Implementation for User Story 1

- [X] T022 [P] [US1] Implement USPS normalization helpers (directionals, suffixes, casing) (src/validation/heuristic.ts)
- [X] T023 [US1] Implement heuristic validator for valid/corrected outcomes with corrections list (src/validation/heuristic.ts, src/validation/index.ts)
- [X] T024 [US1] Finalize zod response schemas for valid/corrected cases and union types (src/schemas/address.ts)
- [X] T025 [US1] Implement controller/service flow for `/v1/validate-address` returning normalized output (src/controllers/validate-controller.ts, src/routes/validate.ts)
- [X] T026 [US1] Wire OpenAPI generation inputs for endpoint schemas (src/app.ts, src/schemas/address.ts)
- [ ] T042 [P] [US1] Implement provider interface wiring with selection (Geocodio or heuristic) (src/validation/index.ts, src/validation/validator.ts, src/config/index.ts)
- [ ] T043 [US1] Implement Geocodio provider adapter using config/env and HTTP client (src/validation/providers/geocodio.ts)

**Checkpoint**: User Story 1 independently testable (valid/corrected paths)

---

## Phase 4: User Story 2 - Handle ambiguous or incomplete addresses gracefully (Priority: P2)

**Goal**: Return best-effort structured data with `unverifiable` status and reasons for missing/ambiguous input

**Independent Test**: Submit missing ZIP or conflicting locality; receive partial fields, status `unverifiable`, and clear reasons

### Tests for User Story 2 ⚠️

- [X] T027 [P] [US2] Unit tests for unverifiable scenarios (missing ZIP, conflicting locality, non-US cues) (tests/unit/validation/heuristic-unverifiable.test.ts)
- [X] T028 [P] [US2] Integration tests for `/v1/validate-address` unverifiable responses (tests/integration/validate-address.unverifiable.test.ts)
- [X] T029 [P] [US2] Integration test for rate limiting on `/v1/validate-address` (tests/integration/validate-address.ratelimit.test.ts)

### Implementation for User Story 2

- [X] T030 [US2] Extend heuristic to detect ambiguous/incomplete/non-US inputs and return `unverifiable` with partial fields (src/validation/heuristic.ts)
- [X] T031 [US2] Ensure controller/schema support partial fields and reasons for unverifiable outcomes (src/controllers/validate-controller.ts, src/schemas/address.ts)

**Checkpoint**: User Story 2 independently testable (unverifiable flows and rate limiting)

---

## Phase 5: User Story 3 - Provide actionable transparency to calling systems (Priority: P3)

**Goal**: Deliver confidence, messages, corrections, and consistent RFC 7807 errors for integrators

**Independent Test**: Requests return status, confidence, and human-readable reasons; errors follow RFC 7807 without stack traces

### Tests for User Story 3 ⚠️

- [X] T032 [P] [US3] Integration tests verifying status/confidence/message across valid/corrected/unverifiable (tests/integration/validate-address.transparency.test.ts)

### Implementation for User Story 3

- [X] T033 [US3] Implement confidence scoring and corrections/message enrichment in validator outputs (src/validation/index.ts, src/validation/heuristic.ts)
- [X] T034 [US3] Harden RFC 7807 error responses and logging without stack traces (src/middlewares/error-handler.ts, src/lib/logger.ts)
- [X] T035 [US3] Generate and serve OpenAPI at `/docs` (docs script + static hosting) (src/app.ts, package.json scripts, public/openapi.json)

**Checkpoint**: User Story 3 independently testable (transparency and error consistency)

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T036 Add ADR describing provider strategy and fallback plan (.docs/adr-provider-strategy.md)
- [ ] T037 Update README with setup, scripts, example curl, docs URL (README.md)
- [ ] T038 Add CI workflow for lint/typecheck/lint-staged/test/coverage gates (.github/workflows/ci.yml)
- [ ] T039 Ensure lint-staged configuration in package.json matches Husky hooks and commands
- [ ] T040 Generate and check in OpenAPI artifact for reference (public/openapi.json)

---

## Dependencies & Execution Order

- Setup (Phase 1) → Foundational (Phase 2) → User Stories (Phases 3–5) → Polish (Phase 6)
- User stories can proceed in priority order: US1 → US2 → US3 (each independently testable once prior phases complete)

---

## Parallel Opportunities

- Parallel in Setup: dependency installation (T002, T003) and config files (T004–T008) after package.json exists
- Parallel in Foundation: middleware scaffolds (T010–T014) can proceed concurrently once structure exists; schemas/validation stubs (T015–T018) can parallelize
- Parallel in US1: normalization code (T022) and unit tests (T020) can run with schema work (T024) once stubs exist
- Parallel in US2: heuristic changes (T030) with unit/integration tests (T027, T028, T029)
- Parallel in US3: confidence/logging (T033, T034) with OpenAPI serving (T035)

---

## Implementation Strategy

1. Complete Setup and Foundational phases.
2. Deliver MVP with User Story 1 (valid/corrected flows + contract tests).
3. Add User Story 2 (unverifiable handling and rate limiting).
4. Add User Story 3 (transparency, confidence, RFC 7807 consistency, docs).
5. Finish Polish items (ADR, README, CI, OpenAPI artifact).
