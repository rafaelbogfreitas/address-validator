import type { AddressRequest, AddressResponse } from '../schemas/address';
import type { Validator } from './validator';

const streetTypos: Record<string, string> = {
  pennslyvnia: 'pennsylvania',
};

const cityTypos: Record<string, string> = {
  washngton: 'washington',
};

const suffixMap: Record<string, string> = {
  avenue: 'Ave',
  ave: 'Ave',
  street: 'St',
  st: 'St',
  road: 'Rd',
  rd: 'Rd',
  boulevard: 'Blvd',
  blvd: 'Blvd',
};

const directionalMap: Record<string, string> = {
  north: 'N',
  n: 'N',
  south: 'S',
  s: 'S',
  east: 'E',
  e: 'E',
  west: 'W',
  w: 'W',
  nw: 'NW',
  ne: 'NE',
  sw: 'SW',
  se: 'SE',
};

const titleCase = (value: string) =>
  value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(' ');

const normalizeStreet = (street: string) => {
  let tokens = street.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0)
    return { street: null, number: null, corrections: [] as string[] };

  const numberToken =
    tokens.length > 0 && /^\d+/.test(tokens[0] ?? '')
      ? (tokens.shift() ?? null)
      : null;
  tokens = tokens.map((t) => t.toLowerCase());

  const corrections: string[] = [];

  tokens = tokens.map((t) => {
    if (streetTypos[t]) {
      corrections.push(`street token corrected ${t} -> ${streetTypos[t]}`);
      return streetTypos[t];
    }
    return t;
  });

  const last = tokens[tokens.length - 1];
  if (last) {
    const mapped = suffixMap[last];
    const mappedDot = suffixMap[`${last}.`];
    if (mapped) {
      tokens[tokens.length - 1] = mapped;
    } else if (mappedDot) {
      tokens[tokens.length - 1] = mappedDot;
    }
  }

  const dir = tokens[tokens.length - 1];
  if (dir && directionalMap[dir]) {
    tokens[tokens.length - 1] = directionalMap[dir];
  }

  const streetName = tokens
    .map((t, idx) => {
      if (idx === tokens.length - 1 && (suffixMap[t] || directionalMap[t])) {
        return tokens[idx];
      }
      return titleCase(t);
    })
    .join(' ');

  return { street: streetName || null, number: numberToken, corrections };
};

const normalizeCity = (city?: string) => {
  if (!city) return { city: null, corrections: [] as string[] };
  const lower = city.trim().toLowerCase();
  if (cityTypos[lower]) {
    return {
      city: titleCase(cityTypos[lower]),
      corrections: [`city corrected ${city} -> ${cityTypos[lower]}`],
    };
  }
  return { city: titleCase(lower), corrections: [] as string[] };
};

const normalizeStateZip = (stateZip?: string) => {
  if (!stateZip) return { state: null, zip: null, corrections: [] as string[] };
  const parts = stateZip.trim().split(/\s+/);
  let state: string | null = null;
  let zip: string | null = null;
  const corrections: string[] = [];
  for (const part of parts) {
    if (/^\d{5}$/.test(part)) {
      zip = part;
    } else if (/^[a-z]{2}$/i.test(part)) {
      state = part.toUpperCase();
      if (part !== part.toUpperCase()) {
        corrections.push(`state uppercased to ${state}`);
      }
    }
  }
  return { state, zip, corrections };
};

export class HeuristicValidator implements Validator {
  validate(input: AddressRequest): Promise<AddressResponse> {
    const parts = input.address
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    const [streetPart, cityPart, stateZipPart] = parts;

    const streetNormalized = streetPart
      ? normalizeStreet(streetPart)
      : { street: null, number: null, corrections: [] as string[] };
    const cityNormalized = normalizeCity(cityPart);
    const stateZipNormalized = normalizeStateZip(stateZipPart);

    const corrections = [
      ...(streetNormalized.corrections ?? []),
      ...(cityNormalized.corrections ?? []),
      ...(stateZipNormalized.corrections ?? []),
    ];

    const normalized: AddressResponse = {
      street: streetNormalized.street,
      number: streetNormalized.number,
      city: cityNormalized.city,
      state: stateZipNormalized.state,
      zip_code: stateZipNormalized.zip,
      validation_status: 'valid',
      confidence: 1,
      message: corrections.length ? 'Corrections applied' : 'Address validated',
      corrections,
    };

    const isValid = corrections.length === 0;

    if (isValid) {
      normalized.validation_status = 'valid';
      normalized.message = 'Address validated';
      normalized.confidence = 1;
    } else {
      normalized.validation_status = 'corrected';
      normalized.message = corrections.join('; ') || 'Corrections applied';
      normalized.confidence = 0.9;
    }

    return Promise.resolve(normalized);
  }
}

export const heuristicValidator = new HeuristicValidator();
