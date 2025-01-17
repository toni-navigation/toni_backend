import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

import { AuthenticationModule } from '@/authentication/authentication.module';
import { AbilityModule } from '@/casl/casl.module';
import { FavoritesModule } from '@/favorites/favorites.module';
import { postgresConnectionOptions } from '@/ormconfig';
import { PhotonFeaturesModule } from '@/photon-features/photon-features.module';
import { SerializationModule } from '@/serialization/serialization.module';
import { environmentVariablesSchema } from '@/types/EnvironmentVariables';
import { UsersModule } from '@/users/users.module';
import { ValidationModule } from '@/validation/validation.module';
import { EmailModule } from './email/email.module';

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

      dataSourceFactory: async (options: DataSourceOptions) => new DataSource(options).initialize(),
    }),

    ValidationModule,
    SerializationModule,

    UsersModule,

    AuthenticationModule,

    FavoritesModule,

    AbilityModule,

    PhotonFeaturesModule,

    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
