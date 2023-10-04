import { Global, Module } from '@nestjs/common'
import { ClientProxyFactory } from '@nestjs/microservices'
import { NatsClientService } from './nats-client.service'
import { NatsConfig } from './nats.config'
import { NatsClientAttributeService } from './service/nats-client-attribute.service'
import { NatsClientAuthService } from './service/nats-client-auth.service'
import { NatsClientItemService } from './service/nats-client-item.service'
import { NatsClientTicketService } from './service/nats-client-ticket.service'
import { NatsClientUserService } from './service/nats-client-user.service'
import { NatsClientWarehouseService } from './service/nats-client-warehouse.service'

@Global()
@Module({
	providers: [
		{
			provide: 'NATS_CLIENT_SERVICE',
			useFactory: () => {
				return ClientProxyFactory.create(NatsConfig)
			},
		},
		NatsClientService,
		NatsClientAuthService,
		NatsClientTicketService,
		NatsClientWarehouseService,
		NatsClientItemService,
		NatsClientAttributeService,
		NatsClientUserService,
	],
	exports: [
		NatsClientService,
		NatsClientAuthService,
		NatsClientTicketService,
		NatsClientWarehouseService,
		NatsClientItemService,
		NatsClientAttributeService,
		NatsClientUserService,
	],
})
export class NatsClientModule { }
