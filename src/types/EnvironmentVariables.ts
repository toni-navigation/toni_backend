import { z } from 'zod';

export const environmentVariablesSchema = z.object({
  DB_HOST: z.string().optional(),
  DB_PORT: z.string().regex(/^\d+$/).transform(Number).optional(),
  DB_USERNAME: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  DB_DATABASE: z.string().optional(),
  DATABASE_URL: z.string().optional(),

  TYPEORM_ENTITIES: z.string(),
  TYPEORM_MIGRATIONS: z.string(),
  TYPEORM_MIGRATIONS_RUN: z.enum(['true', 'false']).transform((value) => value === 'true'),
  TYPEORM_SYNCHRONIZE: z.enum(['true', 'false']).transform((value) => value === 'true'),

  CORS_ORIGIN: z.string(),

  JWT_SECRET: z.string(),
  JWT_EXPIRATION_TIME: z.string().regex(/^\d+$/).transform(Number),
  JWT_COOKIE_NAME: z.string(),
  JWT_COOKIE_SECURE: z.enum(['true', 'false']).transform((value) => value === 'true'),

  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().regex(/^\d+$/).transform(Number),
  SMTP_SECURE: z.enum(['true', 'false']).transform((value) => value === 'true'),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  SMTP_FROM: z.string(),

  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export type EnvironmentVariables = z.infer<typeof environmentVariablesSchema>;
