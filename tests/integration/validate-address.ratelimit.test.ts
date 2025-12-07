import request from 'supertest';

const originalEnv = process.env;

describe('POST /v1/validate-address rate limiting', () => {
  beforeEach(() => {
    process.env = {
      ...originalEnv,
      ENABLE_PROVIDER: 'none',
      RATE_LIMIT_MAX: '1',
      RATE_LIMIT_WINDOW: '1000',
    };
    jest.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it('returns 429 after exceeding limit', async () => {
    const { createApp } = await import('../../src/app');
    const app = createApp();

    await request(app)
      .post('/v1/validate-address')
      .send({ address: '123 Main St, Springfield, IL 62701' })
      .expect(200);

    const resp = await request(app)
      .post('/v1/validate-address')
      .send({ address: '123 Main St, Springfield, IL 62701' })
      .expect(429);

    expect(resp.status).toBe(429);
  });
});
