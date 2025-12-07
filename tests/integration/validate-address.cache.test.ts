import request from 'supertest';
import { createApp } from '../../src/app';

const validateMock = jest.fn();

jest.mock('../../src/validation', () => ({
  getValidator: jest.fn(() => ({ validate: validateMock })),
}));

describe('validateAddress caching', () => {
  const app = createApp();

  beforeEach(() => {
    validateMock.mockReset();
    validateMock.mockResolvedValue({
      street: '123 Main St',
      number: '123',
      city: 'Testville',
      state: 'TS',
      zip_code: '12345',
      validation_status: 'valid',
      confidence: 1,
      message: undefined,
      corrections: undefined,
    });
  });

  it('reuses cached responses for normalized addresses', async () => {
    const first = await request(app)
      .post('/v1/validate-address')
      .send({ address: ' 123 MAIN ST ' })
      .expect(200);

    const second = await request(app)
      .post('/v1/validate-address')
      .send({ address: '123 main st' })
      .expect(200);

    expect(first.body).toEqual(second.body);
    expect(validateMock).toHaveBeenCalledTimes(1);
  });
});
