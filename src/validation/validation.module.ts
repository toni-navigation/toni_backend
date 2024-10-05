import { BadRequestException, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          forbidUnknownValues: true,
          transform: true,
          transformOptions: {
            enableImplicitConversion: true,
          },
          exceptionFactory: (errors) => new BadRequestException(errors),
        }),
    },
  ],
})
export class ValidationModule {}
