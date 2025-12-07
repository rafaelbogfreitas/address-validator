# Research: Address Validation API

**Feature**: specs/001-address-validation/spec.md  
**Date**: 2024-12-06  
**Branch**: 001-address-validation

## Provider Strategy

- **Decision**: Implement a provider-agnostic `Validator` interface with a Geocodio adapter and a
  default heuristic/local parser for offline/dev. Start with Geocodio when configured; fallback to
  heuristic on failure or when disabled via config flag.
- **Rationale**: Geocodio offers US address parsing/standardization with reasonable quotas and clear
  API; abstraction keeps extensibility and failover while keeping v1 deliverable.
- **Alternatives considered**: USPS Web Tools/Smarty (require separate credentials, quotas, and
  potentially stricter TOS); delaying provider abstraction (would block adding other providers later).

## Normalization Rules

- **Decision**: Enforce USPS casing/abbreviations (street suffixes, directional prefixes/suffixes),
  ZIP5 format, state as 2-letter codes, and stable field ordering. Apply deterministic correction
  where high confidence; otherwise mark unverifiable with reasons.
- **Rationale**: Aligns with constitution accuracy principle and user requirement for USPS
  compliance.
- **Alternatives considered**: Free-form normalization (too loose, inconsistent); accepting ZIP+4
  now (out of scope; defer).

## Error Handling & Transparency

- **Decision**: Use RFC 7807 `application/problem+json` for errors; centralized handler strips stack
  traces in prod. Always return `validation_status`, `message`, `corrections`, and confidence for
  successful responses.
- **Rationale**: Meets transparency and security principles; consistent client experience.
- **Alternatives considered**: Ad-hoc JSON errors (inconsistent), exposing stack traces in non-prod
  (avoids risk of leaking in prod).

## Performance & Rate Limiting

- **Decision**: Target <500 ms typical; track p95. Apply `express-rate-limit` (~60 req/min/IP) for
  `/v1/validate-address`; size limits and compression enabled.
- **Rationale**: Meets requirement and constitution performance/abuse prevention.
- **Alternatives considered**: Higher limits (risk abuse), lower limits (may throttle legitimate use).

## OpenAPI Generation

- **Decision**: Generate OpenAPI from zod schemas (prefer zod-to-openapi; fallback swagger-jsdoc if
  needed) and serve at `/docs` read-only.
- **Rationale**: Keeps contract in sync with validation schemas and constitution doc requirements.
- **Alternatives considered**: Hand-written spec (drift risk), runtime Swagger decorators (heavier).

## Testing Approach

- **Decision**: Jest + supertest with ≥90% coverage; unit tests for parsers/normalizers and
  heuristics; integration tests for `/v1/validate-address` covering valid/corrected/unverifiable,
  invalid JSON, and rate limiting; golden fixtures for USPS abbreviations.
- **Rationale**: Aligns with constitution testability and user requirements.
- **Alternatives considered**: Lower coverage target (insufficient rigor); end-to-end only (gaps in
  parsing logic coverage).
