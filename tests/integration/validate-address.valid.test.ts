import request from 'supertest';
import type { AddressResponse } from '../../src/schemas/address';

const originalEnv = process.env;

describe('POST /v1/validate-address valid flow', () => {
  beforeEach(() => {
    process.env = { ...originalEnv, ENABLE_PROVIDER: 'none' };
    jest.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it('returns valid when input is already normalized', async () => {
    const { createApp } = await import('../../src/app');
    const app = createApp();
    const response = await request(app)
      .post('/v1/validate-address')
      .send({ address: '1600 Pennsylvania Ave NW, Washington, DC 20500' })
      .expect(200);

    const body = response.body as AddressResponse;
    expect(body.validation_status).toBe('valid');
    expect(body.street).toContain('Pennsylvania');
    expect(body.city).toBe('Washington');
    expect(body.state).toBe('DC');
    expect(body.zip_code).toBe('20500');
    expect(body.confidence).toBeGreaterThanOrEqual(0.95);
  });
});
