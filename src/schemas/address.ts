import { z } from 'zod';

export const addressRequestSchema = z.object({
  address: z.string().trim().min(1, 'address is required').max(500),
});

export const validationStatusSchema = z.enum([
  'valid',
  'corrected',
  'unverifiable',
]);

export const normalizedAddressSchema = z.object({
  street: z.string().nullable(),
  number: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  zip_code: z.string().nullable(),
});

export const validationResultSchema = z.object({
  validation_status: validationStatusSchema,
  confidence: z.number().min(0).max(1),
  message: z.string().optional(),
  corrections: z.array(z.string()).optional(),
});

export const addressResponseSchema = normalizedAddressSchema.merge(
  validationResultSchema,
);

export type AddressRequest = z.infer<typeof addressRequestSchema>;
export type AddressResponse = z.infer<typeof addressResponseSchema>;
export type ValidationStatus = z.infer<typeof validationStatusSchema>;
