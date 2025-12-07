import request from 'supertest';
import type { AddressResponse } from '../../src/schemas/address';

const originalEnv = process.env;

describe('POST /v1/validate-address transparency', () => {
  beforeEach(() => {
    process.env = { ...originalEnv, ENABLE_PROVIDER: 'none' };
    jest.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it('returns status, confidence, and message for corrected', async () => {
    const { createApp } = await import('../../src/app');
    const app = createApp();
    const response = await request(app)
      .post('/v1/validate-address')
      .send({ address: '1600 pennslyvnia ave, washngton, dc 20500' })
      .expect(200);

    const body = response.body as AddressResponse;
    expect(body.validation_status).toBe('corrected');
    expect(body.confidence).toBeLessThan(1);
    expect(body.message).toBeDefined();
  });

  it('returns status, confidence, and message for unverifiable', async () => {
    const { createApp } = await import('../../src/app');
    const app = createApp();
    const response = await request(app)
      .post('/v1/validate-address')
      .send({ address: '123 Main St' })
      .expect(200);

    const body = response.body as AddressResponse;
    expect(body.validation_status).toBe('unverifiable');
    expect(body.confidence).toBeLessThanOrEqual(0.3);
    expect(body.message).toBeDefined();
  });
});
