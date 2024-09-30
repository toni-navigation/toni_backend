import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { environmentVariablesSchema } from '@/types/EnvironmentVariables';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: environmentVariablesSchema.parse,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
