import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionInterceptor } from './interceptors/exception.interceptor';
// import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transftorm.interceptor';

@Module({
  providers: [
    // { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ExceptionInterceptor },
    // { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class CoreModule {}
