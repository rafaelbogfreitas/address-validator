type KeyTransform = (key: string) => string;

export class CacheService<T> {
  private readonly cache = new Map<string, T>();

  constructor(private readonly normalizeKey: KeyTransform = (key) => key) {}

  get(key: string): T | undefined {
    return this.cache.get(this.normalizeKey(key));
  }

  set(key: string, value: T): void {
    this.cache.set(this.normalizeKey(key), value);
  }

  clear(): void {
    this.cache.clear();
  }

  async remember(key: string, factory: () => Promise<T>): Promise<T> {
    const cached = this.get(key);
    if (cached !== undefined) {
      return cached;
    }
    const value = await factory();
    this.set(key, value);
    return value;
  }
}
