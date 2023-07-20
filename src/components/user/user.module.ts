import { ConfigService } from '@core/config/config.service';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [ConfigModule],
  exports: [
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
  ],
  providers: [
    ConfigService,
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
  ],
  controllers: [],
})
export class UserModule {}
