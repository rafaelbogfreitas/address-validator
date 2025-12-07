import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env before validation.
loadEnv({
  path: process.env.DOTENV_CONFIG_PATH,
});

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  ENABLE_PROVIDER: z.enum(['geocodio', 'none']).default('none'),
  GEOCODIO_API_KEY: z.string().optional(),
  RATE_LIMIT_WINDOW: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(60),
});

export type AppConfig = z.infer<typeof envSchema>;

export const loadConfig = (): AppConfig => {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; ');
    throw new Error(`Invalid environment configuration: ${issues}`);
  }
  return parsed.data;
};

export const config = loadConfig();
