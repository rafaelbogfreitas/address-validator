import { generateSchema } from '@anatine/zod-openapi';
import {
  addressRequestSchema,
  addressResponseUnionSchema,
} from '../schemas/address';

const addressRequest = generateSchema(addressRequestSchema);
const addressResponse = generateSchema(addressResponseUnionSchema);

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Address Validator API',
    version: '1.0.0',
    description: 'API for validating and normalizing US addresses',
  },
  paths: {
    '/v1/validate-address': {
      post: {
        summary: 'Validate and normalize a US address',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: addressRequest,
            },
          },
        },
        responses: {
          '200': {
            description: 'Validation result',
            content: {
              'application/json': {
                schema: addressResponse,
              },
            },
          },
          '400': { description: 'Invalid input' },
          '429': { description: 'Rate limit exceeded' },
          '500': { description: 'Server error' },
        },
      },
    },
  },
  components: {
    schemas: {
      AddressRequest: addressRequest,
      AddressResponse: addressResponse,
    },
  },
};
