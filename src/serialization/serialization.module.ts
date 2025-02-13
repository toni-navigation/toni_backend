import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({ providers: [{ provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor }] })
export class SerializationModule {}
