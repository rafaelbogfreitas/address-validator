# Contract: POST /v1/validate-address

**Purpose**: Validate and normalize a free-form US address into USPS-compliant fields with status,
confidence, and reasoning.

## Request

- Method: POST
- Path: `/v1/validate-address`
- Headers: `Content-Type: application/json`
- Body:

```json
{
  "address": "1600 pennslyvnia ave, washngton"
}
```

Validation:
- `address`: required, non-empty string; trimmed; max length (e.g., 500 chars) to prevent abuse.

## Success Responses

- Status: 200 OK
- Body (valid or corrected):

```json
{
  "street": "1600 Pennsylvania Ave NW",
  "number": "1600",
  "city": "Washington",
  "state": "DC",
  "zip_code": "20500",
  "validation_status": "corrected",
  "confidence": 0.9,
  "message": "Corrected street spelling and normalized city/state",
  "corrections": [
    "street normalized to Pennsylvania Ave NW",
    "city corrected to Washington",
    "state set to DC",
    "zip corrected to 20500"
  ]
}
```

- Body (unverifiable):

```json
{
  "street": "Main St",
  "number": null,
  "city": "Springfield",
  "state": null,
  "zip_code": null,
  "validation_status": "unverifiable",
  "confidence": 0.2,
  "message": "Missing house number and ambiguous state for city",
  "corrections": []
}
```

## Error Responses (RFC 7807)

- Status: 400 Bad Request (validation failure)

```json
{
  "type": "https://example.com/errors/validation",
  "title": "Invalid request body",
  "status": 400,
  "detail": "address is required",
  "instance": "/v1/validate-address"
}
```

- Status: 429 Too Many Requests (rate limited)
- Status: 500 Internal Server Error (no stack traces; generic message; logged internally)

## Notes

- Versioned via URL prefix `/v1`.
- OpenAPI generated from zod schemas and served at `/docs` (read-only).
- Provider selection via config (USPS, Smarty, heuristic fallback); behavior remains contract-stable.
