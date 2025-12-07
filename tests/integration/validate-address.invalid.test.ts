import request from 'supertest';

const originalEnv = process.env;

describe('POST /v1/validate-address invalid input', () => {
  beforeEach(() => {
    process.env = { ...originalEnv, ENABLE_PROVIDER: 'none' };
    jest.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it('returns 400 when address is missing', async () => {
    const { createApp } = await import('../../src/app');
    const app = createApp();
    const response = await request(app)
      .post('/v1/validate-address')
      .send({})
      .expect(400);
    const body = response.body as { status: number; title?: string };
    expect(body.status).toBe(400);
    expect(body.title).toBeDefined();
  });
});
