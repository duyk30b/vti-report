import { NatsConfig } from '@core/config/nats.config';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { NatsClientService } from './nats-client.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(NatsConfig)],
  providers: [
    {
      provide: 'NATS_CLIENT_SERVICE',
      inject: [NatsConfig.KEY],
      useFactory: (natsConfig: ConfigType<typeof NatsConfig>) => {
        return ClientProxyFactory.create({
          transport: Transport.NATS,
          options: {
            servers: natsConfig.servers,
            headers: { 'x-version': '1.0.0' },
          },
        });
      },
    },
    NatsClientService,
  ],
  exports: [NatsClientService],
})
export class NatsClientModule {}
