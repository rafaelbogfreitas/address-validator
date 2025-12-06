import request from 'supertest';
import { createApp } from '../../src/app';
import type { AddressResponse } from '../../src/schemas/address';

const app = createApp();

describe('POST /v1/validate-address corrected flow', () => {
  it('returns corrected address with rationale', async () => {
    const response = await request(app)
      .post('/v1/validate-address')
      .send({ address: '1600 pennslyvnia ave, washngton, dc 20500' })
      .expect(200);

    const body = response.body as AddressResponse;
    expect(body.validation_status).toBe('corrected');
    expect(body.street).toContain('Pennsylvania');
    expect(body.city).toBe('Washington');
    expect(body.state).toBe('DC');
    expect(body.zip_code).toBe('20500');
    expect(body.message).toBeDefined();
  });
});
