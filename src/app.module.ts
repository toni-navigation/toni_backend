import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

import { postgresConnectionOptions } from '@/ormconfig';
import { environmentVariablesSchema } from '@/types/EnvironmentVariables';
import { UsersModule } from '@/users/users.module';
import { AuthenticationModule } from '@/authentication/authentication.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: environmentVariablesSchema.parse,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...postgresConnectionOptions,
        entities: [],
        migrations: ['dist/migrations/*.js'],
        autoLoadEntities: true,
      }),

      dataSourceFactory: async (options: DataSourceOptions) =>
        new DataSource(options).initialize(),
    }),
    UsersModule,
    AuthenticationModule,


  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
