import type { AddressRequest, AddressResponse } from '../../schemas/address';
import type { Validator } from '../validator';
import { config } from '../../config';

type GeocodioComponents = {
  number?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
};

type GeocodioResult = {
  address_components?: GeocodioComponents;
  formatted?: string;
  accuracy?: number;
};

type GeocodioResponse = {
  results?: GeocodioResult[];
};

const toAddressResponse = (result: GeocodioResult): AddressResponse => {
  const components = result.address_components ?? {};
  const corrections: string[] = [];
  const status =
    result.accuracy && result.accuracy >= 0.9 ? 'valid' : 'corrected';
  return {
    street: components.street ?? null,
    number: components.number ?? null,
    city: components.city ?? null,
    state: components.state ?? null,
    zip_code: components.zip ?? null,
    validation_status: status,
    confidence: Math.min(result.accuracy ?? 0.7, 1),
    message:
      status === 'valid' ? 'Validated via Geocodio' : 'Corrected via Geocodio',
    corrections,
  };
};

export class GeocodioProvider implements Validator {
  constructor(private readonly apiKey: string) {}

  async validate(input: AddressRequest): Promise<AddressResponse> {
    const url = new URL('https://api.geocod.io/v1.9/geocode');
    url.searchParams.set('api_key', this.apiKey);
    url.searchParams.set('q', input.address);

    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) {
      return {
        street: null,
        number: null,
        city: null,
        state: null,
        zip_code: null,
        validation_status: 'unverifiable',
        confidence: 0.2,
        message: `Geocodio error: ${response.status}`,
        corrections: [],
      };
    }

    const data = (await response.json()) as GeocodioResponse;
    const result = data.results?.[0];

    if (!result || !result.address_components) {
      return {
        street: null,
        number: null,
        city: null,
        state: null,
        zip_code: null,
        validation_status: 'unverifiable',
        confidence: 0.2,
        message: 'Geocodio did not return a match',
        corrections: [],
      };
    }

    return toAddressResponse(result);
  }
}

export const geocodioProvider = config.GEOCODIO_API_KEY
  ? new GeocodioProvider(config.GEOCODIO_API_KEY)
  : null;
