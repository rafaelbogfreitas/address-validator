import request from 'supertest';
import type { AddressResponse } from '../../src/schemas/address';

const originalEnv = process.env;

describe('POST /v1/validate-address unverifiable flow', () => {
  beforeEach(() => {
    process.env = { ...originalEnv, ENABLE_PROVIDER: 'none' };
    jest.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it('returns unverifiable when ZIP is missing', async () => {
    const { createApp } = await import('../../src/app');
    const app = createApp();
    const response = await request(app)
      .post('/v1/validate-address')
      .send({ address: '350 Fifth Ave, New York, NY' })
      .expect(200);

    const body = response.body as AddressResponse;
    expect(body.validation_status).toBe('unverifiable');
    expect(body.message).toContain('Missing');
  });
});
