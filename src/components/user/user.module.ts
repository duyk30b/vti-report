import { ConfigService } from '@core/config/config.service';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [ConfigModule],
  exports: [
    'USER_SERVICE_CLIENT',
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
  ],
  providers: [
    ConfigService,
    {
      provide: 'USER_SERVICE_CLIENT',
      useFactory: (configService: ConfigService) => {
        const userServiceOptions = configService.get('userService');
        return ClientProxyFactory.create(userServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
  ],
  controllers: [],
})
export class UserModule {}
