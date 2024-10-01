import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { EnvironmentVariables } from '@/types/EnvironmentVariables';

config();

const configService = new ConfigService<EnvironmentVariables, true>();

export const postgresConnectionOptions: PostgresConnectionOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST', { infer: true }),
  port: configService.get('DB_PORT', { infer: true }),
  username: configService.get('DB_USERNAME', { infer: true }),
  password: configService.get('DB_PASSWORD', { infer: true }),
  database: configService.get('DB_DATABASE', { infer: true }),
  entities: [configService.get('TYPEORM_ENTITIES', { infer: true })],
  migrations: [configService.get('TYPEORM_MIGRATIONS', { infer: true })],
  migrationsRun: configService.get('TYPEORM_MIGRATIONS_RUN', { infer: true }),
  synchronize: configService.get('TYPEORM_SYNCHRONIZE', { infer: true }),
};

export const postgresDataSource = new DataSource(postgresConnectionOptions);
