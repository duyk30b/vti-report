import { Injectable } from '@nestjs/common'
import { NatsClientAttributeService } from 'src/modules/nats/service/nats-client-attribute.service'
import { NatsClientItemService } from 'src/modules/nats/service/nats-client-item.service'
import { NatsClientWarehouseService } from 'src/modules/nats/service/nats-client-warehouse.service'
import { EventWarehouseCheckoutConfirmRequest } from '../request'

@Injectable()
export class EventWarehouseCheckoutService {
	constructor(
		private readonly natsClientWarehouseService: NatsClientWarehouseService,
		private readonly natsClientAttributeService: NatsClientAttributeService,
		private readonly natsClientItemService: NatsClientItemService
	) { }

	async warehouseCheckoutConfirm(request: EventWarehouseCheckoutConfirmRequest) {
		console.log('🚀 ~ file: event-warehouse-checkout.service.ts:16 ~ EventWarehouseCheckoutService ~ warehouseCheckoutConfirm ~ request:', request)
	}
}
