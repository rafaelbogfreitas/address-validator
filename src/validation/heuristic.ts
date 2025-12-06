import type { AddressRequest, AddressResponse } from '../schemas/address';
import type { Validator } from './validator';

const normalizeCasing = (text: string) => text.trim().replace(/\s+/g, ' ');

const normalizeAddress = (address: string) => {
  const normalized = normalizeCasing(address);
  return {
    street: normalized,
    number: null,
    city: null,
    state: null,
    zip_code: null,
  };
};

export class HeuristicValidator implements Validator {
  validate(input: AddressRequest): Promise<AddressResponse> {
    const normalized = normalizeAddress(input.address);
    return Promise.resolve({
      ...normalized,
      validation_status: 'unverifiable',
      confidence: 0.2,
      message: 'Heuristic fallback; detailed parsing not yet implemented',
      corrections: [],
    });
  }
}

export const heuristicValidator = new HeuristicValidator();
