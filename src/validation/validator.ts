import type {
  AddressRequest,
  AddressResponse,
  ValidationStatus,
} from '../schemas/address';

export type ValidationOutcome = AddressResponse;

export interface Validator {
  validate(input: AddressRequest): Promise<ValidationOutcome>;
}

export type ValidationStatusType = ValidationStatus;
