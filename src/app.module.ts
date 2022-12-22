import * as dotenv from 'dotenv';
import { ValidationPipe } from '@core/pipe/validation.pipe';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from '@core/core.module';
import { I18nJsonLoader, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { BootModule } from '@nestcloud/boot';
import { resolve } from 'path';
import { HttpClientModule } from '@core/components/http-client/http-client.module';
import { KongGatewayModule } from '@core/components/kong-gateway/kong-gateway.module';
import { ConsulModule } from '@nestcloud/consul';
import { ServiceModule } from '@nestcloud/service';
import { BOOT, CONSUL } from '@nestcloud/common';
import { AuthModule } from '@components/auth/auth.module';
import { AuthorizationGuard } from '@core/guards/authorization.guard';
import DatabaseConfigService from '@core/config/database.config';
import { ClientOpts } from '@nestjs/microservices/external/redis.interface';
import * as redisStore from 'cache-manager-redis-store';
import { SyncModule } from '@components/sync/sync.module';
import { ExportModule } from '@components/export/export.module';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from '@core/config/config.service';
import { DashboardModule } from '@components/dashboard/dashboard.module';

dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'vi',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [{ use: QueryResolver, options: ['lang', 'locale', 'l'] }],
    }),
    MongooseModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
    BootModule.forRoot({
      filePath: resolve(__dirname, '../config.yaml'),
    }),

    CacheModule.register<ClientOpts>({
      store: redisStore,
      host: process.env.REDIS_CACHE_HOST || 'redis_cache',
      port: parseInt(process.env.REDIS_CACHE_PORT) || 6379,
      ttl: 10,
      isGlobal: true,
    }),

    HttpClientModule,
    ConsulModule.forRootAsync({ inject: [BOOT] }),
    ServiceModule.forRootAsync({ inject: [BOOT, CONSUL] }),
    KongGatewayModule.forRootAsync(),
    CoreModule,
    AuthModule,
    SyncModule,
    ExportModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
    ConfigService,
    {
      provide: 'USER_SERVICE',
      useFactory: (configService: ConfigService) => {
        const userServiceOptions = configService.get('userService');
        return ClientProxyFactory.create(userServiceOptions);
      },
      inject: [ConfigService],
    },
    AppService,
  ],
})
export class AppModule {}
