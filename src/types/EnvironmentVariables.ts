import { z } from 'zod';

export const environmentVariablesSchema = z.object({
  DB_HOST: z.string(),
  DB_PORT: z.string().regex(/^\d+$/).transform(Number),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),

  TYPEORM_ENTITIES: z.string(),
  TYPEORM_MIGRATIONS: z.string(),
  TYPEORM_MIGRATIONS_RUN: z.enum(['true', 'false']).transform((value) => value === 'true'),
  TYPEORM_SYNCHRONIZE: z.enum(['true', 'false']).transform((value) => value === 'true'),

  CORS_ORIGIN: z.string(),

  JWT_SECRET: z.string(),
  JWT_EXPIRATION_TIME: z.string().regex(/^\d+$/).transform(Number),
  JWT_COOKIE_NAME: z.string(),
  JWT_COOKIE_SECURE: z.enum(['true', 'false']).transform((value) => value === 'true'),
});

export type EnvironmentVariables = z.infer<typeof environmentVariablesSchema>;
