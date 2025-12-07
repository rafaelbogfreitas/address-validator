# Data Model: Address Validation API

**Feature**: specs/001-address-validation/spec.md  
**Date**: 2024-12-06  
**Branch**: 001-address-validation

## Entities

- **FreeFormAddressInput**
  - Fields: `address` (string; required, non-empty, trimmed)
  - Purpose: Input payload from clients.

- **NormalizedAddress**
  - Fields: `street` (string), `number` (string), `city` (string), `state` (2-letter code),
    `zip_code` (ZIP5 string)
  - Rules: USPS casing/abbreviations; ZIP5 validated; state normalized to 2 letters.

- **ValidationResult**
  - Fields: `validation_status` (`valid` | `corrected` | `unverifiable`), `confidence` (qualitative
    or numeric band), `message` (human-readable explanation), `corrections` (list/diff of applied
    fixes).
  - Relationships: References `NormalizedAddress` for structured fields.

## Validation States

- **valid**: Exact or deterministic match; no corrections applied.
- **corrected**: Heuristic or provider-backed corrections applied with high confidence; corrections
  listed.
- **unverifiable**: Insufficient or conflicting data; partial fields may be present; message explains
  gaps/ambiguity.

## Invariants & Constraints

- Always return structured fields (street/number/city/state/zip_code) even if partial/empty when
  unverifiable.
- State must be 2-letter uppercase; ZIP must be 5 digits when present.
- Messages/corrections must align with applied normalization steps to maintain transparency.
