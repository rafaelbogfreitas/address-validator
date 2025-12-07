import request from 'supertest';

describe('POST /v1/validate-address with Geocodio provider', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      ENABLE_PROVIDER: 'geocodio',
      GEOCODIO_API_KEY: 'test-key',
    };
    jest.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it('returns provider-backed validation result when Geocodio is enabled', async () => {
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          results: [
            {
              accuracy: 0.95,
              address_components: {
                number: '1600',
                street: 'Pennsylvania Ave NW',
                city: 'Washington',
                state: 'DC',
                zip: '20500',
              },
            },
          ],
        }),
    } as unknown as Response);

    const { createApp } = await import('../../src/app');
    const app = createApp();
    const response = await request(app)
      .post('/v1/validate-address')
      .send({ address: '1600 pennslyvnia ave, washngton' })
      .expect(200);

    expect(mockFetch).toHaveBeenCalled();
    const body = response.body as {
      validation_status: string;
      street: string;
      city: string;
      state: string;
      zip_code: string;
    };
    expect(body.validation_status).toBe('valid');
    expect(body.street).toContain('Pennsylvania');
    expect(body.city).toBe('Washington');
    expect(body.state).toBe('DC');
    expect(body.zip_code).toBe('20500');
  });

  it('falls back to heuristic when provider fails', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    } as unknown as Response);

    const { createApp } = await import('../../src/app');
    const app = createApp();
    const response = await request(app)
      .post('/v1/validate-address')
      .send({ address: '123 unknown' })
      .expect(200);

    const body = response.body as { validation_status: string };
    expect(body.validation_status).toBeDefined();
  });
});
