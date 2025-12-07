import { CacheService } from '../../../src/services/CacheService';

describe('CacheService', () => {
  it('stores and retrieves values', () => {
    const cache = new CacheService<string>();
    cache.set('key', 'value');

    expect(cache.get('key')).toBe('value');
    expect(cache.get('missing')).toBeUndefined();
  });

  it('normalizes keys when provided', () => {
    const cache = new CacheService<number>((key: string) =>
      key.trim().toLowerCase(),
    );
    cache.set(' Address ', 1);

    expect(cache.get('address')).toBe(1);
    expect(cache.get(' address ')).toBe(1);
  });

  it('remembers computed values and caches them', async () => {
    const cache = new CacheService<number>();
    const factory = jest.fn(() => Promise.resolve(42));

    const first = await cache.remember('answer', factory);
    const second = await cache.remember('answer', factory);

    expect(first).toBe(42);
    expect(second).toBe(42);
    expect(factory).toHaveBeenCalledTimes(1);
  });
});
