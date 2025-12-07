import { heuristicValidator } from '../../../src/validation';

describe('HeuristicValidator unverifiable scenarios', () => {
  it('returns unverifiable for missing city/state/zip', async () => {
    const result = await heuristicValidator.validate({
      address: '123 Main St',
    });

    expect(result.validation_status).toBe('unverifiable');
    expect(result.confidence).toBeLessThanOrEqual(0.3);
    expect(result.message).toContain('Missing');
  });

  it('returns unverifiable for non-US cues', async () => {
    const result = await heuristicValidator.validate({
      address: '10 Downing St, London',
    });

    expect(result.validation_status).toBe('unverifiable');
    expect(result.message).toContain('non-US');
  });

  it('returns unverifiable for invalid ZIP format', async () => {
    const result = await heuristicValidator.validate({
      address: '500 Elm St, Dallas, TX 75A01',
    });

    expect(result.validation_status).toBe('unverifiable');
    expect(result.message).toContain('ZIP');
  });
});
