import request from 'supertest';
import { createApp } from '../../src/app';

const app = createApp();

describe('POST /v1/validate-address invalid input', () => {
  it('returns 400 when address is missing', async () => {
    const response = await request(app)
      .post('/v1/validate-address')
      .send({})
      .expect(400);
    const body = response.body as { status: number; title?: string };
    expect(body.status).toBe(400);
    expect(body.title).toBeDefined();
  });
});
