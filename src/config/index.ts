import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  ENABLE_PROVIDER: z.enum(['usps', 'smarty', 'none']).default('none'),
  USPS_API_KEY: z.string().optional(),
  SMARTY_AUTH_ID: z.string().optional(),
  SMARTY_AUTH_TOKEN: z.string().optional(),
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
