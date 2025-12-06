import request from 'supertest';
import { createApp } from '../../src/app';
import type { AddressResponse } from '../../src/schemas/address';

const app = createApp();

describe('POST /v1/validate-address valid flow', () => {
  it('returns valid when input is already normalized', async () => {
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
    expect(body.confidence).toBe(1);
  });
});
