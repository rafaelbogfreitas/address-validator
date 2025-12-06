import { heuristicValidator } from '../../../src/validation';

describe('HeuristicValidator', () => {
  it('corrects common typos and returns corrected status', async () => {
    const result = await heuristicValidator.validate({
      address: '1600 pennslyvnia ave, washngton, dc 20500',
    });

    expect(result.validation_status).toBe('corrected');
    expect(result.street).toContain('Pennsylvania');
    expect(result.city).toBe('Washington');
    expect(result.state).toBe('DC');
    expect(result.zip_code).toBe('20500');
    expect(result.confidence).toBeLessThan(1);
  });

  it('returns valid when no corrections needed', async () => {
    const result = await heuristicValidator.validate({
      address: '1600 Pennsylvania Ave NW, Washington, DC 20500',
    });

    expect(result.validation_status).toBe('valid');
    expect(result.confidence).toBe(1);
  });

  it('normalizes directionals, suffixes, and state casing', async () => {
    const result = await heuristicValidator.validate({
      address: '500 n main street, portland, or 97201',
    });

    expect(result.validation_status).toBe('corrected');
    expect(result.street).toBe('N Main St');
    expect(result.number).toBe('500');
    expect(result.city).toBe('Portland');
    expect(result.state).toBe('OR');
    expect(result.zip_code).toBe('97201');
  });

  it('normalizes suffix with punctuation', async () => {
    const result = await heuristicValidator.validate({
      address: '42 elm ave., springfield, il 62704',
    });

    expect(result.street).toContain('Ave');
    expect(result.zip_code).toBe('62704');
    expect(result.validation_status).toBe('corrected');
  });
});
